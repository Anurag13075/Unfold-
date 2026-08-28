import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/users";
import { Sidebar } from "@/components/layout/sidebar";
import { Providers } from "@/components/providers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.user.id);
  if (user && !user.onboarded_at) {
    redirect("/onboarding");
  }

  return (
    <Providers>
      <div className="min-h-screen bg-ink-900 grain">
        <Sidebar
          workspaceName={user?.workspace_name}
          userName={session.user.name ?? undefined}
          userImage={session.user.image}
        />
        <main className="md:ml-60 min-h-screen pb-16 md:pb-0">{children}</main>
      </div>
    </Providers>
  );
}
