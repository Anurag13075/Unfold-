import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/routes",
  "/transactions",
  "/reports",
  "/settings",
];

const authRoutes = ["/sign-in", "/sign-up"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.includes(pathname);
  const isOnboarding = pathname.startsWith("/onboarding");

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isLoggedIn && !isOnboarding && isProtected) {
    const userId = req.auth?.user?.id;
    if (userId) {
      // Dynamic import to avoid edge issues — use inline check via header
      // Onboarding gate handled in layout for reliability
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/routes/:path*",
    "/transactions/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/sign-in",
    "/sign-up",
    "/onboarding/:path*",
  ],
};
