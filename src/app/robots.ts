import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup"],
      // Everything past auth is a per-user CRM view — nothing here is
      // meant to be publicly discoverable or indexed.
      disallow: ["/dashboard", "/creators", "/campaigns", "/deliverables", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
