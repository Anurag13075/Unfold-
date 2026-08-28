import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";
import { createServiceClient } from "@/lib/supabase";
import { ensureUserExists } from "@/lib/users";
import { Database } from "@/lib/database.types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  await ensureUserExists(userId, session.user.email || undefined, session.user.name || undefined);

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = await req.json();

  const updates: Database["public"]["Tables"]["users"]["Update"] = {
    onboarded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (body.razorpay_key_id) {
    updates.razorpay_key_id = body.razorpay_key_id;
  }
  if (body.razorpay_key_secret) {
    updates.razorpay_key_secret_enc = encrypt(body.razorpay_key_secret);
  }
  if (body.whatsapp_key) updates.whatsapp_key_enc = encrypt(body.whatsapp_key);
  if (body.sms_key) updates.sms_key_enc = encrypt(body.sms_key);
  if (body.email_key) updates.email_key_enc = encrypt(body.email_key);

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user onboarding:", error);
    return NextResponse.json({ error: "Failed to update onboarding info" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
