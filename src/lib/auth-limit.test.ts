import { beforeEach, describe, expect, it } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { AUTH_LIMIT_SCHEMA, createAuthLimit } from "./auth-limit";

const limits = { registerPerIp: 2, loginFailuresPerPair: 3, loginFailuresPerIp: 5, loginFailuresPerUser: 8, loginWindow: 900 };
const HOUR = 3600;

let clock = 1_000_000;
let limit: ReturnType<typeof createAuthLimit>;

beforeEach(() => {
  const db = new DatabaseSync(":memory:");
  db.exec(AUTH_LIMIT_SCHEMA);
  clock = 1_000_000;
  limit = createAuthLimit({ db, limits, now: () => clock });
});

/** A sign-in attempt whose password turns out wrong. */
const fail = (ip: string, username: string) => limit.startLogin(ip, username);

describe("registration", () => {
  it("allows a few accounts per IP a day, then refuses until the oldest leaves the window", () => {
    limit.recordRegister("1.1.1.1");
    clock += HOUR;
    limit.recordRegister("1.1.1.1");
    expect(limit.registerBlocked("1.1.1.1")).toEqual({ retryAt: 1_000_000 + 24 * HOUR });
    expect(limit.registerBlocked("2.2.2.2")).toBeNull();
    clock = 1_000_000 + 24 * HOUR + 1;
    expect(limit.registerBlocked("1.1.1.1")).toBeNull();
  });
});

describe("login", () => {
  it("counts an attempt before the password is checked, so a burst cannot all slip through", () => {
    const results = Array.from({ length: 10 }, () => limit.startLogin("ip-1", "alice"));
    expect(results.filter((r) => r === null)).toHaveLength(3);
  });

  it("locks a username for the guessing IP, whatever the letter case", () => {
    fail("ip-1", "Alice");
    fail("ip-1", "alice");
    fail("ip-1", "ALICE");
    expect(limit.startLogin("ip-1", "alice")).toEqual({ retryAt: 1_000_000 + 900 });
  });

  it("does not lock the owner out when someone else guesses their password", () => {
    for (let i = 0; i < 3; i++) fail("attacker", "alice");
    expect(limit.startLogin("owner", "alice")).toBeNull();
  });

  it("still caps guesses on one username spread across many IPs", () => {
    for (let i = 0; i < 8; i++) fail(`ip-${i}`, "alice");
    expect(limit.startLogin("fresh-ip", "alice")).not.toBeNull();
  });

  it("locks an IP that guesses across many usernames", () => {
    for (let i = 0; i < 5; i++) fail("ip-1", `user${i}`);
    expect(limit.startLogin("ip-1", "fresh")).not.toBeNull();
    expect(limit.startLogin("ip-2", "fresh")).toBeNull();
  });

  it("forgets failures once they leave the window", () => {
    for (let i = 0; i < 3; i++) fail("ip-1", "alice");
    clock += 901;
    expect(limit.startLogin("ip-1", "alice")).toBeNull();
  });

  it("a successful sign-in clears the pair and does not count against the IP", () => {
    fail("ip-1", "alice");
    fail("ip-1", "alice");
    limit.startLogin("ip-1", "alice");
    limit.loginSucceeded("ip-1", "Alice");
    fail("ip-1", "alice");
    expect(limit.startLogin("ip-1", "alice")).toBeNull();
    // IP rows: 2 failures + 1 failure + 1 attempt = 4, the success is not counted; the cap is 5
    expect(limit.startLogin("ip-1", "bob")).toBeNull();
    expect(limit.startLogin("ip-1", "carol")).not.toBeNull();
  });
});
