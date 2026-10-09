import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // private, per-learner pages stay out of search results
    rules: { userAgent: "*", allow: "/", disallow: ["/write", "/settings", "/profile"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
