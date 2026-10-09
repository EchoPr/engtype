import "server-only";
import { db, now } from "./db";
import { createQuota, type Plans } from "./quota";

const int = (name: string, fallback: number) => Number(process.env[name]) || fallback;

/** Plan limits per rolling 24 hours (chat: per Response). Pro is set by hand: UPDATE users SET plan = 'pro'. */
export const PLANS: Plans = {
  free: { full: 2, quick: 10, task: 20, chatPerResponse: 10 },
  pro: { full: 30, quick: 100, task: 100, chatPerResponse: 50 },
};

export const quota = createQuota({
  db,
  plans: PLANS,
  abuse: {
    fullPerIp: int("QUOTA_FULL_PER_IP", 6),
    quickPerIp: int("QUOTA_QUICK_PER_IP", 40),
    globalFull: int("QUOTA_GLOBAL_FULL", 2000),
    globalQuick: int("QUOTA_GLOBAL_QUICK", 10000),
  },
  now,
});
