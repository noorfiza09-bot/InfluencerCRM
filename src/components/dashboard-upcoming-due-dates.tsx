import Link from "next/link";
import { StageBadge } from "@/components/stage-badge";
import { CreatorAvatar } from "@/components/creator-avatar";
import type { UpcomingDeliverable } from "@/server/deliverables";

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function daysUntil(date: Date): number {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((date.getTime() - now.getTime()) / msPerDay);
}

function relativeDueLabel(date: Date): string {
  const days = daysUntil(date);
  if (days <= 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export function DashboardUpcomingDueDates({
  deliverables,
}: {
  deliverables: UpcomingDeliverable[];
}) {
  if (deliverables.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center text-sm text-[var(--muted)]">
        Nothing due in the next 7 days.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-[var(--border)]">
      {deliverables.map((deliverable) => (
        <li key={deliverable.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <CreatorAvatar name={deliverable.creator.name} size="sm" />
            <div className="min-w-0">
              <Link
                href={`/deliverables/${deliverable.id}`}
                className="rounded text-sm font-medium hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                {deliverable.creator.name}
              </Link>
              <p className="truncate text-xs text-[var(--muted)]">{deliverable.campaign.name}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <StageBadge stage={deliverable.status} />
            <div className="text-right">
              {/* dueDate is guaranteed non-null here — getUpcomingDeliverables
                  only returns rows matching a dueDate range filter. */}
              <p className="text-xs font-medium">{DATE.format(deliverable.dueDate!)}</p>
              <p className="text-xs text-[var(--muted)]">
                {relativeDueLabel(deliverable.dueDate!)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
