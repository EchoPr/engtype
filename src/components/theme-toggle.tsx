"use client";

import { flushSync } from "react-dom";
import { setTheme, useTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme !== "light";

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = dark ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      setTheme(next);
      return;
    }
    // circular reveal growing from the button
    const x = e.clientX;
    const y = e.clientY;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(() => flushSync(() => setTheme(next)));
    t.ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "light theme" : "dark theme"}
      className="relative p-2 text-sub transition-colors hover:text-text active:scale-90"
    >
      <SunIcon className={`size-5 transition-all duration-500 ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
      <MoonIcon
        className={`absolute inset-2 size-5 transition-all duration-500 ${dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
    </button>
  );
}
