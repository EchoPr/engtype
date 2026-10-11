"use client";

import { useState } from "react";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { IssueHint } from "@/components/annotated-essay";
import type { InlineIssueT } from "@/lib/feedback";

type DemoIssue = Pick<InlineIssueT, "kind" | "severity" | "quote" | "replacement" | "explanation">;

/** Mock Inline Issues for the landing page; the explanations are in Russian like the rest of the landing. */
const ISSUES = {
  peoples: {
    kind: "grammar",
    severity: "error",
    quote: "peoples",
    replacement: "people",
    explanation: "«people» уже множественное число, окончание -s не нужно.",
  },
  veryGood: {
    kind: "word_choice",
    severity: "improve",
    quote: "very good",
    replacement: "highly appealing",
    explanation: "«very good» звучит разговорно. В эссе точное слово поднимает Lexical Resource.",
  },
  article: {
    kind: "grammar",
    severity: "error",
    quote: "a cleaner air",
    replacement: "cleaner air",
    explanation: "«air» неисчисляемое, с ним не ставят артикль «a».",
  },
  because: {
    kind: "spelling",
    severity: "error",
    quote: "becuase",
    replacement: "because",
    explanation: "Переставлены буквы. Подсвечены именно те, что стоят не на месте.",
  },
} satisfies Record<string, DemoIssue>;

type Id = keyof typeof ISSUES;

/** One hint is open from the start so visitors see what hovering does; hovering another one moves it. */
const DEFAULT_OPEN: Id = "peoples";

export function LandingDemo() {
  const [open, setOpen] = useState<Id | null>(DEFAULT_OPEN);

  const mark = (id: Id, className: string, children: React.ReactNode) => (
    <HoverCard open={open === id} onOpenChange={(next) => setOpen((cur) => (next ? id : cur === id ? null : cur))}>
      <HoverCardTrigger
        delay={80}
        closeDelay={80}
        render={<span className={`cursor-help rounded-sm transition-colors duration-200 hover:bg-background/60 ${className}`} />}
      >
        {children}
      </HoverCardTrigger>
      {/* above the mark: the hint that is open from the start must not cover the marks below it */}
      <IssueHint issue={ISSUES[id]} side="top" />
    </HoverCard>
  );

  return (
    <p>
      Many {mark("peoples", "mark-error", "peoples")} believe that living in a city is {mark("veryGood", "mark-improve", "very good")}{" "}
      because there are more jobs. However, the countryside offers a quieter life and {mark("article", "mark-error", "a")} cleaner
      air, which is important for families. In my opinion, the best choice depends on age,{" "}
      {mark(
        "because",
        "",
        <>
          bec<span className="mark-letter">ua</span>se
        </>,
      )}{" "}
      young people usually need opportunities more than silence.
    </p>
  );
}
