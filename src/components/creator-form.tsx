"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Creator } from "@prisma/client";
import {
  creatorSchema,
  PLATFORM_LABELS,
  type PlatformValue,
} from "@/lib/validators";
import { createCreator, updateCreator } from "@/server/creators";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";

type FormState = {
  name: string;
  handle: string;
  platform: PlatformValue;
  followers: string;
  email: string;
  niche: string[];
};

const EMPTY_STATE: FormState = {
  name: "",
  handle: "",
  platform: "INSTAGRAM",
  followers: "",
  email: "",
  niche: [],
};

function creatorToFormState(creator: Creator): FormState {
  return {
    name: creator.name,
    handle: creator.handle,
    platform: creator.platform,
    followers: String(creator.followers),
    email: creator.email ?? "",
    niche: creator.niche,
  };
}

export function CreatorForm({
  creator,
  onSuccess,
}: {
  creator?: Creator;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    creator ? creatorToFormState(creator) : EMPTY_STATE
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const candidate = {
      name: form.name,
      handle: form.handle,
      platform: form.platform,
      followers: form.followers,
      email: form.email,
      niche: form.niche,
    };

    const parsed = creatorSchema.safeParse(candidate);
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
        const result = creator
          ? await updateCreator(creator.id, parsed.data)
          : await createCreator(parsed.data);

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
      <Field label="Name" htmlFor="name" error={fieldErrors.name}>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Jordan Rivera"
          required
        />
      </Field>

      <Field label="Handle" htmlFor="handle" error={fieldErrors.handle}>
        <Input
          id="handle"
          value={form.handle}
          onChange={(e) => setForm({ ...form, handle: e.target.value })}
          placeholder="@jordanrivera"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Platform" htmlFor="platform" error={fieldErrors.platform}>
          <Select
            id="platform"
            value={form.platform}
            onChange={(e) =>
              setForm({ ...form, platform: e.target.value as PlatformValue })
            }
          >
            {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Followers" htmlFor="followers" error={fieldErrors.followers}>
          <Input
            id="followers"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.followers}
            onChange={(e) => setForm({ ...form, followers: e.target.value })}
            placeholder="12000"
            required
          />
        </Field>
      </div>

      <Field
        label="Email"
        htmlFor="email"
        error={fieldErrors.email}
        hint="Optional — add it once you have contact info."
      >
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="jordan@creator.com"
        />
      </Field>

      <Field
        label="Niche tags"
        htmlFor="niche"
        error={fieldErrors.niche}
        hint="Press Enter or comma to add a tag."
      >
        <TagInput
          id="niche"
          value={form.niche}
          onChange={(niche) => setForm({ ...form, niche })}
          placeholder="beauty, fitness…"
        />
      </Field>

      {formError && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : creator ? "Save changes" : "Add creator"}
        </Button>
      </div>
    </form>
  );
}
