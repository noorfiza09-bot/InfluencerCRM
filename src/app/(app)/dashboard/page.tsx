import { listCampaigns } from "@/server/campaigns";
import { getStageCounts, getUpcomingDeliverables } from "@/server/deliverables";
import { DashboardStageSummary } from "@/components/dashboard-stage-summary";
import { DashboardUpcomingDueDates } from "@/components/dashboard-upcoming-due-dates";
import { DashboardActiveCampaigns } from "@/components/dashboard-active-campaigns";

export default async function DashboardPage() {
  const [stageCounts, upcomingDeliverables, campaigns] = await Promise.all([
    getStageCounts(),
    getUpcomingDeliverables(7),
    listCampaigns(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        A snapshot of every active campaign and where each deliverable stands.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Deliverables by stage</h2>
        <div className="mt-3">
          <DashboardStageSummary counts={stageCounts} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Due in the next 7 days</h2>
        <div className="mt-3">
          <DashboardUpcomingDueDates deliverables={upcomingDeliverables} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Active campaigns</h2>
        <div className="mt-3">
          <DashboardActiveCampaigns campaigns={campaigns} />
        </div>
      </section>
    </div>
  );
}
