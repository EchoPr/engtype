"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { GlobeIcon, LockIcon, Loader2Icon, RotateCwIcon, Trash2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Feedback, LocatedIssue, QuickResultT } from "@/lib/feedback";
import { toast } from "sonner";
import type { Metrics } from "@/lib/metrics";
import type { ChatMessage } from "@/lib/chat";
import { TASK_TYPES, type TaskType } from "@/lib/levels";
import { deleteSubmission, reanalyze, setSubmissionPublic, submissionStatus } from "@/app/actions";
import { AnnotatedEssay, KIND_LABEL } from "./annotated-essay";
import { MeaningPanel, RecommendationsPanel, ReviewPanel, StatsPanel } from "./review-panel";
import { ChatPanel } from "./chat-panel";
import { CountUp } from "./count-up";

export type ResultProps = {
  id: number;
  text: string;
  status: string;
  error: string | null;
  isPublic: boolean;
  createdAt: number;
  metrics: Metrics;
  feedback: Feedback | null;
  /** set instead of feedback for a Quick Check */
  quick: QuickResultT | null;
  /** owner only: when the next Full Review becomes available, e.g. "now" or "in 3h 20m" */
  fullReviewIn: string | null;
  task: { title: string; prompt: string; level: string; task_type: TaskType; min_words: number };
  isOwner: boolean;
  author: string;
  chat: ChatMessage[];
};

function Big({ label, value, accent, i = 0 }: { label: string; value: React.ReactNode; accent?: boolean; i?: number }) {
  return (
    <div className="animate-rise" style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
      <div className="font-mono text-xs text-sub">{label}</div>
      <div className={cn("font-display leading-none tabular-nums text-main", accent ? "text-8xl" : "text-5xl")}>{value}</div>
    </div>
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function ResultView(p: ResultProps) {
  const [focus, setFocus] = useState<{ start: number; end: number } | null>(null);
  const [showImprove, setShowImprove] = useState(true);
  const [hiddenKinds, setHiddenKinds] = useState<Set<string>>(new Set());
  const [isPublic, setIsPublic] = useState(p.isPublic);
  const [busy, start] = useTransition();

  // poll while the analysis runs in the background
  useEffect(() => {
    if (p.status !== "pending") return;
    const id = setInterval(() => submissionStatus(p.id), 2000);
    return () => clearInterval(id);
  }, [p.status, p.id]);

  const issues = useMemo(() => p.feedback?.issues ?? [], [p.feedback]);
  const kinds = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of issues) m.set(i.kind, (m.get(i.kind) ?? 0) + 1);
    return [...m.entries()];
  }, [issues]);

  const visible = useCallback(
    (i: LocatedIssue) => (showImprove || i.severity === "error") && !hiddenKinds.has(i.kind),
    [showImprove, hiddenKinds],
  );

  function focusQuote(quote: string) {
    const q = quote.trim().replace(/[.…]+$/, "");
    let start = p.text.indexOf(q);
    if (start < 0) start = p.text.toLowerCase().indexOf(q.toLowerCase());
    if (start < 0) return;
    setFocus({ start, end: start + q.length });
    requestAnimationFrame(() => document.querySelector("[data-focus]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  const errors = issues.filter((i) => i.severity === "error").length;
  const r = p.feedback?.review;
  const rerun = () =>
    start(async () => {
      const res = await reanalyze(p.id);
      if (res?.error) toast.error(res.error);
    });

  return (
    <div className="flex flex-col gap-10">
      {/* headline numbers */}
      <section className="flex flex-wrap items-end gap-x-12 gap-y-6">
        {r ? (
          <>
            <Big label={p.feedback?.assessment ? "band · estimate" : "band"} value={<CountUp value={r.band} decimals={1} duration={1200} />} accent />
            <Big label="cefr" value={<span className="italic">{r.cefr}</span>} accent i={1} />
          </>
        ) : p.quick ? (
          <>
            <Big label="band · quick estimate" value={<CountUp value={p.quick.band} decimals={1} duration={1200} />} accent />
            <Big label="cefr" value={<span className="italic">{p.quick.cefr}</span>} accent i={1} />
          </>
        ) : (
          <div className="flex gap-12">
            <Skeleton className="h-24 w-28 bg-sub-alt" />
            <Skeleton className="h-24 w-28 bg-sub-alt" />
          </div>
        )}
        <Big label="words" value={<CountUp value={p.metrics.words} />} i={2} />
        <Big label="time" value={fmt(p.metrics.seconds)} i={3} />
        <Big label="wpm" value={p.metrics.wpm ? <CountUp value={Math.round(p.metrics.wpm)} /> : "–"} i={4} />
        {p.feedback && <Big label="mistakes" value={<CountUp value={errors} delay={300} />} i={5} />}
        {r && (
          <div className="animate-rise pb-1 font-mono text-xs text-sub [--d:450ms]">
            target <span className="text-text">{p.task.level}</span> ·{" "}
            <span className={r.level_fit === "below" ? "text-error" : r.level_fit === "above" ? "text-ok" : "text-text"}>
              {r.level_fit === "at" ? "on level" : `${r.level_fit} target`}
            </span>
          </div>
        )}
      </section>

      <div className="animate-rise font-mono text-xs text-sub [--d:200ms]">
        <span className="text-main">{p.task.level}</span> · {TASK_TYPES[p.task.task_type]?.label} · {p.task.title}
        {!p.isOwner && <> · by <Link href={`/u/${p.author}`} className="text-text hover:text-main">{p.author}</Link></>}
        <details className="mt-2">
          <summary className="cursor-pointer hover:text-text">task</summary>
          <p className="mt-2 max-w-3xl animate-rise whitespace-pre-wrap font-serif text-base leading-relaxed text-text/70">{p.task.prompt}</p>
        </details>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* level 1: inline */}
        <section className="lg:col-span-3">
          {p.feedback && (
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
              <span className="flex items-center gap-1.5">
                <span className="mark-error text-text">mistake</span>
              </span>
              <button onClick={() => setShowImprove((s) => !s)} className={cn("flex items-center gap-1.5", !showImprove && "opacity-40")}>
                <span className="mark-improve text-text">could be better</span>
              </button>
              <span className="text-sub">|</span>
              {kinds.map(([k, n]) => (
                <button
                  key={k}
                  onClick={() =>
                    setHiddenKinds((s) => {
                      const next = new Set(s);
                      if (next.has(k)) next.delete(k);
                      else next.add(k);
                      return next;
                    })
                  }
                  className={cn("text-sub hover:text-text", hiddenKinds.has(k) && "line-through opacity-50")}
                >
                  {KIND_LABEL[k] ?? k} <span className="text-main">{n}</span>
                </button>
              ))}
            </div>
          )}
          <div onClick={() => setFocus(null)}>
            <AnnotatedEssay text={p.text} issues={issues} visible={visible} focus={focus} />
          </div>
        </section>

        {/* level 2: side panel */}
        <aside className="lg:col-span-2">
          <div className="animate-rise rounded-2xl bg-sub-alt p-5 [--d:250ms] lg:sticky lg:top-6">
            {p.status === "pending" && (
              <div className="flex items-center gap-3 py-6 font-display text-2xl italic">
                <Loader2Icon className="size-4 animate-spin text-sub" /> <span className="text-shimmer">reading your writing…</span>
              </div>
            )}
            {(p.status === "error" || p.status === "blocked") && (
              <div className="space-y-3 text-sm">
                <p className="text-error">{p.error}</p>
                {p.isOwner && p.status === "error" && (
                  <button
                    onClick={rerun}
                    className="flex items-center gap-2 text-sub hover:text-text"
                  >
                    <RotateCwIcon className={cn("size-3", busy && "animate-spin")} /> retry analysis
                  </button>
                )}
              </div>
            )}
            {p.status === "done" && p.quick && (
              <div className="space-y-6">
                <p className="font-display text-2xl leading-snug text-text">{p.quick.summary}</p>
                <div className="rounded-xl border border-dashed border-sub/40 p-4 text-sm">
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-sub">quick check</p>
                  <p className="leading-relaxed text-text/80">
                    A Full Review adds highlighted mistakes, a band for every criterion with quotes from your text, meaning and structure
                    issues, recommendations and the chat.
                  </p>
                  {p.isOwner && p.fullReviewIn && (
                    <p className="mt-2 font-mono text-xs text-text">
                      {p.fullReviewIn === "now" ? (
                        <button onClick={rerun} className="underline-offset-4 hover:underline">
                          get a full review of this essay →
                        </button>
                      ) : (
                        <>next full review in {p.fullReviewIn}</>
                      )}
                    </p>
                  )}
                </div>
                <StatsPanel metrics={p.metrics} feedback={null} />
              </div>
            )}
            {p.status === "done" && p.feedback && (
              <Tabs defaultValue="review">
                <TabsList variant="line" className="mb-4 font-mono">
                  <TabsTrigger value="review">review</TabsTrigger>
                  <TabsTrigger value="stats">stats</TabsTrigger>
                  {p.isOwner && <TabsTrigger value="chat">ask</TabsTrigger>}
                </TabsList>
                <TabsContent value="review">
                  <ReviewPanel feedback={p.feedback} onFocus={focusQuote} />
                </TabsContent>
                <TabsContent value="stats">
                  <StatsPanel metrics={p.metrics} feedback={p.feedback} />
                </TabsContent>
                {p.isOwner && (
                  <TabsContent value="chat">
                    <ChatPanel submissionId={p.id} initial={p.chat} />
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
        </aside>
      </div>

      {/* level 2b: meaning & structure, full width under the essay */}
      {p.status === "done" && p.feedback && <MeaningPanel feedback={p.feedback} onFocus={focusQuote} />}
      {p.status === "done" && p.feedback && <RecommendationsPanel feedback={p.feedback} />}

      {p.isOwner && (
        <footer className="animate-rise flex flex-wrap items-center gap-6 font-mono text-xs text-sub [--d:500ms] [&_button]:transition-all [&_button:active]:scale-95">
          <Link href="/write" className="hover:text-text">
            ← next task
          </Link>
          <button
            onClick={() => {
              const next = !isPublic;
              setIsPublic(next);
              start(() => setSubmissionPublic(p.id, next));
            }}
            className="flex items-center gap-1.5 hover:text-text"
          >
            {isPublic ? <GlobeIcon className="size-3" /> : <LockIcon className="size-3" />}
            {isPublic ? "public on your profile" : "private"}
          </button>
          {p.status === "done" && (
            <button onClick={rerun} className="flex items-center gap-1.5 hover:text-text">
              <RotateCwIcon className="size-3" /> re-analyse
            </button>
          )}
          <button
            onClick={() => confirm("Delete this essay?") && start(() => deleteSubmission(p.id))}
            className="flex items-center gap-1.5 hover:text-error"
          >
            <Trash2Icon className="size-3" /> delete
          </button>
        </footer>
      )}
    </div>
  );
}
