import type { DatabaseSync } from "node:sqlite";

/**
 * Quota: how much of each costly action a Plan allows within a rolling 24 hours (chat: per Response).
 * See CONTEXT.md (Plan, Full Review, Quick Check, Quota) and docs/adr/0004-server-paid-model.md.
 */

export type PlanName = "free" | "pro";
export type PlanLimits = { full: number; quick: number; task: number; chatPerResponse: number };
export type Plans = Record<PlanName, PlanLimits>;
/** Anti-abuse caps that apply across accounts. */
export type AbuseCaps = { fullPerIp: number; quickPerIp: number; globalFull: number; globalQuick: number };

type Action = "full" | "quick" | "task" | "chat";
type Learner = { id: number; plan: PlanName };

export type Decision = { ok: true } | { ok: false; reason: "quota" | "ip" | "global"; retryAt: number | null };
export type ReviewDecision = { ok: true; mode: "full" | "quick" } | { ok: false; reason: "quota" | "ip" | "global"; retryAt: number | null };

export const QUOTA_SCHEMA = `
  CREATE TABLE IF NOT EXISTS usage (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    ref INTEGER,
    ip TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS usage_user ON usage(user_id, action, created_at);
  CREATE INDEX IF NOT EXISTS usage_ip ON usage(ip, action, created_at);
  CREATE INDEX IF NOT EXISTS usage_action ON usage(action, created_at);
`;

const DAY = 24 * 3600;

export function createQuota(deps: { db: DatabaseSync; plans: Plans; abuse: AbuseCaps; now: () => number }) {
  const { db, plans, abuse, now } = deps;
  const since = () => now() - DAY;

  const countUser = (userId: number, action: Action) =>
    (db.prepare("SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM usage WHERE user_id = ? AND action = ? AND created_at > ?").get(
      userId,
      action,
      since(),
    ) as { n: number; oldest: number | null });
  const countIp = (ip: string, action: Action) =>
    (db.prepare("SELECT COUNT(*) AS n FROM usage WHERE ip = ? AND action = ? AND created_at > ?").get(ip, action, since()) as { n: number }).n;
  const countGlobal = (action: Action) =>
    (db.prepare("SELECT COUNT(*) AS n FROM usage WHERE action = ? AND created_at > ?").get(action, since()) as { n: number }).n;
  const countChat = (userId: number, ref: number) =>
    (db.prepare("SELECT COUNT(*) AS n FROM usage WHERE user_id = ? AND action = 'chat' AND ref = ?").get(userId, ref) as { n: number }).n;

  const record = (userId: number, action: Action, ip?: string, ref?: number) =>
    db.prepare("INSERT INTO usage (user_id, action, ref, ip, created_at) VALUES (?, ?, ?, ?, ?)").run(userId, action, ref ?? null, ip ?? null, now());

  const nextAt = (oldest: number | null) => (oldest == null ? null : oldest + DAY);

  /** Why a review action is unavailable, or null if it can be used. */
  function blocker(learner: Learner, action: "full" | "quick", ip: string) {
    const used = countUser(learner.id, action);
    if (used.n >= plans[learner.plan][action]) return { reason: "quota" as const, retryAt: nextAt(used.oldest) };
    if (countIp(ip, action) >= (action === "full" ? abuse.fullPerIp : abuse.quickPerIp)) return { reason: "ip" as const, retryAt: null };
    if (countGlobal(action) >= (action === "full" ? abuse.globalFull : abuse.globalQuick)) return { reason: "global" as const, retryAt: null };
    return null;
  }

  return {
    /** Spends a Full Review if one is available, otherwise a Quick Check. */
    consumeReview(learner: Learner, ip: string): ReviewDecision {
      const fullBlocked = blocker(learner, "full", ip);
      if (!fullBlocked) {
        record(learner.id, "full", ip);
        return { ok: true, mode: "full" };
      }
      const quickBlocked = blocker(learner, "quick", ip);
      if (!quickBlocked) {
        record(learner.id, "quick", ip);
        return { ok: true, mode: "quick" };
      }
      const times = [fullBlocked.retryAt, quickBlocked.retryAt].filter((t): t is number => t != null);
      return { ok: false, reason: quickBlocked.reason, retryAt: times.length ? Math.min(...times) : null };
    },

    /** Spends one generated Task or one chat question (chat needs the Response id as `ref`). */
    consume(learner: Learner, action: "task" | "chat", ctx: { ref?: number; ip?: string } = {}): Decision {
      const limits = plans[learner.plan];
      if (action === "chat") {
        if (ctx.ref == null) throw new Error("chat quota needs the Response id");
        if (countChat(learner.id, ctx.ref) >= limits.chatPerResponse) return { ok: false, reason: "quota", retryAt: null };
      } else {
        const used = countUser(learner.id, "task");
        if (used.n >= limits.task) return { ok: false, reason: "quota", retryAt: nextAt(used.oldest) };
      }
      record(learner.id, action, ctx.ip, ctx.ref);
      return { ok: true };
    },

    status(learner: Learner) {
      const one = (action: "full" | "quick" | "task") => {
        const used = countUser(learner.id, action);
        const limit = plans[learner.plan][action];
        return { used: used.n, limit, left: Math.max(0, limit - used.n), nextAt: used.n >= limit ? nextAt(used.oldest) : null };
      };
      return { plan: learner.plan, full: one("full"), quick: one("quick"), task: one("task") };
    },

    chatLeft(learner: Learner, ref: number) {
      return Math.max(0, plans[learner.plan].chatPerResponse - countChat(learner.id, ref));
    },
  };
}

export type Quota = ReturnType<typeof createQuota>;
export type QuotaStatus = ReturnType<Quota["status"]>;

/** "3h 20m" until a timestamp (seconds). */
export function inHours(at: number, now: number) {
  const mins = Math.max(1, Math.ceil((at - now) / 60));
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}
