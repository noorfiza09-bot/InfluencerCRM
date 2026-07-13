import Link from "next/link";
import { notFound } from "next/navigation";
import { getCreatorById } from "@/server/creators";
import { listDeliverablesByCreator } from "@/server/deliverables";
import { PlatformBadge } from "@/components/platform-badge";
import { StageBadge } from "@/components/stage-badge";
import { CreatorDetailActions } from "@/components/creator-detail-actions";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function formatFollowers(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function CreatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = await getCreatorById(id);

  if (!creator) {
    notFound();
  }

  const isArchived = creator.deletedAt !== null;
  const deliverables = await listDeliverablesByCreator(id);

  return (
    <div>
      <Link
        href="/creators"
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        ← Back to creators
      </Link>

      {isArchived && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This creator has been archived and no longer appears in your directory.
        </div>
      )}

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{creator.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{creator.handle}</p>
        </div>
        {!isArchived && <CreatorDetailActions creator={creator} />}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Platform</dt>
          <dd className="mt-1">
            <PlatformBadge platform={creator.platform} />
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Followers</dt>
          <dd className="mt-1 font-mono text-sm">{formatFollowers(creator.followers)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Email</dt>
          <dd className="mt-1 text-sm">{creator.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Added</dt>
          <dd className="mt-1 text-sm">
            {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(creator.createdAt)}
          </dd>
        </div>
      </dl>

      <div className="mt-8">
        <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Niche tags</dt>
        <dd className="mt-2 flex flex-wrap gap-1.5">
          {creator.niche.length === 0 ? (
            <span className="text-sm text-[var(--muted)]">No tags yet</span>
          ) : (
            creator.niche.map((tag) => (
              <span key={tag} className="rounded-full bg-black/[.05] px-2.5 py-1 text-xs">
                {tag}
              </span>
            ))
          )}
        </dd>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold">Deliverable history</h2>
        {deliverables.length === 0 ? (
          <div className="mt-3 rounded-md border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
            No campaigns yet — attach this creator to a campaign to see it here.
          </div>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-black/[.02] text-xs uppercase tracking-wide text-[var(--muted)]">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Campaign</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Stage</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Due date</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {deliverables.map((deliverable) => (
                  <tr key={deliverable.id} className="hover:bg-black/[.015]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/campaigns/${deliverable.campaign.id}`}
                        className="font-medium hover:text-[var(--accent)] hover:underline"
                      >
                        {deliverable.campaign.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={deliverable.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {deliverable.dueDate ? DATE.format(deliverable.dueDate) : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums">
                      {deliverable.amount !== null
                        ? CURRENCY.format(Number(deliverable.amount))
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
