import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await getUserById(session.user.id);
  return user;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function isOnboarded(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return !!user?.onboarded_at;
}
