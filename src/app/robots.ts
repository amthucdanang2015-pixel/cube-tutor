import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/", "/admin/",
        "/prompts", "/blog", "/patterns", "/teardowns", "/tools",
        "/pro", "/pricing", "/showcase", "/services", "/audit", "/build",
      ],
    },
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
  };
}
