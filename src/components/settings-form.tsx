"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LEVELS } from "@/lib/levels";
import { cn } from "@/lib/utils";
import { saveSettings } from "@/app/actions";
import { QuotaMeter, type QuotaView } from "./quota-meter";

type Props = {
  bio: string;
  targetLevel: string;
  quota: QuotaView;
  privacy: { profile_public: boolean; public_heatmap: boolean; public_scores: boolean; public_essays: boolean };
};

function Row({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="animate-rise grid gap-3 py-5 sm:grid-cols-[1fr_minmax(0,22rem)] sm:items-center">
      <div>
        <div className="font-display text-2xl text-text">{title}</div>
        {hint && <div className="mt-1 text-sm italic leading-relaxed text-sub">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 py-1.5 text-sm text-text/80">
      {label}
      <Switch name={name} defaultChecked={defaultChecked} />
    </label>
  );
}

export function SettingsForm(p: Props) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const [level, setLevel] = useState(p.targetLevel);
  const field = "h-9 border-none bg-sub-alt font-mono transition-shadow focus-visible:ring-1 focus-visible:ring-text/40";

  return (
    <form action={action} className="divide-y divide-sub-alt">
      <Row title="plan" hint="Limits count over the last 24 hours. When Full Reviews run out, you still get a Quick Check: Level and overall score.">
        <QuotaMeter quota={p.quota} />
      </Row>

      <Row title="target level" hint="default level for new tasks">
        <input type="hidden" name="target_level" value={level} />
        <div className="flex gap-1 rounded-lg bg-sub-alt p-1 text-xs">
          {LEVELS.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "flex-1 rounded px-2 py-1.5 font-mono transition-all duration-300 active:scale-90",
                level === l ? "bg-main text-background" : "text-sub hover:text-text",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </Row>

      <Row title="bio" hint="shown on your profile">
        <Input name="bio" defaultValue={p.bio} maxLength={200} className={field} />
      </Row>

      <Row title="privacy" hint="what other people see on /u/your-name. Mistake statistics are always private.">
        <Toggle name="profile_public" label="public profile" defaultChecked={p.privacy.profile_public} />
        <Toggle name="public_heatmap" label="show activity heatmap" defaultChecked={p.privacy.public_heatmap} />
        <Toggle name="public_scores" label="show bands & criteria" defaultChecked={p.privacy.public_scores} />
        <Toggle name="public_essays" label="new essays are public by default" defaultChecked={p.privacy.public_essays} />
      </Row>

      <div className="flex items-center gap-4 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "saving..." : "save"}
        </Button>
        {state?.error && <span className="text-sm text-error">{state.error}</span>}
        {state?.ok && <span className="animate-rise text-sm italic text-text">{state.ok} ✓</span>}
      </div>
    </form>
  );
}
