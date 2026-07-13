"use client";

import { useState } from "react";
import type { Creator } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DeliverableForm } from "@/components/deliverable-form";

export function AddDeliverableButton({
  campaignId,
  creators,
}: {
  campaignId: string;
  creators: Creator[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add creator to campaign
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add creator to campaign">
        <DeliverableForm
          campaignId={campaignId}
          creators={creators}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
