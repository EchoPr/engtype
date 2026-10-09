import "server-only";
import { headers } from "next/headers";

/** Client IP for anti-abuse Quota. Trusts the first X-Forwarded-For hop, so run behind a proxy that sets it. */
export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}
