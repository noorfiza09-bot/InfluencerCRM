"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { noteSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { Note } from "@prisma/client";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }
  return session.user.id;
}

// --- Mutations ---

export async function addNote(
  deliverableId: string,
  body: string
): Promise<ActionResult<Note>> {
  const userId = await requireUserId();
  const parsed = noteSchema.safeParse({ deliverableId, body });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // Note has no direct userId column — ownership flows through
  // Deliverable -> Campaign -> userId, same pattern as deleteDeliverable.
  const deliverable = await db.deliverable.findFirst({
    where: { id: parsed.data.deliverableId, campaign: { userId } },
    select: { id: true, campaignId: true },
  });
  if (!deliverable) {
    return { success: false, error: "Deliverable not found" };
  }

  const note = await db.note.create({
    data: { deliverableId: deliverable.id, body: parsed.data.body },
  });

  revalidatePath(`/deliverables/${deliverable.id}`);
  revalidatePath(`/campaigns/${deliverable.campaignId}`);
  return { success: true, data: note };
}
