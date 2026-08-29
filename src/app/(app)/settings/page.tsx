import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const user = userId ? await getUserById(userId) : null;

  return (
    <SettingsClient
      userId={userId}
      workspaceName={user?.workspace_name ?? "My Workspace"}
      razorpayKeyId={user?.razorpay_key_id ?? null}
      hasWebhookSecret={!!user?.razorpay_webhook_secret_enc}
      hasWhatsapp={!!user?.whatsapp_key_enc}
      hasSms={!!user?.sms_key_enc}
      hasEmail={!!user?.email_key_enc}
    />
  );
}
