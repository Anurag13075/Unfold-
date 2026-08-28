import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { demoStore } from "@/lib/supabase";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = demoStore.users.get(session.user.id);
  if (user?.onboarded_at) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
