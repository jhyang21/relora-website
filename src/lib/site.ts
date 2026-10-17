import type { Metadata } from "next";

const appStoreId = "6761505803";
const appStoreUrl = `https://apps.apple.com/app/id${appStoreId}`;

export const siteConfig = {
  name: "Relora",
  creator: "immForm, Inc.",
  url: "https://www.reloraapp.com",
  title: "Relora: voice notes that remember your clients",
  description:
    "Talk for 30 seconds after a call. Relora saves the note, the key facts, and the follow-up on that contact. iPhone. Free for 7 days.",
  contactEmail: "andrew@immform.com",
  linkedInUrl: "https://www.linkedin.com/in/junhyeok-andrew-yang/",
  appStoreId,
  appStoreUrl,
} as const;

/**
 * App Store link tagged with an App Store Connect campaign token (`ct`).
 * Apple ignores `ct` without a provider token (`pt`), so the link stays bare
 * until NEXT_PUBLIC_APP_STORE_PT is set.
 */
export function appStoreLink(ct: string): string {
  const pt = process.env.NEXT_PUBLIC_APP_STORE_PT?.trim();
  if (!pt) {
    return appStoreUrl;
  }
  const params = new URLSearchParams({ pt, ct, mt: "8" });
  return `${appStoreUrl}?${params.toString()}`;
}

const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
};

export const sitemapRoutes = [
  {
    label: "Home",
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    label: "Privacy policy",
    path: "/privacy",
    changeFrequency: "yearly",
    priority: 0.2,
  },
  {
    label: "Terms of use",
    path: "/terms",
    changeFrequency: "yearly",
    priority: 0.2,
  },
] as const;

type BuildPageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  robots?: Metadata["robots"];
};

export function buildPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  robots = defaultRobots,
}: BuildPageMetadataOptions = {}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  // Child pages replace the inherited openGraph and twitter objects, so the
  // root opengraph-image.tsx only reaches "/" unless each page names it.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.title }];

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: url,
    },
    robots,
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images,
    },
  };
}
