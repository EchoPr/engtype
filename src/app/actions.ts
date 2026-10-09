"use server";

import { redirect } from "next/navigation";
import { refresh, revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { db, now } from "@/lib/db";
import { authLimit, createSession, destroySession, requireUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/secrets";
import { aiErrorMessage } from "@/lib/ai";
import { quota } from "@/lib/quota-server";
import { clientIp } from "@/lib/request";
import { inHours } from "@/lib/quota";
import { generateTask, getTask } from "@/lib/tasks";
import { analyzeSubmission } from "@/lib/analyze";
import { ask } from "@/lib/chat";
import { computeMetrics } from "@/lib/metrics";
import { isLevel, isTaskType, LEVELS, TASK_TYPES } from "@/lib/levels";

export type FormState = { error?: string; ok?: string } | undefined;

// ---------- auth ----------

const Credentials = z.object({
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]{3,24}$/, "Username: 3-24 letters, digits, _ or -"),
  password: z.string().min(8, "Password: at least 8 characters").max(200),
});

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const parsed = Credentials.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { username, password } = parsed.data;
  const ip = await clientIp();
  const blocked = authLimit.registerBlocked(ip);
  if (blocked) return { error: `Too many new accounts from your network. Try again in ${inHours(blocked.retryAt, now())}.` };
  if (db.prepare("SELECT 1 FROM users WHERE username = ?").get(username)) return { error: "Username is taken" };
  const { id } = db
    .prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?) RETURNING id")
    .get(username, await hashPassword(password), now()) as { id: number };
  db.prepare("INSERT INTO user_settings (user_id) VALUES (?)").run(id);
  authLimit.recordRegister(ip);
  await createSession(id);
  redirect("/write");
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const username = String(form.get("username") ?? "").trim().slice(0, 64);
  const password = String(form.get("password") ?? "");
  const ip = await clientIp();
  const blocked = authLimit.startLogin(ip, username);
  if (blocked) return { error: `Too many failed attempts. Try again in ${inHours(blocked.retryAt, now())}.` };
  const row = db.prepare("SELECT id, password_hash FROM users WHERE username = ?").get(username) as
    | { id: number; password_hash: string }
    | undefined;
  if (!row || !(await verifyPassword(password, row.password_hash))) return { error: "Wrong username or password" };
  authLimit.loginSucceeded(ip, username);
  authLimit.prune();
  await createSession(row.id);
  redirect("/write");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

// ---------- writing ----------

function quotaMessage(what: string, d: { reason: "quota" | "ip" | "global"; retryAt: number | null }) {
  if (d.reason === "quota") return `You have used all your ${what} for now.${d.retryAt ? ` More in ${inHours(d.retryAt, now())}.` : ""}`;
  return "The service is busy right now. Please try again later.";
}

export async function newTask(input: { taskType: string; level: string; topic?: string; source: "ai" | "bank" }) {
  const user = await requireUser();
  if (!isLevel(input.level) || !isTaskType(input.taskType) || "retired" in TASK_TYPES[input.taskType])
    return { error: "Invalid level or task type" };
  // action arguments come straight from the client: anything but "bank" would generate with the model
  if (input.source !== "ai" && input.source !== "bank") return { error: "Invalid task source" };
  if (input.source === "ai") {
    const d = quota.consume(user, "task", { ip: await clientIp() });
    if (!d.ok) return { error: `${quotaMessage("AI tasks", d)} Exam bank tasks are always available.` };
  }
  try {
    const id = await generateTask({ userId: user.id, taskType: input.taskType, level: input.level, topic: input.topic, source: input.source });
    refresh();
    return { id };
  } catch (e) {
    return { error: aiErrorMessage(e) };
  }
}

export async function saveDraft(taskId: number, text: string, seconds: number) {
  const user = await requireUser();
  db.prepare("UPDATE tasks SET draft = ?, draft_seconds = ? WHERE id = ? AND user_id = ?").run(
    text.slice(0, 20_000),
    Math.max(0, Math.round(seconds)),
    taskId,
    user.id,
  );
}

export async function submitEssay(taskId: number, text: string, seconds: number) {
  const user = await requireUser();
  const task = getTask(taskId, user.id);
  if (!task) return { error: "Task not found" };
  const clean = text.replace(/\r\n/g, "\n").trim().slice(0, 20_000);
  const metrics = computeMetrics(clean, seconds);
  if (metrics.words < 10) return { error: "Write at least 10 words first." };

  const decision = quota.consumeReview(user, await clientIp());
  if (!decision.ok) return { error: quotaMessage("reviews", decision) };

  const { id } = db
    .prepare(
      `INSERT INTO submissions (user_id, task_id, text, seconds, word_count, metrics, status, mode, is_public, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?) RETURNING id`,
    )
    .get(user.id, taskId, clean, Math.round(seconds), metrics.words, JSON.stringify(metrics), decision.mode, user.public_essays, now()) as { id: number };
  db.prepare("UPDATE tasks SET draft = '' WHERE id = ?").run(taskId);
  after(() => analyzeSubmission(id));
  return { id };
}

/**
 * Retrying a failed analysis is free a couple of times (the failure was probably ours); after that, and for
 * re-analysing a finished one, it spends a review, otherwise a Response built to fail would loop for free.
 * That review may come back as a Quick Check.
 */
export async function reanalyze(submissionId: number) {
  const user = await requireUser();
  const sub = db.prepare("SELECT status FROM submissions WHERE id = ? AND user_id = ?").get(submissionId, user.id) as
    | { status: string }
    | undefined;
  if (!sub || sub.status === "pending") return {};
  if (!(sub.status === "error" && quota.freeRetry(user, submissionId))) {
    const d = quota.consumeReview(user, await clientIp());
    if (!d.ok) return { error: quotaMessage("reviews", d) };
    db.prepare("UPDATE submissions SET mode = ? WHERE id = ?").run(d.mode, submissionId);
  }
  db.prepare("UPDATE submissions SET status = 'pending', error = NULL WHERE id = ?").run(submissionId);
  after(() => analyzeSubmission(submissionId));
  refresh();
  return {};
}

export async function submissionStatus(submissionId: number) {
  const user = await requireUser();
  const row = db.prepare("SELECT status, error FROM submissions WHERE id = ? AND user_id = ?").get(submissionId, user.id) as
    | { status: string; error: string | null }
    | undefined;
  // once the background analysis finishes, re-render the page with the feedback
  if (row && row.status !== "pending") refresh();
  return row ?? { status: "missing", error: null };
}

export async function setSubmissionPublic(submissionId: number, isPublic: boolean) {
  const user = await requireUser();
  db.prepare("UPDATE submissions SET is_public = ? WHERE id = ? AND user_id = ?").run(isPublic ? 1 : 0, submissionId, user.id);
  revalidatePath(`/w/${submissionId}`);
}

export async function deleteSubmission(submissionId: number) {
  const user = await requireUser();
  db.prepare("DELETE FROM submissions WHERE id = ? AND user_id = ?").run(submissionId, user.id);
  redirect("/profile");
}

// ---------- chat ----------

export async function askQuestion(submissionId: number, question: string) {
  const user = await requireUser();
  const sub = db.prepare("SELECT mode FROM submissions WHERE id = ? AND user_id = ?").get(submissionId, user.id) as
    | { mode: string }
    | undefined;
  if (!sub) return { error: "Not found" };
  if (sub.mode !== "full") return { error: "Chat is available for Full Reviews only." };
  if (!quota.consume(user, "chat", { ref: submissionId, ip: await clientIp() }).ok)
    return { error: "You have used all questions for this essay." };
  try {
    return { messages: await ask(submissionId, user.id, question) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong" };
  }
}

// ---------- settings ----------

export async function saveSettings(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const level = String(form.get("target_level") ?? "B2");

  const flag = (name: string) => (form.get(name) === "on" ? 1 : 0);
  db.prepare(
    "UPDATE users SET bio = ?, target_level = ?, profile_public = ?, public_heatmap = ?, public_scores = ?, public_essays = ? WHERE id = ?",
  ).run(
    String(form.get("bio") ?? "").slice(0, 200),
    (LEVELS as readonly string[]).includes(level) ? level : "B2",
    flag("profile_public"),
    flag("public_heatmap"),
    flag("public_scores"),
    flag("public_essays"),
    user.id,
  );
  return { ok: "Saved" };
}
