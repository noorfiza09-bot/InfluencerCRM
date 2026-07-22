import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignById } from "@/server/campaigns";
import { listDeliverablesByCampaign } from "@/server/deliverables";
import { listCreators } from "@/server/creators";
import { CampaignDetailActions } from "@/components/campaign-detail-actions";
import { AddDeliverableButton } from "@/components/add-deliverable-button";
import { DeliverableView } from "@/components/deliverable-view";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  const isArchived = campaign.deletedAt !== null;

  const [deliverables, creators] = await Promise.all([
    listDeliverablesByCampaign(id),
    listCreators({}),
  ]);

  return (
    <div>
      <Link
        href="/campaigns"
        className="rounded text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
      >
        ← Back to campaigns
      </Link>

      {isArchived && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This campaign has been archived and no longer appears in your campaigns list.
        </div>
      )}

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{campaign.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {DATE.format(campaign.startDate)} – {DATE.format(campaign.endDate)}
          </p>
        </div>
        {!isArchived && <CampaignDetailActions campaign={campaign} />}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Budget</dt>
          <dd className="mt-1 font-mono text-sm">{CURRENCY.format(Number(campaign.budget))}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Deliverables</dt>
          <dd className="mt-1 text-sm">{deliverables.length}</dd>
        </div>
      </dl>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Deliverables</h2>
          {deliverables.length > 0 && !isArchived && (
            <AddDeliverableButton campaignId={campaign.id} creators={creators} />
          )}
        </div>

        <div className="mt-3">
          {deliverables.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
              <p className="text-sm font-medium">No deliverables yet</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Add a creator to this campaign to start tracking the deal.
              </p>
              {!isArchived && (
                <div className="mt-4 flex justify-center">
                  <AddDeliverableButton campaignId={campaign.id} creators={creators} />
                </div>
              )}
            </div>
          ) : (
            <DeliverableView deliverables={deliverables} />
          )}
        </div>
      </div>
    </div>
  );
}
