"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Campaign } from "@prisma/client";
import { campaignSchema } from "@/lib/validators";
import { createCampaign, updateCampaign } from "@/server/campaigns";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormState = {
  name: string;
  startDate: string;
  endDate: string;
  budget: string;
};

const EMPTY_STATE: FormState = {
  name: "",
  startDate: "",
  endDate: "",
  budget: "",
};

function toDateInputValue(d: Date): string {
  // yyyy-mm-dd for <input type="date">, in local time not UTC.
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

function campaignToFormState(campaign: Campaign): FormState {
  return {
    name: campaign.name,
    startDate: toDateInputValue(campaign.startDate),
    endDate: toDateInputValue(campaign.endDate),
    budget: String(campaign.budget),
  };
}

export function CampaignForm({
  campaign,
  onSuccess,
}: {
  campaign?: Campaign;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    campaign ? campaignToFormState(campaign) : EMPTY_STATE
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = campaignSchema.safeParse({
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: form.budget,
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
        const result = campaign
          ? await updateCampaign(campaign.id, parsed.data)
          : await createCampaign(parsed.data);

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
      <Field label="Campaign name" htmlFor="name" error={fieldErrors.name}>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Summer Skincare Launch"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date" htmlFor="startDate" error={fieldErrors.startDate}>
          <Input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
        </Field>

        <Field label="End date" htmlFor="endDate" error={fieldErrors.endDate}>
          <Input
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
          />
        </Field>
      </div>

      <Field
        label="Budget"
        htmlFor="budget"
        error={fieldErrors.budget}
        hint="USD only for v1 (plan.md §6)."
      >
        <Input
          id="budget"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          placeholder="5000"
          required
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
          {isPending ? "Saving…" : campaign ? "Save changes" : "Create campaign"}
        </Button>
      </div>
    </form>
  );
}
