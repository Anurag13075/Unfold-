import { auth } from "@/lib/auth";
import { demoStore } from "@/lib/supabase";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = demoStore.users.get(session.user.id);
  return user ?? null;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function isOnboarded(userId: string): Promise<boolean> {
  const user = demoStore.users.get(userId);
  return !!user?.onboarded_at;
}
