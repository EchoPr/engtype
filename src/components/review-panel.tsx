"use client";

import { useState } from "react";
import { ChevronDownIcon, CrosshairIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CRITERIA_LABEL, type Feedback } from "@/lib/feedback";
import { rubricFor, type AssessedCriterion } from "@/lib/assess";
import type { Metrics } from "@/lib/metrics";
import { KIND_LABEL } from "./annotated-essay";

const MEANING_LABEL: Record<string, string> = {
  task_response: "task response",
  logic: "logic",
  coherence: "coherence",
  cohesion: "cohesion",
  relevance: "relevance",
  clarity: "clarity",
  development: "development",
  tone: "tone",
};

const stagger = (i: number, base = 0) => ({ "--d": `${base + i * 70}ms` }) as React.CSSProperties;

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 mt-8 font-mono text-xs uppercase tracking-widest text-sub first:mt-0">{children}</h3>;
}

type Detail = AssessedCriterion & { capNotes: { id: string; max: number; when: string }[] };

function Criterion({
  label,
  score,
  comment,
  i,
  detail,
  onFocus,
}: {
  label: string;
  score: number;
  comment: string;
  i: number;
  detail?: Detail;
  onFocus: (quote: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="animate-rise" style={stagger(i, 150)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group mb-1 flex w-full items-center gap-2 font-mono text-xs"
      >
        <ChevronDownIcon className={cn("size-3.5 text-sub transition-transform duration-300 group-hover:text-text", open && "rotate-180 text-text")} />
        <span className={cn("flex-1 text-left transition-colors group-hover:text-text", open ? "text-text" : "text-sub")}>{label}</span>
        <span className="tabular-nums text-main">{score}</span>
      </button>
      <div className="h-1 overflow-hidden rounded bg-background">
        <div className="animate-grow-x h-full rounded bg-main" style={{ width: `${(score / 9) * 100}%`, ...stagger(i, 300) }} />
      </div>
      <div className={cn("grid transition-all duration-300 ease-out", open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="space-y-3 overflow-hidden">
          <p className="text-sm italic leading-relaxed text-text/75">{comment}</p>
          {detail && detail.capNotes.length > 0 && (
            <ul className="space-y-1 font-mono text-[11px] text-text/80">
              {detail.capNotes.map((c) => (
                <li key={c.id}>
                  ⤓ limited to {c.max}: {c.when}
                </li>
              ))}
            </ul>
          )}
          {detail && detail.evidence.length > 0 && (
            <ul className="space-y-1.5">
              {detail.evidence.map((e, j) => (
                <li key={j}>
                  <button type="button" onClick={() => onFocus(e.quote)} className="text-left text-sm transition-colors hover:text-text">
                    <span className="italic text-sub">“{e.quote}”</span> <span className="text-text/70">— {e.note}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {detail && detail.band < 9 && detail.whyNotHigher && (
            <p className="text-sm text-text/85">
              <span className="font-mono text-[11px] text-sub">for band {detail.band + 1}: </span>
              {detail.whyNotHigher}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Third window under the essay: meaning, logic and structure problems. */
export function MeaningPanel({ feedback, onFocus }: { feedback: Feedback; onFocus: (quote: string) => void }) {
  const issues = feedback.review.meaning_issues;
  return (
    <section className="animate-rise rounded-2xl bg-sub-alt p-6 [--d:350ms]">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl text-text">Meaning & structure</h2>
        <span className="font-mono text-xs text-sub">
          {issues.length ? `${issues.length} issue${issues.length === 1 ? "" : "s"} · click to show in text` : "no issues"}
        </span>
      </div>
      {issues.length === 0 ? (
        <p className="italic text-sub">Ideas are clear and well organised.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {issues.map((m, i) => (
            <li key={i} style={stagger(i, 450)} className="animate-rise">
              <button
                type="button"
                disabled={!m.quote}
                onClick={() => m.quote && onFocus(m.quote)}
                className="group h-full w-full rounded-xl border border-sub/20 bg-background/40 p-4 text-left transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-text/40"
              >
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-sub">
                  {MEANING_LABEL[m.category] ?? m.category}
                  {m.quote && <CrosshairIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
                </div>
                {m.quote && <p className="mb-2 text-sm italic text-sub">“{m.quote.length > 160 ? m.quote.slice(0, 160) + "…" : m.quote}”</p>}
                <p className="text-[15px] text-text/90">{m.problem}</p>
                <p className="mt-2 text-[15px] text-text">→ {m.suggestion}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Fourth window under the essay: what to work on next, most important first. */
export function RecommendationsPanel({ feedback }: { feedback: Feedback }) {
  const recs = [...feedback.review.recommendations].sort((a, b) => a.priority - b.priority);
  if (!recs.length) return null;
  return (
    <section className="animate-rise rounded-2xl bg-sub-alt p-6 [--d:450ms]">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl text-text">Recommendations</h2>
        <span className="font-mono text-xs text-sub">most important first</span>
      </div>
      <ol className="grid gap-4 md:grid-cols-2">
        {recs.map((x, i) => (
          <li
            key={i}
            style={stagger(i, 550)}
            className="animate-rise flex gap-4 rounded-xl border border-sub/20 bg-background/40 p-4 transition-colors duration-300 hover:border-text/40"
          >
            <span className="font-display text-4xl leading-none italic text-main">{i + 1}</span>
            <div>
              <p className="text-[15px] text-text">{x.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-text/70">{x.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ReviewPanel({ feedback, onFocus }: { feedback: Feedback; onFocus: (quote: string) => void }) {
  const r = feedback.review;
  const a = feedback.assessment;
  const rubric = a ? rubricFor(a.taskType) : null;
  const details: Record<string, Detail> = Object.fromEntries(
    (a?.criteria ?? []).map((c) => [
      c.key,
      { ...c, capNotes: c.capsApplied.map((id) => rubric?.caps.find((x) => x.id === id)).filter((x) => x !== undefined) },
    ]),
  );
  return (
    <div className="text-sm">
      <p className="animate-rise font-display text-2xl leading-snug text-text">{r.summary}</p>

      <H>criteria</H>
      <div className="space-y-3">
        {r.criteria.map((c, i) => (
          <Criterion
            key={c.key}
            label={CRITERIA_LABEL[c.key]}
            score={c.score}
            comment={c.comment}
            i={i}
            detail={details[c.key]}
            onFocus={onFocus}
          />
        ))}
      </div>

      {r.improved_sentences.length > 0 && (
        <>
          <H>level up these sentences</H>
          <ul className="space-y-4">
            {r.improved_sentences.map((s, i) => (
              <li key={i} className="animate-rise cursor-pointer transition-transform hover:translate-x-1" style={stagger(i, 200)} onClick={() => onFocus(s.original)}>
                <p className="font-mono text-xs text-sub line-through decoration-sub/40">{s.original}</p>
                <p className="mt-1 font-mono text-sm text-text">{s.improved}</p>
                <p className="mt-1 text-sm italic text-text/60">{s.why}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {r.vocabulary.length > 0 && (
        <>
          <H>vocabulary</H>
          <ul className="space-y-2 text-sm">
            {r.vocabulary.map((v, i) => (
              <li key={i} className="animate-rise" style={stagger(i, 200)}>
                <span className="font-mono text-text">{v.used}</span>
                <span className="mx-2 text-sub">→</span>
                <span className="italic text-main">{v.alternatives.join(", ")}</span>
                {v.note && <p className="text-text/60">{v.note}</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      {r.strengths.length > 0 && (
        <>
          <H>strengths</H>
          <ul className="space-y-1 text-[15px] text-text/85">
            {r.strengths.map((s, i) => (
              <li key={i} className="animate-rise" style={stagger(i, 200)}>
                + {s}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, hint, i = 0 }: { label: string; value: React.ReactNode; hint?: string; i?: number }) {
  return (
    <div title={hint} className="animate-rise" style={stagger(i)}>
      <div className="font-mono text-[11px] text-sub">{label}</div>
      <div className="font-display text-3xl tabular-nums text-text">{value}</div>
    </div>
  );
}

export function StatsPanel({ metrics, feedback }: { metrics: Metrics; feedback: Feedback | null }) {
  const counts = feedback ? Object.entries(feedback.counts).filter(([k]) => !k.startsWith("meaning:")) : [];
  const max = Math.max(1, ...counts.map(([, v]) => v));
  return (
    <div className="space-y-8 text-sm">
      <div className="grid grid-cols-3 gap-5">
        <Stat i={1} label="sentences" value={metrics.sentences} />
        <Stat i={2} label="paragraphs" value={metrics.paragraphs} />
        <Stat i={3} label="unique words" value={metrics.uniqueWords} />
        <Stat i={4} label="avg sentence" value={metrics.avgSentenceLength} hint="words per sentence" />
        <Stat i={5} label="longest" value={metrics.longestSentence} hint="words in the longest sentence" />
        <Stat i={6} label="avg word" value={metrics.avgWordLength} hint="letters per word" />
        <Stat i={7} label="diversity" value={metrics.lexicalDiversity} hint="moving-average type/token ratio (0-1). 0.7+ is varied" />
        <Stat i={8} label="long words" value={`${Math.round(metrics.longWordsShare * 100)}%`} hint="words with 7+ letters" />
        <Stat i={9} label="linkers" value={metrics.linkingWords} hint="however, therefore, for example ..." />
        <Stat i={10} label="readability" value={metrics.readability} hint="Flesch reading ease: higher = simpler" />
        <Stat i={11} label="wpm" value={metrics.wpm || "–"} hint="words per minute while writing" />
        <Stat i={12} label="characters" value={metrics.characters} />
      </div>

      {counts.length > 0 && (
        <div>
          <H>issues by type</H>
          <div className="space-y-2">
            {counts
              .sort((a, b) => b[1] - a[1])
              .map(([k, v], i) => (
                <div key={k} className="flex items-center gap-3 font-mono text-xs">
                  <span className="w-24 text-sub">{KIND_LABEL[k] ?? k}</span>
                  <div className="h-1 flex-1 rounded bg-background">
                    <div className="animate-grow-x h-full rounded bg-text" style={{ width: `${(v / max) * 100}%`, ...stagger(i, 300) }} />
                  </div>
                  <span className="w-5 text-right tabular-nums text-text">{v}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {metrics.topWords.length > 0 && (
        <div>
          <H>most repeated words</H>
          <div className="flex flex-wrap gap-2 text-xs">
            {metrics.topWords.map((w, i) => (
              <span key={w.word} className="animate-pop rounded-full bg-background px-3 py-1 font-mono" style={stagger(i, 300)}>
                {w.word} <span className="text-main">{w.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
