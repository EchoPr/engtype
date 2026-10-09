/** Public base URL for canonical links, sitemap and Open Graph. Set SITE_URL in production. */
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "engtype";
