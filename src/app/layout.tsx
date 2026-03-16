import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Architect Prep — Certification Practice",
  description:
    "Practice exam for the Claude Certified Architect — Foundations certification. Scenario-based questions across all 5 domains.",
  keywords: ["Claude", "Anthropic", "certification", "practice exam", "AI architect"],
  openGraph: {
    title: "Claude Architect Prep",
    description: "Practice for the Claude Certified Architect — Foundations certification.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#141412" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
