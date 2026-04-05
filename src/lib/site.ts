import type { Metadata } from "next";

export const siteConfig = {
  name: "Relora",
  creator: "immForm, Inc.",
  url: "https://www.reloraapp.com",
  title: "Relora | Personal relationship memory app",
  description:
    "Relora turns quick voice notes into structured context tied to contacts so you can remember the small details that build relationships.",
  contactEmail: "contact@immform.com",
  linkedInUrl: "https://www.linkedin.com/in/junhyeok-andrew-yang/",
} as const;

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
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
    },
  };
}
