"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Note } from "@prisma/client";
import { noteSchema } from "@/lib/validators";
import { addNote } from "@/server/notes";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const DATE_TIME = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function NoteTimeline({
  deliverableId,
  notes,
}: {
  deliverableId: string;
  notes: Note[];
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // notes arrives newest-first from getDeliverableById (orderBy createdAt desc);
  // sort defensively here too so this component is correct even if a future
  // caller passes an unsorted list.
  const sorted = [...notes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = noteSchema.safeParse({ deliverableId, body });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      try {
        const result = await addNote(deliverableId, parsed.data.body);
        if (!result.success) {
          setError(result.error);
          return;
        }
        setBody("");
        router.refresh();
      } catch {
        setError("Something went wrong. Try again.");
      }
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          aria-label="Add a note"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Replied 6/12, wants $800 instead of $500…"
          rows={3}
          disabled={isPending}
        />
        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding…" : "Add note"}
          </Button>
        </div>
      </form>

      <ol className="mt-6 space-y-3">
        {sorted.length === 0 ? (
          <li className="rounded-md border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
            No notes yet — log a call, an email reply, or a negotiation update.
          </li>
        ) : (
          sorted.map((note) => (
            <li key={note.id} className="rounded-md border border-[var(--border)] p-3">
              <p className="whitespace-pre-wrap text-sm">{note.body}</p>
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                {DATE_TIME.format(note.createdAt)}
              </p>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
