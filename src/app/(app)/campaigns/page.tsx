import { listCampaigns } from "@/server/campaigns";
import { CampaignList } from "@/components/campaign-list";
import { CampaignEmptyState } from "@/components/campaign-empty-state";
import { AddCampaignButton } from "@/components/add-campaign-button";

export default async function CampaignsPage() {
  const campaigns = await listCampaigns();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {campaigns.length} active campaign{campaigns.length === 1 ? "" : "s"}
          </p>
        </div>
        {campaigns.length > 0 && <AddCampaignButton />}
      </div>

      <div className="mt-6">
        {campaigns.length === 0 ? (
          <CampaignEmptyState />
        ) : (
          <CampaignList campaigns={campaigns} />
        )}
      </div>
    </div>
  );
}
