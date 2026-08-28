import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

const links = [
  { href: "/sign-up", label: "Sign up" },
  { href: "/sign-in", label: "Sign in" },
  { href: "#", label: "Documentation" },
  { href: "#", label: "Privacy" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-12 relative z-10">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Wordmark className="h-5 w-auto text-text-tertiary" />
          <nav className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-body-m text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-body-m text-text-tertiary">© 2026 Undrop</p>
        </div>
      </div>
    </footer>
  );
}
