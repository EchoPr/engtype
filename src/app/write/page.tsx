import { requireUser } from "@/lib/auth";
import { openTask } from "@/lib/tasks";
import { aiReady } from "@/lib/ai";
import { now } from "@/lib/db";
import { quota } from "@/lib/quota-server";
import { isLevel } from "@/lib/levels";
import { Writer, type WriterTask } from "@/components/writer";

export const metadata = { title: "Write", robots: { index: false } };

export default async function WritePage() {
  const user = await requireUser();
  const t = openTask(user.id);
  const task: WriterTask | null = t
    ? {
        id: t.id,
        task_type: t.task_type,
        level: t.level,
        title: t.title,
        prompt: t.prompt,
        tips: JSON.parse(t.tips) as string[],
        min_words: t.min_words,
        minutes: t.minutes,
        draft: t.draft,
        draft_seconds: t.draft_seconds,
      }
    : null;
  return <Writer initialTask={task} defaultLevel={isLevel(user.target_level) ? user.target_level : "B2"} aiReady={aiReady()} quota={{ ...quota.status(user), now: now() }} />;
}
