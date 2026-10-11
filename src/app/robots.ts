import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// rendered per request: a build-time render bakes in the fallback URL, the Docker build has no SITE_URL
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    // private, per-learner pages stay out of search results
    rules: { userAgent: "*", allow: "/", disallow: ["/write", "/settings", "/profile"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
