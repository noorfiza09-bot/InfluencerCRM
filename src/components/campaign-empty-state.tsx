import { AddCampaignButton } from "@/components/add-campaign-button";

export function CampaignEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <p className="text-sm font-medium">No campaigns yet</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Create your first campaign to start attaching creators as deliverables.
      </p>
      <div className="mt-4 flex justify-center">
        <AddCampaignButton />
      </div>
    </div>
  );
}
