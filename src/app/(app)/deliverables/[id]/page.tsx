import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeliverableById } from "@/server/deliverables";
import { DeliverableStatusSelect } from "@/components/deliverable-status-select";
import { NoteTimeline } from "@/components/note-timeline";
import { PlatformBadge } from "@/components/platform-badge";
import { CreatorAvatar } from "@/components/creator-avatar";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function DeliverableDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deliverable = await getDeliverableById(id);

  if (!deliverable) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/campaigns/${deliverable.campaign.id}`}
        className="rounded text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
      >
        ← Back to {deliverable.campaign.name}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <CreatorAvatar name={deliverable.creator.name} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              <Link
                href={`/creators/${deliverable.creator.id}`}
                className="rounded hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                {deliverable.creator.name}
              </Link>
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {deliverable.creator.handle} · {deliverable.campaign.name}
            </p>
          </div>
        </div>
        <div className="w-48 shrink-0">
          <DeliverableStatusSelect deliverableId={deliverable.id} status={deliverable.status} />
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Platform</dt>
          <dd className="mt-1">
            <PlatformBadge platform={deliverable.creator.platform} />
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Due date</dt>
          <dd className="mt-1 text-sm">
            {deliverable.dueDate ? DATE.format(deliverable.dueDate) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Amount</dt>
          <dd className="mt-1 font-mono text-sm">
            {deliverable.amount !== null ? CURRENCY.format(Number(deliverable.amount)) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Added</dt>
          <dd className="mt-1 text-sm">{DATE.format(deliverable.createdAt)}</dd>
        </div>
      </dl>

      <div className="mt-10">
        <h2 className="text-sm font-semibold">Notes</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Log negotiation updates, replies, or anything worth remembering about this deal.
        </p>
        <div className="mt-3">
          <NoteTimeline deliverableId={deliverable.id} notes={deliverable.notes} />
        </div>
      </div>
    </div>
  );
}
