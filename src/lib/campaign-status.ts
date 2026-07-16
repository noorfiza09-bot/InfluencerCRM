import type { Campaign } from "@prisma/client";

export type CampaignStatus = "UPCOMING" | "ACTIVE" | "ENDED";

/** Campaigns have no explicit "active" flag — status is derived from
 *  today vs. the start/end date range. */
export function getCampaignStatus(campaign: Pick<Campaign, "startDate" | "endDate">): CampaignStatus {
  const now = new Date();
  if (now < campaign.startDate) return "UPCOMING";
  if (now > campaign.endDate) return "ENDED";
  return "ACTIVE";
}

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  UPCOMING: "Upcoming",
  ACTIVE: "Active",
  ENDED: "Ended",
};

export const CAMPAIGN_STATUS_CLASSES: Record<CampaignStatus, string> = {
  UPCOMING: "bg-blue-50 text-blue-700 ring-blue-600/20",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  ENDED: "bg-zinc-100 text-zinc-700 ring-zinc-600/20",
};
