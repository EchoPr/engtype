import type { DatabaseSync } from "node:sqlite";

/**
 * Anti-abuse limits on sign-up and sign-in: accounts created per IP a day (each new account brings a fresh
 * Free Quota), and failed passwords per username and per IP within a short window (password guessing).
 */

export type AuthLimits = { registerPerIp: number; loginFailuresPerUser: number; loginFailuresPerIp: number; loginWindow: number };
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
type Kind = "register" | "login_fail_user" | "login_fail_ip";

export function createAuthLimit(deps: { db: DatabaseSync; limits: AuthLimits; now: () => number }) {
  const { db, limits, now } = deps;
  const userKey = (username: string) => username.trim().toLowerCase();

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

    loginBlocked(ip: string, username: string): Blocked {
      return (
        check("login_fail_user", userKey(username), limits.loginFailuresPerUser, limits.loginWindow) ??
        check("login_fail_ip", ip, limits.loginFailuresPerIp, limits.loginWindow)
      );
    },
    recordLoginFailure(ip: string, username: string) {
      record("login_fail_user", userKey(username));
      record("login_fail_ip", ip);
    },
    loginSucceeded(username: string) {
      db.prepare("DELETE FROM auth_attempts WHERE kind = 'login_fail_user' AND key = ?").run(userKey(username));
    },
    /** Drops rows no window can see any more. */
    prune() {
      db.prepare("DELETE FROM auth_attempts WHERE created_at < ?").run(now() - Math.max(DAY, limits.loginWindow));
    },
  };
}
