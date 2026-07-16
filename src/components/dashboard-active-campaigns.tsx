import Link from "next/link";
import {
  getCampaignStatus,
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_STATUS_CLASSES,
} from "@/lib/campaign-status";
import type { CampaignWithCount } from "@/server/campaigns";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function DashboardActiveCampaigns({ campaigns }: { campaigns: CampaignWithCount[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center text-sm text-[var(--muted)]">
        No campaigns yet.{" "}
        <Link
          href="/campaigns"
          className="rounded font-medium text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
        >
          Create your first campaign →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, i) => {
        const status = getCampaignStatus(campaign);
        return (
          <Link
            key={campaign.id}
            href={`/campaigns/${campaign.id}`}
            className="card-hover animate-fade-up rounded-lg border border-[var(--border)] bg-white p-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{campaign.name}</p>
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${CAMPAIGN_STATUS_CLASSES[status]}`}
              >
                {CAMPAIGN_STATUS_LABELS[status]}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {DATE.format(campaign.startDate)} – {DATE.format(campaign.endDate)}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-mono tabular-nums">
                {CURRENCY.format(Number(campaign.budget))}
              </span>
              <span className="text-[var(--muted)]">
                {campaign._count.deliverables} deliverable
                {campaign._count.deliverables === 1 ? "" : "s"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
