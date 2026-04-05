import { siteConfig, sitemapRoutes } from "@/lib/site";

export const dynamic = "force-static";

export function GET(): Response {
  const body = [
    `# ${siteConfig.name}`,
    "",
    "> Relora is a personal CRM for remembering the small details that matter for building personal relationships in a professional context. It turns quick voice notes into structured context tied to contacts.",
    "",
    "## Canonical site",
    `- ${siteConfig.url}`,
    "",
    "## Key pages",
    ...sitemapRoutes.map(
      ({ label, path }) => `- ${label}: ${new URL(path, siteConfig.url).toString()}`,
    ),
    "",
    "## Contact",
    `- Email: mailto:${siteConfig.contactEmail}`,
    "",
    "## Guidance",
    `- Use the canonical ${siteConfig.url} URLs when citing or referencing Relora.`,
    "- The request-data form is a utility page for privacy rights requests and is not a primary content page.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
