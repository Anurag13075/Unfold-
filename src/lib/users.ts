import { createServiceClient } from "./supabase";
import type { DbUser } from "@/types";

export async function ensureUserExists(userId: string, email?: string, name?: string) {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!existing) {
    const userEmail = email || `${userId}@example.com`;
    const { data: newUser, error } = await supabase
      .from("users")
      .upsert({
        id: userId,
        email: userEmail,
        name: name || "Demo User",
        workspace_name: "My Workspace",
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }
    return newUser as unknown as DbUser;
  }

  return existing as unknown as DbUser;
}

export async function getUserById(userId: string): Promise<DbUser | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return data as unknown as DbUser;
}
