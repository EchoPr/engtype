import "server-only";
import { headers } from "next/headers";
import { clientIpFrom, ipKey } from "./ip";

/** How many proxies in front of the app append to X-Forwarded-For (1 for a single nginx, Caddy or Fly.io edge). */
const TRUSTED_PROXY_HOPS = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1);

/** Client address bucket for anti-abuse limits (Quota, sign-up, sign-in). Needs a proxy that sets X-Forwarded-For. */
export async function clientIp() {
  const h = await headers();
  return ipKey(clientIpFrom({ forwardedFor: h.get("x-forwarded-for"), realIp: h.get("x-real-ip") }, TRUSTED_PROXY_HOPS));
}
