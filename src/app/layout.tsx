import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuraTransit — Every school journey, connected and cared for",
  description:
    "AuraTransit is a school transportation management platform that connects schools, parents, drivers and students in one calm, reliable system.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full bg-ivory font-sans text-ink">{children}</body>
    </html>
  );
}
