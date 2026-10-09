import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, now } from "./db";
import { randomToken, sha256 } from "./secrets";
import type { PlanName } from "./quota";
import { createAuthLimit } from "./auth-limit";

const COOKIE = "eng_session";
const TTL = 60 * 60 * 24 * 30;

export const authLimit = createAuthLimit({
  db,
  limits: { registerPerIp: 5, loginFailuresPerPair: 10, loginFailuresPerIp: 30, loginFailuresPerUser: 100, loginWindow: 15 * 60 },
  now,
});

export type User = {
  id: number;
  username: string;
  bio: string;
  target_level: string;
  profile_public: number;
  public_heatmap: number;
  public_scores: number;
  public_essays: number;
  plan: PlanName;
  created_at: number;
};

const USER_COLUMNS = "u.id, u.username, u.bio, u.target_level, u.profile_public, u.public_heatmap, u.public_scores, u.public_essays, u.plan, u.created_at";

export async function createSession(userId: number) {
  const token = randomToken();
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(sha256(token), userId, now() + TTL);
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(now());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
  jar.delete(COOKIE);
}

export const currentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = db
    .prepare(`SELECT ${USER_COLUMNS} FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?`)
    .get(sha256(token), now());
  return (row as User | undefined) ?? null;
});

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export function userByName(username: string): User | null {
  return (db.prepare(`SELECT ${USER_COLUMNS} FROM users u WHERE u.username = ?`).get(username) as User | undefined) ?? null;
}
