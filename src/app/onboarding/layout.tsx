import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/users";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.user.id);
  if (user?.onboarded_at) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
