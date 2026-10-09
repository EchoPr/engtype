import { cn } from "@/lib/utils";
import { inHours, type QuotaStatus } from "@/lib/quota";

/** Quota status plus the server's clock, so relative times render the same on server and client. */
export type QuotaView = QuotaStatus & { now: number };

function Line({ label, used, limit, nextAt, now }: { label: string; used: number; limit: number; nextAt: number | null; now: number }) {
  const left = Math.max(0, limit - used);
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs">
        <span className="text-sub">{label}</span>
        <span className={cn("tabular-nums", left ? "text-text" : "text-sub")}>
          {left}/{limit} left{nextAt ? ` · next in ${inHours(nextAt, now)}` : ""}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded bg-background">
        <div className="animate-grow-x h-full rounded bg-main" style={{ width: `${(left / limit) * 100}%` }} />
      </div>
    </div>
  );
}

export function QuotaMeter({ quota }: { quota: QuotaView }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-xs">
        <span className="rounded bg-text px-1.5 py-0.5 text-background">{quota.plan}</span>
      </p>
      <Line label="full reviews" {...quota.full} now={quota.now} />
      <Line label="quick checks" {...quota.quick} now={quota.now} />
      <Line label="ai tasks" {...quota.task} now={quota.now} />
    </div>
  );
}
