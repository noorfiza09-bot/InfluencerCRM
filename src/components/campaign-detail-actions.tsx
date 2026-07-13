"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Campaign } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CampaignForm } from "@/components/campaign-form";
import { deleteCampaign } from "@/server/campaigns";

export function CampaignDetailActions({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    setDeleteError(null);
    startDeleteTransition(async () => {
      try {
        const result = await deleteCampaign(campaign.id);
        if (!result.success) {
          setDeleteError(result.error);
          return;
        }
        router.push("/campaigns");
        router.refresh();
      } catch {
        setDeleteError("Something went wrong. Try again.");
      }
    });
  }

  return (
    <>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            setDeleteError(null);
            setIsConfirmingDelete(true);
          }}
        >
          Delete
        </Button>
      </div>

      <Modal open={isEditing} onClose={() => setIsEditing(false)} title="Edit campaign">
        <CampaignForm
          campaign={campaign}
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }}
        />
      </Modal>

      <ConfirmDialog
        open={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={handleDelete}
        title="Delete campaign"
        description={`Remove ${campaign.name}? Its deliverables won't be erased — the campaign is archived, not deleted.`}
        error={deleteError}
        isPending={isDeleting}
      />
    </>
  );
}
