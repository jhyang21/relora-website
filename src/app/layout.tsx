import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { PostHogRouteBridge } from "@/components/analytics/PostHogRouteBridge";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Relora | Personal relationship memory app",
  description: "Join the Relora waitlist and remember the small details that build relationships.",
  metadataBase: new URL("https://www.reloraapp.com"),
  openGraph: {
    title: "Relora waitlist",
    description: "Remember the small details that build relationships.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        <PostHogRouteBridge />
        {children}
      </body>
    </html>
  );
}
