import type { DatabaseSync } from "node:sqlite";

/**
 * Anti-abuse limits on sign-up and sign-in: accounts created per IP a day (each new account brings a fresh
 * Free Quota), and password guesses within a short window. Guesses are counted per (username, IP) pair so a
 * stranger cannot lock the owner out, per IP against sweeping many usernames, and per username with a higher
 * cap against one account being guessed from many IPs.
 */

export type AuthLimits = {
  registerPerIp: number;
  loginFailuresPerPair: number;
  loginFailuresPerIp: number;
  loginFailuresPerUser: number;
  loginWindow: number;
};
export type Blocked = { retryAt: number } | null;

export const AUTH_LIMIT_SCHEMA = `
  CREATE TABLE IF NOT EXISTS auth_attempts (
    id INTEGER PRIMARY KEY,
    kind TEXT NOT NULL,
    key TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS auth_attempts_key ON auth_attempts(kind, key, created_at);
`;

const DAY = 24 * 3600;
type Kind = "register" | "login_pair" | "login_ip" | "login_user";

export function createAuthLimit(deps: { db: DatabaseSync; limits: AuthLimits; now: () => number }) {
  const { db, limits, now } = deps;
  const userKey = (username: string) => username.trim().toLowerCase();
  const keys = (ip: string, username: string) =>
    [
      ["login_pair", `${userKey(username)}|${ip}`, limits.loginFailuresPerPair],
      ["login_ip", ip, limits.loginFailuresPerIp],
      ["login_user", userKey(username), limits.loginFailuresPerUser],
    ] as const;

  const record = (kind: Kind, key: string) =>
    db.prepare("INSERT INTO auth_attempts (kind, key, created_at) VALUES (?, ?, ?)").run(kind, key, now());

  /** Blocked until the oldest attempt in the window leaves it, once `max` attempts are inside. */
  function check(kind: Kind, key: string, max: number, window: number): Blocked {
    const { n, oldest } = db
      .prepare("SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM auth_attempts WHERE kind = ? AND key = ? AND created_at > ?")
      .get(kind, key, now() - window) as { n: number; oldest: number | null };
    return n >= max && oldest != null ? { retryAt: oldest + window } : null;
  }

  return {
    registerBlocked: (ip: string) => check("register", ip, limits.registerPerIp, DAY),
    recordRegister: (ip: string) => void record("register", ip),

    /**
     * Call before checking the password. Counts the attempt as a failure up front, synchronously with the check,
     * so concurrent requests cannot all pass before the first failure is written; `loginSucceeded` takes it back.
     */
    startLogin(ip: string, username: string): Blocked {
      for (const [kind, key, max] of keys(ip, username)) {
        const blocked = check(kind, key, max, limits.loginWindow);
        if (blocked) return blocked;
      }
      for (const [kind, key] of keys(ip, username)) record(kind, key);
      return null;
    },
    loginSucceeded(ip: string, username: string) {
      const [pair, ipRow, user] = keys(ip, username);
      db.prepare("DELETE FROM auth_attempts WHERE kind = ? AND key = ?").run(pair[0], pair[1]);
      // the attempt this sign-in recorded, not the IP's earlier failures
      for (const [kind, key] of [ipRow, user])
        db.prepare("DELETE FROM auth_attempts WHERE id = (SELECT MAX(id) FROM auth_attempts WHERE kind = ? AND key = ?)").run(kind, key);
    },
    /** Drops rows no window can see any more. */
    prune() {
      db.prepare("DELETE FROM auth_attempts WHERE created_at < ?").run(now() - Math.max(DAY, limits.loginWindow));
    },
  };
}
