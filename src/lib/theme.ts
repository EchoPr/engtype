"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./theme-script";

export type Theme = "dark" | "light";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // private mode: the theme still applies for this page view
  }
  listeners.forEach((l) => l());
}

/** Current theme; `null` during SSR and hydration, when the server can't know it. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
