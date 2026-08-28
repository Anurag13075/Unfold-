import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undrop — Agentic Revenue Recovery for Razorpay",
  description:
    "Undrop reads the pattern across payment failures in real time, surfaces route intelligence, and recovers individual transactions.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Undrop",
    description: "Reactive recovery + proactive route intelligence.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          // @ts-expect-error CSS variables for fonts
          "--font-cabinet": "'Cabinet Grotesk', system-ui, sans-serif",
          "--font-switzer": "'Switzer', system-ui, sans-serif",
          "--font-jetbrains": "'JetBrains Mono', ui-monospace, monospace",
        }}
      >
        {children}
      </body>
    </html>
  );
}
