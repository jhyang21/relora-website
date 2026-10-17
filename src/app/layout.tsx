import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { PostHogRouteBridge } from "@/components/analytics/PostHogRouteBridge";
import { buildPageMetadata, siteConfig } from "@/lib/site";
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
  ...buildPageMetadata(),
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  itunes: { appId: siteConfig.appStoreId },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    sameAs: [siteConfig.linkedInUrl],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.creator,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: siteConfig.name,
    operatingSystem: "iOS",
    applicationCategory: "BusinessApplication",
    url: siteConfig.appStoreUrl,
    installUrl: siteConfig.appStoreUrl,
    offers: {
      "@type": "Offer",
      price: "19.99",
      priceCurrency: "USD",
      description: "Free for 7 days, then $19.99 a month",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PostHogRouteBridge />
        {children}
      </body>
    </html>
  );
}
