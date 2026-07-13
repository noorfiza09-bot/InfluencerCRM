"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Creator } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CreatorForm } from "@/components/creator-form";
import { deleteCreator } from "@/server/creators";

export function CreatorDetailActions({ creator }: { creator: Creator }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    setDeleteError(null);
    startDeleteTransition(async () => {
      try {
        const result = await deleteCreator(creator.id);
        if (!result.success) {
          setDeleteError(result.error);
          return;
        }
        router.push("/creators");
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

      <Modal open={isEditing} onClose={() => setIsEditing(false)} title="Edit creator">
        <CreatorForm
          creator={creator}
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
        title="Delete creator"
        description={`Remove ${creator.name} from your directory? This won't erase their deliverable history — it just archives them.`}
        error={deleteError}
        isPending={isDeleting}
      />
    </>
  );
}