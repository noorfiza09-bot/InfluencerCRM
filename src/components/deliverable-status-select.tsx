"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { STAGE_LABELS, STAGE_ORDER, type StageValue } from "@/lib/validators";
import { Select } from "@/components/ui/select";
import { moveStage } from "@/server/deliverables";

export function DeliverableStatusSelect({
  deliverableId,
  status,
}: {
  deliverableId: string;
  status: StageValue;
}) {
  const router = useRouter();
  const [optimisticStatus, setOptimisticStatus] = useState<StageValue>(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Keep in sync if the server-rendered prop changes for a reason other
  // than this control's own optimistic update (e.g. router.refresh()
  // after a note is added elsewhere on the page).
  useEffect(() => {
    setOptimisticStatus(status);
  }, [status]);

  function handleChange(newStage: StageValue) {
    if (newStage === optimisticStatus) return;

    const previous = optimisticStatus;
    setError(null);
    setOptimisticStatus(newStage); // optimistic — update immediately, before the request resolves

    startTransition(async () => {
      try {
        const result = await moveStage(deliverableId, newStage);
        if (!result.success) {
          setOptimisticStatus(previous); // rollback
          setError(result.error);
          return;
        }
        router.refresh();
      } catch {
        setOptimisticStatus(previous); // rollback
        setError("Something went wrong. Try again.");
      }
    });
  }

  return (
    <div>
      <Select
        aria-label="Deliverable stage"
        value={optimisticStatus}
        onChange={(e) => handleChange(e.target.value as StageValue)}
        disabled={isPending}
        className="w-full min-w-40"
      >
        {STAGE_ORDER.map((stage) => (
          <option key={stage} value={stage}>
            {STAGE_LABELS[stage]}
          </option>
        ))}
      </Select>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
