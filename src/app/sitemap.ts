import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const profiles = db.prepare("SELECT username FROM users WHERE profile_public = 1").all() as { username: string }[];
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/register`, changeFrequency: "yearly", priority: 0.5 },
    ...profiles.map((p) => ({ url: `${SITE_URL}/u/${encodeURIComponent(p.username)}`, changeFrequency: "weekly" as const, priority: 0.3 })),
  ];
}
