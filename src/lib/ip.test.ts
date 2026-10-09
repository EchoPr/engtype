import { describe, expect, it } from "vitest";
import { clientIpFrom, ipKey } from "./ip";

describe("clientIpFrom", () => {
  it("takes the address the trusted proxy appended, not the one the client wrote", () => {
    expect(clientIpFrom({ forwardedFor: "6.6.6.6, 1.2.3.4", realIp: null }, 1)).toBe("1.2.3.4");
    expect(clientIpFrom({ forwardedFor: "6.6.6.6, 1.2.3.4, 10.0.0.2", realIp: null }, 2)).toBe("1.2.3.4");
  });

  it("falls back to X-Real-IP, then to a shared bucket", () => {
    expect(clientIpFrom({ forwardedFor: null, realIp: "5.5.5.5" }, 1)).toBe("5.5.5.5");
    expect(clientIpFrom({ forwardedFor: null, realIp: null }, 1)).toBe("unknown");
  });

  it("uses the leftmost address when the chain is shorter than the trusted hops", () => {
    expect(clientIpFrom({ forwardedFor: "1.2.3.4", realIp: null }, 2)).toBe("1.2.3.4");
  });
});

describe("ipKey", () => {
  it("keeps IPv4 as is and unwraps IPv4-mapped IPv6", () => {
    expect(ipKey("1.2.3.4")).toBe("1.2.3.4");
    expect(ipKey("::ffff:1.2.3.4")).toBe("1.2.3.4");
  });

  it("groups IPv6 by its /64, so rotating addresses inside one subnet does not help", () => {
    expect(ipKey("2001:db8:1:2::1")).toBe("2001:db8:1:2::/64");
    expect(ipKey("2001:DB8:1:2:aaaa:bbbb:cccc:dddd")).toBe("2001:db8:1:2::/64");
    expect(ipKey("2001:db8::1")).toBe("2001:db8:0:0::/64");
  });
});
