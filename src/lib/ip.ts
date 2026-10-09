/**
 * Client address for anti-abuse limits. Proxies append the address they saw to X-Forwarded-For, so only the
 * rightmost `trustedHops` entries were written by our own infrastructure; everything left of them is client input.
 */
export function clientIpFrom(h: { forwardedFor: string | null; realIp: string | null }, trustedHops: number): string {
  const chain = (h.forwardedFor ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (chain.length) return chain[Math.max(0, chain.length - trustedHops)];
  return h.realIp?.trim() || "unknown";
}

/** The bucket an address is counted in: IPv4 as is, IPv6 by its /64 (one subscriber usually holds a whole /64). */
export function ipKey(ip: string): string {
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return mapped[1];
  if (!ip.includes(":")) return ip;
  const [head, tail] = ip.toLowerCase().split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const groups = tail === undefined ? left : [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
  return `${groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, "")).join(":")}::/64`;
}
