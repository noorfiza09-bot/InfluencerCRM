import { STAGE_ORDER, STAGE_LABELS, type StageValue } from "@/lib/validators";
import type { StageCounts } from "@/server/deliverables";

// Same hue family as stage-badge.tsx, used here as a slim top bar so the
// dashboard visually echoes the landing page's rundown ticker.
const STAGE_BAR_CLASSES: Record<StageValue, string> = {
  OUTREACH_SENT: "bg-zinc-700",
  NEGOTIATING: "bg-amber-500",
  CONTRACTED: "bg-blue-600",
  CONTENT_SUBMITTED: "bg-violet-600",
  POSTED: "bg-emerald-500",
  PAID: "bg-[var(--accent)]",
};

export function DashboardStageSummary({ counts }: { counts: StageCounts }) {
  const total = STAGE_ORDER.reduce((sum, stage) => sum + counts[stage], 0);

  if (total === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center text-sm text-[var(--muted)]">
        No deliverables yet — attach a creator to a campaign to see stage counts here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STAGE_ORDER.map((stage, i) => (
        <div
          key={stage}
          className="card-hover animate-fade-up overflow-hidden rounded-lg border border-[var(--border)] bg-white"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`h-1 ${STAGE_BAR_CLASSES[stage]}`} />
          <div className="p-4">
            <p className="font-mono text-2xl font-semibold tabular-nums">{counts[stage]}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{STAGE_LABELS[stage]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
