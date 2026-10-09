"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/app/actions";

export function AuthForm({ mode, action }: { mode: "login" | "register"; action: (s: FormState, f: FormData) => Promise<FormState> }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <div className="mx-auto mt-16 w-full max-w-xs">
      <h1 className="mb-1 font-display text-5xl text-text">{mode === "login" ? "Welcome back" : "Start writing"}</h1>
      <p className="mb-8 italic text-sub">{mode === "login" ? "sign in to continue your streak" : "one account, all your essays"}</p>
      <form action={formAction} className="flex flex-col gap-3">
        <Input name="username" placeholder="username" autoComplete="username" required className="h-11 border-none bg-sub-alt font-mono transition-shadow focus-visible:ring-1 focus-visible:ring-text/40" />
        <Input
          name="password"
          type="password"
          placeholder="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          className="h-11 border-none bg-sub-alt font-mono transition-shadow focus-visible:ring-1 focus-visible:ring-text/40"
        />
        {state?.error && <p className="text-sm text-error">{state.error}</p>}
        <Button type="submit" disabled={pending} className="h-11 font-mono transition-transform active:scale-[0.98]">
          {pending ? "..." : mode === "login" ? "sign in" : "create account"}
        </Button>
      </form>
      <p className="mt-6 text-center font-mono text-xs text-sub">
        {mode === "login" ? (
          <>
            no account?{" "}
            <Link href="/register" className="text-text underline-offset-4 hover:underline">
              register
            </Link>
          </>
        ) : (
          <>
            have an account?{" "}
            <Link href="/login" className="text-text underline-offset-4 hover:underline">
              login
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
