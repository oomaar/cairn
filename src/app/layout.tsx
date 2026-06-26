import type { Metadata } from "next";
import { Urbanist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cairn — Expedition Operations",
    template: "%s · Cairn",
  },
  description:
    "Plan, operate, and document real expeditions through a single operations platform.",
  applicationName: "Cairn",
  metadataBase: new URL("https://cairn-expedition.vercel.app"),
  openGraph: {
    title: "Cairn — Expedition Operations",
    description:
      "Plan, operate, and document real expeditions through a single operations platform.",
    url: "https://cairn-expedition.vercel.app",
    siteName: "Cairn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cairn — Expedition Operations",
    description:
      "Plan, operate, and document real expeditions through a single operations platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-app text-fg-1">
        {children}
      </body>
    </html>
  );
}
