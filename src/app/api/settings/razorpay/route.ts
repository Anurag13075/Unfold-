import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";
import { createServiceClient } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { NextResponse } from "next/server";

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

  if (body.razorpay_key_id !== undefined) {
    updates.razorpay_key_id = body.razorpay_key_id;
  }
  if (body.razorpay_webhook_secret) {
    updates.razorpay_webhook_secret_enc = encrypt(body.razorpay_webhook_secret);
  }
  if (body.razorpay_key_secret) {
    updates.razorpay_key_secret_enc = encrypt(body.razorpay_key_secret);
  }

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating Razorpay settings:", error);
    return NextResponse.json({ error: "Failed to update Razorpay settings" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
