"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { SendIcon, ShieldAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { askQuestion } from "@/app/actions";
import type { ChatMessage } from "@/lib/chat";

const SUGGESTIONS = [
  "What is my most common mistake?",
  "How can I make my introduction stronger?",
  "Explain the article errors again",
  "What should I practise next?",
];

/** Tiny markdown subset: **bold**, `code`, line breaks and "- " lists. */
function Md({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const bullet = /^\s*[-*]\s+/.test(line);
        const parts = line.replace(/^\s*[-*]\s+/, "").split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <div key={i} className={cn(bullet && "pl-3 -indent-3", !line.trim() && "h-2")}>
            {bullet && "• "}
            {parts.map((p, j) =>
              p.startsWith("**") ? (
                <strong key={j} className="font-medium text-text">
                  {p.slice(2, -2)}
                </strong>
              ) : p.startsWith("`") ? (
                <code key={j} className="rounded bg-background px-1 text-main">
                  {p.slice(1, -1)}
                </code>
              ) : (
                p
              ),
            )}
          </div>
        );
      })}
    </>
  );
}

export function ChatPanel({ submissionId, initial }: { submissionId: number; initial: ChatMessage[] }) {
  const [messages, setMessages] = useState(initial);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => bottom.current?.scrollIntoView({ block: "nearest" }), [messages, pending]);

  function send(q: string) {
    const question = q.trim();
    if (!question || pending) return;
    setInput("");
    start(async () => {
      const res = await askQuestion(submissionId, question);
      if (res.error) {
        toast.error(res.error);
        setInput(question);
      } else if (res.messages) {
        setMessages((m) => [...m, ...res.messages!]);
      }
    });
  }

  return (
    <div className="flex h-[60vh] flex-col">
      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="space-y-2 pt-2">
            <p className="animate-rise font-display text-xl italic text-text/80">ask about this essay, its mistakes or how to improve it</p>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{ "--d": `${150 + i * 70}ms` } as React.CSSProperties}
                className="animate-rise block text-left font-mono text-xs text-sub transition-all hover:translate-x-1 hover:text-text"
              >
                → {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "animate-rise leading-relaxed [animation-duration:400ms]",
              m.role === "user" ? "font-mono text-sm text-main" : "text-[15px] text-text/85",
            )}
          >
            {m.role === "user" ? (
              <div className={cn(m.blocked && "text-sub line-through decoration-sub/50")}>&gt; {m.content}</div>
            ) : m.blocked ? (
              <div className="flex gap-2 rounded-lg border border-dashed border-sub/50 px-3 py-2 font-mono text-xs italic text-sub">
                <ShieldAlertIcon className="mt-0.5 size-3.5 shrink-0" />
                {m.content}
              </div>
            ) : (
              <Md text={m.content} />
            )}
          </div>
        ))}
        {pending && (
          <div className="flex gap-1 py-1" aria-label="thinking">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-bounce rounded-full bg-sub" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
        <div ref={bottom} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-full border border-transparent bg-background px-4 py-2 transition-colors focus-within:border-text/30"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder="ask a question..."
          className="flex-1 bg-transparent font-mono text-sm text-text outline-none placeholder:italic placeholder:text-sub"
        />
        <button type="submit" disabled={pending || !input.trim()} className="text-sub transition-all hover:-translate-y-0.5 hover:translate-x-0.5 hover:text-main active:scale-90 disabled:opacity-40">
          <SendIcon className="size-4" />
        </button>
      </form>
    </div>
  );
}
