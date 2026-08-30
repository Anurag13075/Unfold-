"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { GoogleSignInButton, DemoSignInButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OscilloscopeHero } from "@/components/illustrations/oscilloscope";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const hasGoogle = typeof window !== "undefined" ? true : true;

  return (
    <div className="w-full max-w-[400px]">
      <Wordmark className="h-6 w-auto text-text-primary mb-8" />
      <h1 className="font-display text-display-l text-text-primary mb-2">Welcome back</h1>
      <p className="text-body-m text-text-secondary mb-8">
        Sign in to your Undrop workspace.
      </p>

      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" ? (
        <GoogleSignInButton />
      ) : (
        <DemoSignInButton />
      )}

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-body-s uppercase tracking-wide text-text-tertiary">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" type="email" placeholder="you@company.com" />
        <Input label="Password" type="password" placeholder="••••••••" secret />
        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-body-m text-text-secondary text-center">
        No account?{" "}
        <Link href="/sign-up" className="text-ember-500 hover:text-ember-700 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-[55%_45%] bg-ink-950 grain animate-[fadeIn_200ms_ease-out]">
      <div className="hidden md:flex flex-col justify-end relative p-12 bg-ink-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,255,102,.18),transparent_34%),radial-gradient(ellipse_at_80%_10%,rgba(122,146,255,.12),transparent_30%)]" />
        <OscilloscopeHero className="absolute inset-0 w-full h-full object-cover opacity-60" quiet />
        <p className="relative z-10 text-body-l text-text-secondary max-w-sm">
          Most failed payments aren&apos;t lost. They&apos;re recoverable.
        </p>
      </div>
      <div className="flex items-center justify-center p-8 bg-ink-900/80 md:bg-ink-950">
        <Suspense fallback={<div className="text-text-secondary">Loading...</div>}>
          <div className="app-surface rounded-card p-6 sm:p-8">
            <SignInForm />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
