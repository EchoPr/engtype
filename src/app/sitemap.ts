import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const profiles = db.prepare("SELECT username FROM users WHERE profile_public = 1").all() as { username: string }[];
  const essays = db
    .prepare(
      `SELECT s.id, s.created_at FROM submissions s JOIN users u ON u.id = s.user_id
       WHERE s.is_public = 1 AND u.profile_public = 1 AND s.status = 'done'`,
    )
    .all() as { id: number; created_at: number }[];
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/register`, changeFrequency: "yearly", priority: 0.5 },
    ...profiles.map((p) => ({ url: `${SITE_URL}/u/${encodeURIComponent(p.username)}`, changeFrequency: "weekly" as const, priority: 0.3 })),
    ...essays.map((e) => ({ url: `${SITE_URL}/w/${e.id}`, lastModified: new Date(e.created_at * 1000), priority: 0.4 })),
  ];
}
