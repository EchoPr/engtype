import Link from "next/link";
import { GlobeIcon, LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CRITERIA, CRITERIA_LABEL } from "@/lib/feedback";
import { LEVELS, TASK_TYPES, type TaskType } from "@/lib/levels";
import type { UserStats } from "@/lib/stats";
import { CountUp } from "./count-up";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const KIND_LABEL: Record<string, string> = {
  spelling: "spelling", grammar: "grammar", punctuation: "punctuation", word_choice: "word choice",
  collocation: "collocation", style: "style", register: "register",
};

function Heatmap({ activity }: { activity: UserStats["activity"] }) {
  const DAY = 86400000;
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
  // start on the Sunday 52 weeks ago, like GitHub
  const start = today - 52 * 7 * DAY - new Date(today).getUTCDay() * DAY;
  const days: { key: string; words: number; essays: number }[] = [];
  for (let t = start; t <= today; t += DAY) {
    const key = new Date(t).toISOString().slice(0, 10);
    days.push({ key, ...(activity[key] ?? { words: 0, essays: 0 }) });
  }
  const max = Math.max(1, ...days.map((d) => d.words));
  const level = (w: number) => (w === 0 ? 0 : Math.min(4, Math.ceil((w / max) * 4)));
  const shades = ["bg-background", "bg-main/25", "bg-main/50", "bg-main/75", "bg-main"];
  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const months = weeks.map((w, i) => {
    const m = new Date(w[0].key).toLocaleString("en", { month: "short", timeZone: "UTC" });
    const prev = i ? new Date(weeks[i - 1][0].key).toLocaleString("en", { month: "short", timeZone: "UTC" }) : null;
    return m !== prev ? m : "";
  });

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-[3px] pl-0 text-[10px] text-sub">
          {months.map((m, i) => (
            <span key={i} className="w-[11px] overflow-visible whitespace-nowrap">
              {m}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {weeks.map((w, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {w.map((day, j) => (
                <div
                  key={day.key}
                  title={`${day.key}: ${day.words} words, ${day.essays} essay${day.essays === 1 ? "" : "s"}`}
                  style={d(200 + i * 14 + j * 10)}
                  className={cn(
                    "animate-pop size-[11px] rounded-[2px] transition-transform hover:scale-150 hover:ring-1 hover:ring-text/50",
                    shades[level(day.words)],
                  )}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-sub">
          less
          {shades.map((s) => (
            <span key={s} className={cn("size-[10px] rounded-[2px]", s)} />
          ))}
          more
        </div>
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: { band: number }[] }) {
  if (points.length < 2) return <p className="text-xs text-sub">write at least two essays to see a trend</p>;
  const W = 320;
  const H = 70;
  const xs = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys = points.map((p) => H - (p.band / 9) * H);
  const path = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`-4 -4 ${W + 8} ${H + 8}`} className="h-20 w-full max-w-sm">
      {[3, 6, 9].map((b) => (
        <line key={b} x1={0} x2={W} y1={H - (b / 9) * H} y2={H - (b / 9) * H} className="stroke-sub/30" strokeDasharray="2 4" />
      ))}
      <path d={path} pathLength={1} fill="none" className="animate-draw stroke-main" strokeWidth={1.5} strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r={2.5}
          className="animate-pop fill-main"
          style={{ ...d(300 + (i / xs.length) * 1100), transformBox: "fill-box", transformOrigin: "center" }}
        >
          <title>{points[i].band}</title>
        </circle>
      ))}
    </svg>
  );
}

function Num({ label, value, suffix, decimals = 0 }: { label: string; value: number | null; suffix?: string; decimals?: number }) {
  return (
    <div>
      <div className="font-mono text-[11px] text-sub">{label}</div>
      <div className="font-display text-5xl leading-tight tabular-nums text-main">
        {value == null ? "–" : <CountUp value={value} decimals={decimals} />}
        {value != null && suffix && <span className="text-2xl italic text-sub">{suffix}</span>}
      </div>
    </div>
  );
}

function Block({ title, children, className, delay = 0 }: { title: string; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <section className={cn("animate-rise rounded-2xl bg-sub-alt p-6", className)} style={d(delay)}>
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-sub">{title}</h2>
      {children}
    </section>
  );
}

export function ProfileView({
  username,
  bio,
  joined,
  stats,
  show,
  isOwner,
}: {
  username: string;
  bio: string;
  joined: number;
  stats: UserStats;
  show: { heatmap: boolean; scores: boolean; errors: boolean; essays: boolean };
  isOwner: boolean;
}) {
  const levelsMax = Math.max(1, ...Object.values(stats.levels));
  return (
    <div className="flex flex-col gap-6">
      <section className="animate-rise flex flex-wrap items-end justify-between gap-6 rounded-2xl bg-sub-alt p-6">
        <div className="flex items-center gap-5">
          <div className="animate-pop flex size-20 items-center justify-center rounded-full bg-text font-display text-4xl italic text-background">
            {username[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-display text-4xl text-text">{username}</div>
            <div className="font-mono text-xs text-sub">joined {new Date(joined * 1000).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</div>
            {bio && <p className="mt-1 max-w-md italic text-text/70">{bio}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-10">
          <Num label="essays" value={stats.totals.essays} />
          <Num label="words" value={stats.totals.words} />
          <Num label="minutes" value={stats.totals.minutes} />
          <Num label="streak" value={stats.streak.current} suffix="d" />
          <Num label="best streak" value={stats.streak.longest} suffix="d" />
        </div>
      </section>

      {show.heatmap && (
        <Block title={`${stats.totals.activeDays} active days in the last year`} delay={100}>
          <Heatmap activity={stats.activity} />
        </Block>
      )}

      {show.scores && (
        <div className="grid gap-6 md:grid-cols-2">
          <Block title="band" delay={200}>
            <div className="mb-4 flex gap-10">
              <Num label="average" value={stats.band.average} decimals={1} />
              <Num label="best" value={stats.band.best} decimals={1} />
            </div>
            <Sparkline points={stats.band.trend} />
          </Block>
          <Block title="criteria (average)" delay={260}>
            <div className="space-y-3">
              {CRITERIA.map((k, i) => (
                <div key={k}>
                  <div className="mb-1 flex justify-between font-mono text-xs">
                    <span className="text-sub">{CRITERIA_LABEL[k]}</span>
                    <span className="text-main">{stats.criteria[k] ?? "–"}</span>
                  </div>
                  <div className="h-1 rounded bg-background">
                    <div className="animate-grow-x h-full rounded bg-main" style={{ width: `${((stats.criteria[k] ?? 0) / 9) * 100}%`, ...d(400 + i * 90) }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-end gap-3">
              {LEVELS.map((l, i) => (
                <div key={l} className="flex flex-1 flex-col items-center gap-1 font-mono text-[10px] text-sub">
                  <div className="flex h-12 w-full items-end">
                    <div
                      className="animate-grow-y w-full rounded-sm bg-main/70"
                      style={{ height: `${((stats.levels[l] ?? 0) / levelsMax) * 100}%`, ...d(500 + i * 70) }}
                    />
                  </div>
                  {l}
                </div>
              ))}
            </div>
          </Block>
        </div>
      )}

      {show.errors && stats.errors && (
        <Block title={`mistakes · ${stats.errors.per100 ?? "–"} per 100 words`} delay={320}>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              {Object.entries(stats.errors.kinds)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v], i, arr) => (
                  <div key={k} className="flex items-center gap-3 font-mono text-xs">
                    <span className="w-24 text-sub">{KIND_LABEL[k] ?? k}</span>
                    <div className="h-1 flex-1 rounded bg-background">
                      <div className="animate-grow-x h-full rounded bg-text" style={{ width: `${(v / arr[0][1]) * 100}%`, ...d(450 + i * 80) }} />
                    </div>
                    <span className="w-6 text-right text-text">{v}</span>
                  </div>
                ))}
              {!Object.keys(stats.errors.kinds).length && <p className="text-xs text-sub">no data yet</p>}
            </div>
            <div className="flex flex-wrap content-start gap-2 text-xs">
              {Object.entries(stats.errors.meaning)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => (
                  <span key={k} className="rounded-full bg-background px-3 py-1 font-mono text-sub">
                    {k.replace("_", " ")} <span className="text-text">{v}</span>
                  </span>
                ))}
            </div>
          </div>
        </Block>
      )}

      {show.essays && (
        <Block title={isOwner ? "history" : "public essays"} delay={380}>
          {stats.submissions.length === 0 ? (
            <p className="text-xs text-sub">nothing here yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left font-mono text-[11px] text-sub">
                <tr>
                  <th className="pb-2 font-normal">task</th>
                  <th className="pb-2 font-normal">level</th>
                  <th className="pb-2 text-right font-normal">words</th>
                  <th className="pb-2 text-right font-normal">band</th>
                  <th className="hidden pb-2 text-right font-normal sm:table-cell">date</th>
                  {isOwner && <th className="pb-2" />}
                </tr>
              </thead>
              <tbody>
                {stats.submissions.map((s, i) => (
                  <tr key={s.id} className="animate-rise border-t border-background transition-colors hover:bg-background/40" style={d(450 + Math.min(i, 12) * 40)}>
                    <td className="py-2 pr-3">
                      <Link href={`/w/${s.id}`} className="text-[15px] text-text underline-offset-4 hover:underline">
                        {s.title}
                      </Link>
                      <span className="ml-2 font-mono text-xs text-sub">{TASK_TYPES[s.task_type as TaskType]?.label}</span>
                    </td>
                    <td className="py-2 text-sub">{s.level}</td>
                    <td className="py-2 text-right tabular-nums">{s.word_count}</td>
                    <td className="py-2 text-right font-display text-xl tabular-nums text-main">
                      {s.status === "done" ? s.band?.toFixed(1) : <span className="text-xs text-sub">{s.status}</span>}
                    </td>
                    <td className="hidden py-2 text-right text-xs text-sub sm:table-cell">
                      {new Date(s.created_at * 1000).toLocaleDateString("en", { day: "numeric", month: "short" })}
                    </td>
                    {isOwner && (
                      <td className="py-2 pl-3 text-right text-sub">
                        {s.is_public ? <GlobeIcon className="inline size-3" /> : <LockIcon className="inline size-3" />}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Block>
      )}
    </div>
  );
}
