import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";
import { demoStore } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const user = demoStore.users.get(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (body.razorpay_key_id) {
    user.razorpay_key_id = body.razorpay_key_id;
  }
  if (body.razorpay_key_secret) {
    user.razorpay_key_secret_enc = encrypt(body.razorpay_key_secret);
  }
  if (body.whatsapp_key) user.whatsapp_key_enc = encrypt(body.whatsapp_key);
  if (body.sms_key) user.sms_key_enc = encrypt(body.sms_key);
  if (body.email_key) user.email_key_enc = encrypt(body.email_key);

  user.onboarded_at = new Date().toISOString();
  demoStore.users.set(session.user.id, user);

  return NextResponse.json({ success: true });
}
