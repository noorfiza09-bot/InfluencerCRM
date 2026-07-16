"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CampaignForm } from "@/components/campaign-form";
import { deleteCampaign, type CampaignWithCount } from "@/server/campaigns";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function CampaignList({ campaigns }: { campaigns: CampaignWithCount[] }) {
  const router = useRouter();
  const [editingCampaign, setEditingCampaign] = useState<CampaignWithCount | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<CampaignWithCount | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    if (!deletingCampaign) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      try {
        const result = await deleteCampaign(deletingCampaign.id);
        if (!result.success) {
          setDeleteError(result.error);
          return;
        }
        setDeletingCampaign(null);
        router.refresh();
      } catch {
        setDeleteError("Something went wrong. Try again.");
      }
    });
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-black/[.02] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Campaign</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Dates</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Budget</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Deliverables</th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-black/[.015]">
                <td className="px-4 py-3">
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="rounded font-medium hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                  >
                    {campaign.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">
                  {DATE.format(campaign.startDate)} – {DATE.format(campaign.endDate)}
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {CURRENCY.format(Number(campaign.budget))}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums">
                  {campaign._count.deliverables}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingCampaign(campaign)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-black/[.05] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setDeletingCampaign(campaign);
                      }}
                      className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={editingCampaign !== null}
        onClose={() => setEditingCampaign(null)}
        title="Edit campaign"
      >
        {editingCampaign && (
          <CampaignForm campaign={editingCampaign} onSuccess={() => setEditingCampaign(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={deletingCampaign !== null}
        onClose={() => setDeletingCampaign(null)}
        onConfirm={handleDelete}
        title="Delete campaign"
        description={`Remove ${
          deletingCampaign?.name ?? "this campaign"
        }? Its deliverables won't be erased — the campaign is archived, not deleted.`}
        error={deleteError}
        isPending={isDeleting}
      />
    </>
  );
}
