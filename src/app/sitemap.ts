import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

// Only the public marketing pages belong here — every /dashboard, /creators,
// /campaigns, /deliverables route is session-gated and per-user, so it has
// nothing to offer a crawler (see robots.ts for the matching Disallow rules).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
