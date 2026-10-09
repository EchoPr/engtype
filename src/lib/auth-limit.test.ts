import { beforeEach, describe, expect, it } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { AUTH_LIMIT_SCHEMA, createAuthLimit } from "./auth-limit";

const limits = { registerPerIp: 2, loginFailuresPerUser: 3, loginFailuresPerIp: 5, loginWindow: 900 };
const HOUR = 3600;

let clock = 1_000_000;
let limit: ReturnType<typeof createAuthLimit>;

beforeEach(() => {
  const db = new DatabaseSync(":memory:");
  db.exec(AUTH_LIMIT_SCHEMA);
  clock = 1_000_000;
  limit = createAuthLimit({ db, limits, now: () => clock });
});

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
  it("locks a username after repeated failures, whatever the IP and letter case", () => {
    limit.recordLoginFailure("ip-1", "Alice");
    limit.recordLoginFailure("ip-2", "alice");
    limit.recordLoginFailure("ip-3", "ALICE");
    expect(limit.loginBlocked("ip-4", "alice")).toEqual({ retryAt: 1_000_000 + 900 });
    expect(limit.loginBlocked("ip-4", "bob")).toBeNull();
  });

  it("locks an IP that guesses across many usernames", () => {
    for (let i = 0; i < 5; i++) limit.recordLoginFailure("ip-1", `user${i}`);
    expect(limit.loginBlocked("ip-1", "fresh")).not.toBeNull();
    expect(limit.loginBlocked("ip-2", "fresh")).toBeNull();
  });

  it("forgets failures once they leave the window", () => {
    for (let i = 0; i < 3; i++) limit.recordLoginFailure("ip-1", "alice");
    clock += 901;
    expect(limit.loginBlocked("ip-1", "alice")).toBeNull();
  });

  it("clears a username's failures after a successful sign-in", () => {
    limit.recordLoginFailure("ip-1", "alice");
    limit.recordLoginFailure("ip-1", "alice");
    limit.loginSucceeded("Alice");
    limit.recordLoginFailure("ip-1", "alice");
    expect(limit.loginBlocked("ip-1", "alice")).toBeNull();
  });
});
