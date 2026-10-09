"use client";

import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronDownIcon, DatabaseIcon, Loader2Icon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVELS, TASK_TYPES, defaultTaskType, offeredTaskTypes, taskSpec, type Level, type TaskType } from "@/lib/levels";
import { countWords } from "@/lib/metrics";
import { newTask, saveDraft, submitEssay } from "@/app/actions";
import { inHours } from "@/lib/quota";
import type { QuotaView } from "./quota-meter";

export type WriterTask = {
  id: number;
  task_type: TaskType;
  level: Level;
  title: string;
  prompt: string;
  tips: string[];
  min_words: number;
  minutes: number;
  draft: string;
  draft_seconds: number;
};

function Pill({ active, onClick, children, disabled }: { active?: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-active={active || undefined}
      className={cn(
        "relative z-10 rounded-md px-2.5 py-1 transition-colors duration-300 active:scale-95 disabled:opacity-40",
        active ? "text-background" : "text-sub hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

/** A group of pills with an inverted chip that slides to the active one. */
function Segment({ children, deps }: { children: React.ReactNode; deps: unknown }) {
  const box = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const active = box.current?.querySelector<HTMLElement>("[data-active]");
      const c = chip.current;
      if (!c) return;
      if (!active) {
        c.style.opacity = "0";
        return;
      }
      const a = active.getBoundingClientRect();
      const b = box.current!.getBoundingClientRect();
      c.style.opacity = "1";
      c.style.transform = `translateX(${a.left - b.left}px)`;
      c.style.width = `${a.width}px`;
    };
    measure();
    // widths change when the web font swaps in or the bar wraps
    const el = box.current;
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    el?.addEventListener("animationend", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      el?.removeEventListener("animationend", measure);
    };
  }, [deps]);
  return (
    <div ref={box} className="relative flex items-center">
      <span
        ref={chip}
        aria-hidden
        className="absolute left-0 top-0 h-full rounded-md bg-text opacity-0 transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.3,1.2,0.5,1)]"
      />
      {children}
    </div>
  );
}

const Divider = () => <span className="mx-1.5 h-4 w-px bg-sub/40" />;

const fmt = (s: number) => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, "0")}`;

export function Writer({
  initialTask,
  defaultLevel,
  aiReady,
  quota,
}: {
  initialTask: WriterTask | null;
  defaultLevel: Level;
  aiReady: boolean;
  quota: QuotaView;
}) {
  const aiTasks = aiReady && quota.task.left > 0;
  const [level, setLevel] = useState<Level>(initialTask?.level ?? defaultLevel);
  const [taskType, setTaskType] = useState<TaskType>(initialTask?.task_type ?? defaultTaskType(defaultLevel));
  const [source, setSource] = useState<"ai" | "bank">(aiTasks ? "ai" : "bank");
  const [topic, setTopic] = useState("");
  const [dirty, setDirty] = useState(Boolean(initialTask?.draft.trim()));
  const [generating, startGenerating] = useTransition();

  const typeOptions = offeredTaskTypes(level);
  const spec = taskSpec(taskType, level);

  function pickLevel(l: Level) {
    setLevel(l);
    if (!(TASK_TYPES[taskType].levels as readonly Level[]).includes(l)) setTaskType(defaultTaskType(l));
  }

  function generate() {
    if (dirty && !confirm("Discard the current draft and get a new task?")) return;
    startGenerating(async () => {
      const res = await newTask({ taskType, level, topic, source });
      if ("error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      // the action refreshes the page with the new open task; the editor remounts via its key
      setDirty(false);
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* config bar */}
      <div className="mx-auto flex flex-wrap items-center justify-center gap-y-1 rounded-xl bg-sub-alt px-2 py-1.5 font-mono text-xs shadow-sm">
        <Segment deps={source}>
          <Pill active={source === "ai"} onClick={() => setSource("ai")} disabled={!aiTasks}>
            <SparklesIcon className="mr-1 inline size-3" />
            ai
          </Pill>
          <Pill active={source === "bank"} onClick={() => setSource("bank")}>
            <DatabaseIcon className="mr-1 inline size-3" />
            exam bank
          </Pill>
        </Segment>
        <Divider />
        <Segment deps={level}>
          {LEVELS.map((l) => (
            <Pill key={l} active={level === l} onClick={() => pickLevel(l)}>
              {l}
            </Pill>
          ))}
        </Segment>
        <Divider />
        <Segment deps={`${level}:${taskType}`}>
          {typeOptions.map((t, i) => (
            <span key={t} className="animate-rise" style={{ "--d": `${i * 40}ms` } as React.CSSProperties}>
              <Pill active={taskType === t} onClick={() => setTaskType(t)}>
                {TASK_TYPES[t].label}
              </Pill>
            </span>
          ))}
        </Segment>
        <Divider />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          maxLength={120}
          placeholder="topic (optional)"
          title={`${spec.minWords ? `${spec.minWords}+ words` : "no minimum length"} · ${spec.minutes} min`}
          className="w-36 bg-transparent px-2 py-1 text-text outline-none placeholder:text-sub"
        />
      </div>

      {!aiReady && (
        <p className="-mt-6 text-center text-xs text-sub">AI feedback is temporarily unavailable: tasks come from the exam bank.</p>
      )}

      {!initialTask ? (
        <div className="mt-16 flex flex-col items-center gap-5 text-sub">
          <p className={cn("font-display text-3xl italic", generating ? "text-shimmer" : "text-text/70")}>
            {generating ? "composing a task…" : "pick a level and format, then get a task"}
          </p>
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 rounded-full border border-text/20 px-6 py-3 font-mono text-sm text-text transition-all duration-300 hover:bg-text hover:text-background active:scale-95"
          >
            {generating ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4" />}
            new task
          </button>
        </div>
      ) : (
        <TaskEditor key={initialTask.id} task={initialTask} aiReady={aiReady} quota={quota} generating={generating} onGenerate={generate} onDirty={setDirty} />
      )}
    </div>
  );
}

function TaskEditor({
  task,
  aiReady,
  quota,
  generating,
  onGenerate,
  onDirty,
}: {
  task: WriterTask;
  aiReady: boolean;
  quota: QuotaView;
  generating: boolean;
  onGenerate: () => void;
  onDirty: (dirty: boolean) => void;
}) {
  const router = useRouter();
  const [text, setText] = useState(task.draft);
  const [elapsed, setElapsed] = useState(task.draft_seconds);
  const [showTips, setShowTips] = useState(false);
  const [submitting, startSubmitting] = useTransition();
  const lastTyped = useRef(0);
  const elapsedRef = useRef(elapsed);
  const area = useRef<HTMLTextAreaElement>(null);
  const words = countWords(text);

  // timer: runs while the user has typed within the last 90 seconds
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - lastTyped.current < 90_000) setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  // autosave draft
  useEffect(() => {
    const id = setTimeout(() => saveDraft(task.id, text, elapsedRef.current), 1200);
    return () => clearTimeout(id);
  }, [task.id, text]);

  // autosize textarea
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  function submit() {
    if (words < Math.min(task.min_words * 0.5 || 30, 30) && !confirm(`Only ${words} words. Submit anyway?`)) return;
    startSubmitting(async () => {
      const res = await submitEssay(task.id, text, elapsed);
      if ("error" in res && res.error) toast.error(res.error);
      else if ("id" in res) router.push(`/w/${res.id}`);
    });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const remaining = task.minutes * 60 - elapsed;

  return (
    <>
      {/* task */}
      <section className={cn("animate-rise transition-all duration-500", generating && "scale-[0.99] opacity-30 blur-[2px]")}>
        <div className="mb-3 flex items-baseline gap-3 font-mono text-xs text-sub">
          <span className="rounded bg-text px-1.5 py-0.5 text-background">{task.level}</span>
          <span>{TASK_TYPES[task.task_type].label}</span>
        </div>
        <h2 className="mb-3 font-display text-4xl leading-tight text-text">{task.title}</h2>
        <p className="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-text/85">{task.prompt}</p>
        {task.tips.length > 0 && (
          <button onClick={() => setShowTips((s) => !s)} className="mt-4 flex items-center gap-1 font-mono text-xs text-sub hover:text-text">
            <ChevronDownIcon className={cn("size-3 transition-transform", showTips && "rotate-180")} />
            tips
          </button>
        )}
        {showTips && (
          <ul className="mt-2 space-y-1 text-sm italic text-sub">
            {task.tips.map((t, i) => (
              <li key={i} className="animate-rise" style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                — {t}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* live stats */}
      <section className="animate-rise" style={{ "--d": "120ms" } as React.CSSProperties}>
        <div className="mb-3 flex items-baseline gap-8 font-mono text-main">
          <span className={cn("text-4xl tabular-nums transition-opacity", remaining < 0 && "animate-pulse")}>
            {remaining < 0 && "+"}
            {fmt(remaining)}
          </span>
          <span className="text-2xl tabular-nums">
            <span key={words} className="inline-block animate-pop [animation-duration:250ms]">
              {words}
            </span>
            {task.min_words > 0 && <span className="text-sub">/{task.min_words}</span>}
          </span>
          {task.min_words > 0 && words >= task.min_words && <span className="animate-rise text-xs italic text-text/70">✓ target reached</span>}
        </div>
        <div className="h-px w-full bg-sub/30">
          <div
            className="h-full bg-main transition-[width] duration-500 ease-out"
            style={{ width: `${task.min_words ? Math.min(100, (words / task.min_words) * 100) : 0}%` }}
          />
        </div>
      </section>

      <textarea
        ref={area}
        value={text}
        autoFocus
        onChange={(e) => {
          lastTyped.current = Date.now();
          setText(e.target.value);
          onDirty(e.target.value.trim().length > 0);
        }}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        placeholder="start typing..."
        className="animate-rise min-h-[40vh] w-full resize-none bg-transparent font-mono text-lg leading-[2] text-text caret-main outline-none placeholder:italic placeholder:text-sub [--d:200ms]"
      />

      <div className="flex items-center justify-between font-mono text-xs text-sub">
        <div className="flex gap-4">
          <button onClick={onGenerate} disabled={generating || submitting} className="group flex items-center gap-1 transition-colors hover:text-text">
            {generating ? (
              <Loader2Icon className="size-3 animate-spin" />
            ) : (
              <RefreshCwIcon className="size-3 transition-transform duration-500 group-hover:rotate-180" />
            )}
            new task
          </button>
        </div>
        <span className="ml-auto mr-4 hidden text-right sm:block">
          {quota.full.left > 0 ? (
            <>
              <span className="text-text">{quota.full.left}</span> full review{quota.full.left === 1 ? "" : "s"} left
            </>
          ) : quota.quick.left > 0 ? (
            <>
              quick check · full review in {inHours(quota.full.nextAt ?? quota.now, quota.now)}{" "}
              <Link href="/settings" className="underline-offset-4 hover:text-text hover:underline">
                limits
              </Link>
            </>
          ) : (
            <>no reviews left · back in {inHours(Math.min(quota.full.nextAt ?? Infinity, quota.quick.nextAt ?? Infinity), quota.now)}</>
          )}
        </span>
        <button
          onClick={submit}
          disabled={submitting || !aiReady}
          title={aiReady ? undefined : "AI feedback is temporarily unavailable"}
          className="flex items-center gap-2 rounded-full border border-text/20 px-5 py-2 text-text transition-all duration-300 hover:bg-text hover:text-background active:scale-95 disabled:opacity-40 [&:hover_kbd]:text-background/60"
        >
          {submitting && <Loader2Icon className="size-3 animate-spin" />}
          submit
          <kbd className="text-[10px] text-sub transition-colors">ctrl+enter</kbd>
        </button>
      </div>
    </>
  );
}
