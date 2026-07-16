import { AddCampaignButton } from "@/components/add-campaign-button";

export function CampaignEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M2 5h14M2 9h9M2 13h5"
            stroke="var(--accent)"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="mt-3 text-sm font-medium">No campaigns yet</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Create your first campaign to start attaching creators as deliverables.
      </p>
      <div className="mt-4 flex justify-center">
        <AddCampaignButton />
      </div>
    </div>
  );
}
