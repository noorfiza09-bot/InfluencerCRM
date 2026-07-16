"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Creator } from "@prisma/client";
import { PlatformBadge } from "@/components/platform-badge";
import { CreatorAvatar } from "@/components/creator-avatar";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CreatorForm } from "@/components/creator-form";
import { deleteCreator } from "@/server/creators";

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function CreatorList({ creators }: { creators: Creator[] }) {
  const router = useRouter();
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [deletingCreator, setDeletingCreator] = useState<Creator | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    if (!deletingCreator) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      try {
        const result = await deleteCreator(deletingCreator.id);
        if (!result.success) {
          setDeleteError(result.error);
          return;
        }
        setDeletingCreator(null);
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
              <th scope="col" className="px-4 py-2.5 font-medium">Name</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Platform</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Followers</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Niche</th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {creators.map((creator) => (
              <tr key={creator.id} className="hover:bg-black/[.015]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CreatorAvatar name={creator.name} size="sm" />
                    <div>
                      <Link
                        href={`/creators/${creator.id}`}
                        className="rounded font-medium hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                      >
                        {creator.name}
                      </Link>
                      <div className="text-xs text-[var(--muted)]">{creator.handle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PlatformBadge platform={creator.platform} />
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {formatFollowers(creator.followers)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {creator.niche.length === 0 ? (
                      <span className="text-xs text-[var(--muted)]">—</span>
                    ) : (
                      creator.niche.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-black/[.05] px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingCreator(creator)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-black/[.05] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setDeletingCreator(creator);
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
        open={editingCreator !== null}
        onClose={() => setEditingCreator(null)}
        title="Edit creator"
      >
        {editingCreator && (
          <CreatorForm creator={editingCreator} onSuccess={() => setEditingCreator(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={deletingCreator !== null}
        onClose={() => setDeletingCreator(null)}
        onConfirm={handleDelete}
        title="Delete creator"
        description={`Remove ${
          deletingCreator?.name ?? "this creator"
        } from your directory? This won't erase their deliverable history — it just archives them.`}
        error={deleteError}
        isPending={isDeleting}
      />
    </>
  );
}
