"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CampaignForm } from "@/components/campaign-form";

export function AddCampaignButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        New campaign
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="New campaign">
        <CampaignForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
