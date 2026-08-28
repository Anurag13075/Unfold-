import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user?.id ? await getUserById(session.user.id) : null;

  return (
    <SettingsClient
      workspaceName={user?.workspace_name ?? "My Workspace"}
      razorpayKeyId={user?.razorpay_key_id ?? null}
      hasWhatsapp={!!user?.whatsapp_key_enc}
      hasSms={!!user?.sms_key_enc}
      hasEmail={!!user?.email_key_enc}
    />
  );
}
