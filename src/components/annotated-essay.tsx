"use client";

import { Fragment, useMemo } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { letterDiff, type LocatedIssue } from "@/lib/feedback";

export const KIND_LABEL: Record<string, string> = {
  spelling: "spelling",
  grammar: "grammar",
  punctuation: "punctuation",
  word_choice: "word choice",
  collocation: "collocation",
  style: "style",
  register: "register",
};

type Range = { start: number; end: number };

function withFocus(text: string, offset: number, focus: Range | null, key: string) {
  if (!focus || focus.end <= offset || focus.start >= offset + text.length) return text;
  const a = Math.max(0, focus.start - offset);
  const b = Math.min(text.length, focus.end - offset);
  return (
    <Fragment key={key}>
      {text.slice(0, a)}
      <span className="mark-focus" data-focus>
        {text.slice(a, b)}
      </span>
      {text.slice(b)}
    </Fragment>
  );
}

function IssueMark({ issue, focus, order }: { issue: LocatedIssue; focus: Range | null; order: number }) {
  const delay = { "--d": `${400 + order * 90}ms` } as React.CSSProperties;
  const spelling = issue.kind === "spelling" && !/\s/.test(issue.quote);
  const body = spelling
    ? letterDiff(issue.quote, issue.replacement).map((c, i) => (
        <span key={i} className={c.wrong ? "mark-letter" : undefined} style={c.wrong ? delay : undefined}>
          {c.ch}
        </span>
      ))
    : withFocus(issue.quote, issue.start, focus, "f");

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={80}
        closeDelay={80}
        render={
          <span
            style={delay}
            className={cn(
              "cursor-help rounded-sm transition-colors duration-200 hover:bg-sub-alt",
              !spelling && (issue.severity === "error" ? "mark-error" : "mark-improve"),
            )}
          />
        }
      >
        {body}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 border border-text/10 bg-sub-alt p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between font-mono text-[11px]">
          <span className={cn("rounded px-1.5 py-0.5", issue.severity === "error" ? "bg-text text-background" : "border border-sub/50 text-sub")}>
            {KIND_LABEL[issue.kind] ?? issue.kind}
          </span>
          <span className="italic text-sub">{issue.severity === "error" ? "mistake" : "could be better"}</span>
        </div>
        <div className="mb-2 font-mono text-sm">
          <span className="text-sub line-through decoration-sub/70">{issue.quote}</span>
          <span className="mx-2 text-sub">→</span>
          <span className="font-semibold text-text">{issue.replacement || "(remove)"}</span>
        </div>
        <p className="text-[15px] leading-snug text-text/80">{issue.explanation}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

export function AnnotatedEssay({
  text,
  issues,
  visible,
  focus,
}: {
  text: string;
  issues: LocatedIssue[];
  visible: (i: LocatedIssue) => boolean;
  focus: Range | null;
}) {
  const parts = useMemo(() => {
    const out: (string | LocatedIssue | { plain: string; at: number })[] = [];
    let pos = 0;
    for (const issue of issues) {
      if (!visible(issue)) continue;
      if (issue.start > pos) out.push({ plain: text.slice(pos, issue.start), at: pos });
      out.push(issue);
      pos = issue.end;
    }
    if (pos < text.length) out.push({ plain: text.slice(pos), at: pos });
    return out;
  }, [text, issues, visible]);

  let order = 0;
  return (
    <div className="whitespace-pre-wrap font-mono text-[17px] leading-[2.2] text-text">
      {parts.map((p, i) =>
        typeof p === "object" && "plain" in p ? (
          <Fragment key={i}>{withFocus(p.plain, p.at, focus, String(i))}</Fragment>
        ) : (
          <IssueMark key={i} issue={p as LocatedIssue} focus={focus} order={order++} />
        ),
      )}
    </div>
  );
}
