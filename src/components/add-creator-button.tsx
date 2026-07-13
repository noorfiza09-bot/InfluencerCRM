"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CreatorForm } from "@/components/creator-form";

export function AddCreatorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add creator
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add creator">
        <CreatorForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}