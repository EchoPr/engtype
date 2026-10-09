import "server-only";
import { db } from "./db";
import { isFullFeedback, type StoredFeedback } from "./feedback";

export type SubmissionSummary = {
  id: number;
  title: string;
  task_type: string;
  level: string;
  word_count: number;
  seconds: number;
  band: number | null;
  cefr: string | null;
  error_count: number;
  status: string;
  is_public: number;
  created_at: number;
};

const dayKey = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 10);

export function userStats(userId: number, opts: { publicOnly?: boolean } = {}) {
  const rows = db
    .prepare(
      `SELECT s.id, t.title, t.task_type, t.level, s.word_count, s.seconds, s.band, s.cefr, s.error_count, s.status, s.is_public, s.created_at, s.feedback
       FROM submissions s JOIN tasks t ON t.id = s.task_id WHERE s.user_id = ? ORDER BY s.created_at DESC`,
    )
    .all(userId) as (SubmissionSummary & { feedback: string | null })[];

  // activity: words per UTC day
  const days = new Map<string, { words: number; essays: number }>();
  for (const r of rows) {
    const k = dayKey(r.created_at);
    const d = days.get(k) ?? { words: 0, essays: 0 };
    d.words += r.word_count;
    d.essays += 1;
    days.set(k, d);
  }

  // streaks
  const today = dayKey(Date.now() / 1000);
  const sortedDays = [...days.keys()].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sortedDays) {
    run = prev && (Date.parse(d) - Date.parse(prev)) / 86400000 === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0;
  for (let t = Date.parse(today); ; t -= 86400000) {
    const k = new Date(t).toISOString().slice(0, 10);
    if (days.has(k)) current++;
    else if (k !== today) break;
  }

  const done = rows.filter((r) => r.status === "done" && r.band != null);
  const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);

  const criteria: Record<string, number[]> = {};
  const errorKinds: Record<string, number> = {};
  const meaningKinds: Record<string, number> = {};
  let errorWords = 0;
  for (const r of done) {
    const fb = r.feedback ? (JSON.parse(r.feedback) as StoredFeedback) : null;
    if (!isFullFeedback(fb)) continue; // Quick Checks have no per-criterion detail
    for (const c of fb.review.criteria) (criteria[c.key] ??= []).push(c.score);
    for (const [k, v] of Object.entries(fb.counts)) {
      if (k.startsWith("meaning:")) meaningKinds[k.slice(8)] = (meaningKinds[k.slice(8)] ?? 0) + v;
      else errorKinds[k] = (errorKinds[k] ?? 0) + v;
    }
    errorWords += r.word_count;
  }
  const totalErrors = done.reduce((s, r) => s + r.error_count, 0);

  const levels: Record<string, number> = {};
  for (const r of rows) levels[r.level] = (levels[r.level] ?? 0) + 1;

  const list: SubmissionSummary[] = rows.map((r) => {
    const { feedback, ...rest } = r;
    void feedback;
    return rest;
  });
  return {
    totals: {
      essays: rows.length,
      words: rows.reduce((s, r) => s + r.word_count, 0),
      minutes: Math.round(rows.reduce((s, r) => s + r.seconds, 0) / 60),
      activeDays: days.size,
    },
    streak: { current, longest },
    activity: Object.fromEntries(days),
    band: {
      average: avg(done.map((r) => r.band!)),
      best: done.length ? Math.max(...done.map((r) => r.band!)) : null,
      trend: done.slice(0, 30).reverse().map((r) => ({ id: r.id, band: r.band!, at: r.created_at })),
    },
    criteria: Object.fromEntries(Object.entries(criteria).map(([k, v]) => [k, avg(v)])),
    levels,
    errors: opts.publicOnly
      ? null
      : {
          per100: errorWords ? Math.round((totalErrors / errorWords) * 1000) / 10 : null,
          kinds: errorKinds,
          meaning: meaningKinds,
        },
    submissions: opts.publicOnly ? list.filter((r) => r.is_public) : list,
  };
}

export type UserStats = ReturnType<typeof userStats>;
