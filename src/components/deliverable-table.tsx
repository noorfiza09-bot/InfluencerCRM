"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DeliverableStatusSelect } from "@/components/deliverable-status-select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteDeliverable, type DeliverableWithCreator } from "@/server/deliverables";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function DeliverableTable({ deliverables }: { deliverables: DeliverableWithCreator[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const deletingDeliverable = deliverables.find((d) => d.id === deletingId) ?? null;

  function handleDelete() {
    if (!deletingId) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      try {
        const result = await deleteDeliverable(deletingId);
        if (!result.success) {
          setDeleteError(result.error);
          return;
        }
        setDeletingId(null);
        router.refresh();
      } catch {
        setDeleteError("Something went wrong. Try again.");
      }
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-black/[.02] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Creator</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Stage</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Due date</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Amount</th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {deliverables.map((deliverable) => (
              <tr key={deliverable.id} className="hover:bg-black/[.015]">
                <td className="px-4 py-3">
                  <Link
                    href={`/creators/${deliverable.creator.id}`}
                    className="font-medium hover:text-[var(--accent)] hover:underline"
                  >
                    {deliverable.creator.name}
                  </Link>
                  <div className="text-xs text-[var(--muted)]">{deliverable.creator.handle}</div>
                </td>
                <td className="px-4 py-3">
                  <DeliverableStatusSelect
                    deliverableId={deliverable.id}
                    status={deliverable.status}
                  />
                </td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">
                  {deliverable.dueDate ? DATE.format(deliverable.dueDate) : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {deliverable.amount !== null ? CURRENCY.format(Number(deliverable.amount)) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/deliverables/${deliverable.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-black/[.05] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      Notes
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setDeletingId(deliverable.id);
                      }}
                      className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deletingDeliverable !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Remove deliverable"
        description={`Remove ${
          deletingDeliverable?.creator.name ?? "this creator"
        } from this campaign? This can't be undone.`}
        error={deleteError}
        isPending={isDeleting}
      />
    </>
  );
}
