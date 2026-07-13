"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Creator } from "@prisma/client";
import { deliverableSchema } from "@/lib/validators";
import { createDeliverable } from "@/server/deliverables";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type FormState = {
  creatorId: string;
  dueDate: string;
  amount: string;
};

export function DeliverableForm({
  campaignId,
  creators,
  onSuccess,
}: {
  campaignId: string;
  creators: Creator[];
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    creatorId: creators[0]?.id ?? "",
    dueDate: "",
    amount: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (creators.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Your creator directory is empty. Add a creator first, then come back to attach them
        to this campaign.
      </p>
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = deliverableSchema.safeParse({
      creatorId: form.creatorId,
      campaignId,
      dueDate: form.dueDate,
      amount: form.amount,
    });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      try {
        const result = await createDeliverable(parsed.data);

        if (!result.success) {
          setFormError(result.error);
          return;
        }

        router.refresh();
        onSuccess();
      } catch {
        setFormError("Something went wrong. Try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Creator" htmlFor="creatorId" error={fieldErrors.creatorId}>
        <Select
          id="creatorId"
          value={form.creatorId}
          onChange={(e) => setForm({ ...form, creatorId: e.target.value })}
          required
        >
          {creators.map((creator) => (
            <option key={creator.id} value={creator.id}>
              {creator.name} ({creator.handle})
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Due date"
        htmlFor="dueDate"
        error={fieldErrors.dueDate}
        hint="Optional — set once you agree on a content date."
      >
        <Input
          id="dueDate"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
      </Field>

      <Field
        label="Amount"
        htmlFor="amount"
        error={fieldErrors.amount}
        hint="Optional — the agreed payout for this deliverable, USD."
      >
        <Input
          id="amount"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="500"
        />
      </Field>

      {formError && (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding…" : "Add deliverable"}
        </Button>
      </div>
    </form>
  );
}
