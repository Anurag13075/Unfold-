import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";
import { createServiceClient } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { NextResponse } from "next/server";

// Saves each merchant's OWN outreach channel credentials. These are what
// the per-user webhook (/api/webhooks/razorpay/[userId]) uses to actually
// auto-send recovery messages for THIS merchant's failed payments — never
// falling back to the app owner's global env keys, so one merchant's
// outreach can never be sent through another merchant's Twilio/Resend/
// Telegram account.
//
// Stored formats (all encrypted at rest via src/lib/encryption.ts):
//   email_key_enc:     plain Resend API key string
//   sms_key_enc:       JSON string {"sid","token","from"}       (Twilio SMS)
//   whatsapp_key_enc:  JSON string {"sid","token","from"}       (Twilio WhatsApp sender,
//                      e.g. "whatsapp:+14155238886" or a plain number —
//                      the "whatsapp:" prefix is added automatically if missing)
//   telegram_key_enc:  JSON string {"botToken","chatId"}
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = await req.json();
  const updates: Database["public"]["Tables"]["users"]["Update"] = {
    updated_at: new Date().toISOString(),
  };

  if (body.resendApiKey) {
    updates.email_key_enc = encrypt(body.resendApiKey);
  }

  if (body.twilioSid && body.twilioToken && body.twilioSmsFrom) {
    updates.sms_key_enc = encrypt(
      JSON.stringify({ sid: body.twilioSid, token: body.twilioToken, from: body.twilioSmsFrom })
    );
  }

  if (body.twilioSid && body.twilioToken && body.twilioWhatsappFrom) {
    updates.whatsapp_key_enc = encrypt(
      JSON.stringify({ sid: body.twilioSid, token: body.twilioToken, from: body.twilioWhatsappFrom })
    );
  }

  if (body.telegramBotToken && body.telegramChatId) {
    updates.telegram_key_enc = encrypt(
      JSON.stringify({ botToken: body.telegramBotToken, chatId: body.telegramChatId })
    );
  }

  if (Object.keys(updates).length === 1) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase.from("users").update(updates).eq("id", userId);

  if (error) {
    console.error("Error updating outreach settings:", error);
    return NextResponse.json({ error: "Failed to update outreach settings" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
