import { notFound } from "next/navigation";
import { db, now } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { chatHistory } from "@/lib/chat";
import { isFullFeedback, type StoredFeedback } from "@/lib/feedback";
import { quota } from "@/lib/quota-server";
import { inHours } from "@/lib/quota";
import type { Metrics } from "@/lib/metrics";
import type { TaskRow } from "@/lib/tasks";
import { ResultView } from "@/components/result-view";

type Row = {
  id: number;
  user_id: number;
  task_id: number;
  text: string;
  status: string;
  error: string | null;
  is_public: number;
  created_at: number;
  metrics: string;
  feedback: string | null;
  username: string;
  profile_public: number;
};

export default async function SubmissionPage({ params }: PageProps<"/w/[id]">) {
  const { id } = await params;
  const user = await currentUser();
  const row = db
    .prepare(
      `SELECT s.*, u.username, u.profile_public FROM submissions s JOIN users u ON u.id = s.user_id WHERE s.id = ?`,
    )
    .get(Number(id)) as Row | undefined;
  if (!row) notFound();
  const isOwner = user?.id === row.user_id;
  // visitors only see essays explicitly made public on a public profile
  if (!isOwner && !(row.is_public && row.profile_public)) notFound();

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(row.task_id) as TaskRow;
  const stored = row.feedback ? (JSON.parse(row.feedback) as StoredFeedback) : null;
  let fullReviewIn: string | null = null;
  if (isOwner && user) {
    const { full } = quota.status(user);
    fullReviewIn = full.left > 0 ? "now" : full.nextAt ? inHours(full.nextAt, now()) : null;
  }
  return (
    <ResultView
      id={row.id}
      text={row.text}
      status={row.status}
      error={row.error}
      isPublic={Boolean(row.is_public)}
      createdAt={row.created_at}
      metrics={JSON.parse(row.metrics) as Metrics}
      feedback={isFullFeedback(stored) ? stored : null}
      quick={stored && "quick" in stored ? stored.quick : null}
      fullReviewIn={fullReviewIn}
      task={{ title: task.title, prompt: task.prompt, level: task.level, task_type: task.task_type, min_words: task.min_words }}
      isOwner={isOwner}
      author={row.username}
      chat={isOwner ? chatHistory(row.id, row.user_id) : []}
    />
  );
}
