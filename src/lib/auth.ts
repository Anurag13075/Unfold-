import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { ensureUserExists } from "./users";

function buildProviders() {
  const providers = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    );
  }

  // Demo provider when no OAuth configured — allows local development
  if (providers.length === 0) {
    providers.push(
      Credentials({
        id: "demo",
        name: "Demo",
        credentials: {
          email: { label: "Email", type: "email" },
        },
        async authorize(credentials) {
          const email = (credentials?.email as string) || "demo@undrop.io";
          return {
            id: "demo-user-1",
            email,
            name: "Demo Merchant",
            image: null,
          };
        },
      })
    );
  }

  return providers;
}

// @ts-ignore
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: buildProviders(),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    // @ts-ignore
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // @ts-ignore
    async session({ session, token }: any) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // @ts-ignore
    async signIn({ user }: any) {
      if (!user.email) return false;

      const userId = user.id || `user-${user.email}`;
      await ensureUserExists(userId, user.email, user.name ?? undefined);

      return true;
    },
  },
  trustHost: true,
});
