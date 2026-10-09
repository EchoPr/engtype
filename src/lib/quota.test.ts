import { beforeEach, describe, expect, it } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { createQuota, QUOTA_SCHEMA, type Plans } from "./quota";

const plans: Plans = {
  free: { full: 2, quick: 3, task: 2, chatPerResponse: 2 },
  pro: { full: 5, quick: 10, task: 10, chatPerResponse: 5 },
};
const abuse = { fullPerIp: 4, quickPerIp: 100, globalFull: 100, globalQuick: 1000 };
const HOUR = 3600;

let clock = 1_000_000;
let quota: ReturnType<typeof createQuota>;
const free = (id: number) => ({ id, plan: "free" as const });

beforeEach(() => {
  const db = new DatabaseSync(":memory:");
  db.exec(QUOTA_SCHEMA);
  clock = 1_000_000;
  quota = createQuota({ db, plans, abuse, now: () => clock });
});

describe("reviews", () => {
  it("gives a Free learner their Full Reviews first, then Quick Checks", () => {
    const modes = [1, 2, 3].map(() => quota.consumeReview(free(1), "1.1.1.1"));
    expect(modes).toEqual([{ ok: true, mode: "full" }, { ok: true, mode: "full" }, { ok: true, mode: "quick" }]);
  });

  it("refuses when Quick Checks run out too, saying when the oldest one expires", () => {
    for (let i = 0; i < 5; i++) {
      quota.consumeReview(free(1), "1.1.1.1");
      clock += HOUR;
    }
    // first use was at 1_000_000; it leaves the rolling 24h window at 1_000_000 + 24h
    expect(quota.consumeReview(free(1), "1.1.1.1")).toEqual({ ok: false, reason: "quota", retryAt: 1_000_000 + 24 * HOUR });
  });

  it("restores Full Reviews once they leave the rolling 24 hour window", () => {
    quota.consumeReview(free(1), "ip");
    quota.consumeReview(free(1), "ip");
    clock += 24 * HOUR + 1;
    expect(quota.consumeReview(free(1), "ip")).toEqual({ ok: true, mode: "full" });
  });

  it("gives Pro learners the larger Quota", () => {
    const pro = { id: 7, plan: "pro" as const };
    const modes = Array.from({ length: 6 }, (_, i) => quota.consumeReview(pro, `ip-${i}`));
    expect(modes.filter((m) => m.ok && m.mode === "full")).toHaveLength(5);
  });

  it("caps Full Reviews per IP across accounts, falling back to Quick Checks", () => {
    const modes = [1, 1, 2, 2, 3].map((id) => quota.consumeReview(free(id), "same-ip"));
    expect(modes.map((m) => m.ok && m.mode)).toEqual(["full", "full", "full", "full", "quick"]);
  });

  it("caps Full Reviews for the whole server per day", () => {
    const q = createQuota({ db: (() => { const d = new DatabaseSync(":memory:"); d.exec(QUOTA_SCHEMA); return d; })(), plans, abuse: { ...abuse, globalFull: 1 }, now: () => clock });
    expect(q.consumeReview(free(1), "a")).toEqual({ ok: true, mode: "full" });
    expect(q.consumeReview(free(2), "b")).toEqual({ ok: true, mode: "quick" });
  });
});

describe("tasks and chat", () => {
  it("limits generated Tasks per rolling day", () => {
    expect(quota.consume(free(1), "task").ok).toBe(true);
    expect(quota.consume(free(1), "task").ok).toBe(true);
    expect(quota.consume(free(1), "task")).toMatchObject({ ok: false, reason: "quota" });
  });

  it("limits chat questions per Response, independently for each Response", () => {
    expect(quota.consume(free(1), "chat", { ref: 10 }).ok).toBe(true);
    expect(quota.consume(free(1), "chat", { ref: 10 }).ok).toBe(true);
    expect(quota.consume(free(1), "chat", { ref: 10 })).toMatchObject({ ok: false, reason: "quota" });
    expect(quota.consume(free(1), "chat", { ref: 11 }).ok).toBe(true);
  });
});

describe("status", () => {
  it("reports what is left and when the next use comes back", () => {
    quota.consumeReview(free(1), "ip");
    clock += HOUR;
    quota.consumeReview(free(1), "ip");
    const s = quota.status(free(1));
    expect(s.plan).toBe("free");
    expect(s.full).toEqual({ used: 2, limit: 2, left: 0, nextAt: 1_000_000 + 24 * HOUR });
    expect(s.quick).toEqual({ used: 0, limit: 3, left: 3, nextAt: null });
  });

  it("reports chat questions left for one Response", () => {
    quota.consume(free(1), "chat", { ref: 10 });
    expect(quota.chatLeft(free(1), 10)).toBe(1);
    expect(quota.chatLeft(free(1), 11)).toBe(2);
  });
});
