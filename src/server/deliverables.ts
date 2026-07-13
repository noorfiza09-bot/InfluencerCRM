"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  deliverableSchema,
  stageEnum,
  type DeliverableInput,
  type StageValue,
} from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { Deliverable, Creator, Campaign, Note } from "@prisma/client";

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

export type DeliverableWithCreator = Deliverable & { creator: Creator };
export type DeliverableWithCampaign = Deliverable & { campaign: Campaign };
export type DeliverableWithRelations = Deliverable & {
  creator: Creator;
  campaign: Campaign;
  notes: Note[];
};

// --- Queries — safe to call from Server Components or Client Components ---

/** Deliverables for a single campaign, for the campaign detail table (plan.md §7).
 *  Ordered by stage per the "grouped/sortable by stage" requirement. */
export async function listDeliverablesByCampaign(
  campaignId: string
): Promise<DeliverableWithCreator[]> {
  const userId = await requireUserId();

  const campaign = await db.campaign.findFirst({ where: { id: campaignId, userId } });
  if (!campaign) return [];

  const deliverables = await db.deliverable.findMany({
    where: { campaignId },
    include: { creator: true },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const stageIndex = Object.fromEntries(stageEnum.options.map((s, i) => [s, i]));
  return deliverables.sort((a, b) => stageIndex[a.status] - stageIndex[b.status]);
}

/** Deliverable history for a creator's detail page. */
export async function listDeliverablesByCreator(
  creatorId: string
): Promise<DeliverableWithCampaign[]> {
  const userId = await requireUserId();

  const creator = await db.creator.findFirst({ where: { id: creatorId, userId } });
  if (!creator) return [];

  return db.deliverable.findMany({
    where: { creatorId },
    include: { campaign: true },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });
}

/** Single deliverable with everything the detail page needs: creator,
 *  campaign, and notes newest-first (plan.md §1 — "add + list, newest first"). */
export async function getDeliverableById(id: string): Promise<DeliverableWithRelations | null> {
  const userId = await requireUserId();

  return db.deliverable.findFirst({
    where: { id, campaign: { userId } },
    include: {
      creator: true,
      campaign: true,
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
}

// --- Mutations ---

export async function createDeliverable(
  input: DeliverableInput
): Promise<ActionResult<Deliverable>> {
  const userId = await requireUserId();
  const parsed = deliverableSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { creatorId, campaignId, dueDate, amount } = parsed.data;

  // Both sides must belong to this user and not be archived — never trust
  // client-supplied ids alone (plan.md §4).
  const [creator, campaign] = await Promise.all([
    db.creator.findFirst({ where: { id: creatorId, userId, deletedAt: null } }),
    db.campaign.findFirst({ where: { id: campaignId, userId, deletedAt: null } }),
  ]);
  if (!creator) {
    return { success: false, error: "Creator not found" };
  }
  if (!campaign) {
    return { success: false, error: "Campaign not found" };
  }

  // Two deliverables for the same creator+campaign pair are allowed
  // (plan.md §5 — a creator might do two separate posts in one campaign),
  // so no uniqueness check here.
  const deliverable = await db.deliverable.create({
    data: {
      creatorId,
      campaignId,
      dueDate,
      amount,
      // status defaults to OUTREACH_SENT via the Prisma schema (plan.md §1).
    },
  });

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/creators/${creatorId}`);
  revalidatePath("/dashboard");
  return { success: true, data: deliverable };
}

export async function deleteDeliverable(id: string): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUserId();

  // Deliverable has no direct userId column — ownership flows through campaign.
  const existing = await db.deliverable.findFirst({
    where: { id, campaign: { userId } },
    select: { id: true, campaignId: true, creatorId: true },
  });
  if (!existing) {
    return { success: false, error: "Deliverable not found" };
  }

  // No deletedAt on Deliverable in the schema — this is a hard delete.
  // Notes (Day 4) cascade at the DB level via onDelete if configured;
  // otherwise delete them first here before removing the deliverable.
  await db.deliverable.delete({ where: { id } });

  revalidatePath(`/campaigns/${existing.campaignId}`);
  revalidatePath(`/creators/${existing.creatorId}`);
  revalidatePath("/dashboard");
  return { success: true, data: { id } };
}

/** Moves a deliverable to a new stage. Backward moves are allowed on purpose
 *  (plan.md §5 — real workflows aren't strictly linear). Wired up to the
 *  status dropdown with optimistic UI in Day 4. */
export async function moveStage(
  deliverableId: string,
  newStage: StageValue
): Promise<ActionResult<Deliverable>> {
  const userId = await requireUserId();

  const parsedStage = stageEnum.safeParse(newStage);
  if (!parsedStage.success) {
    return { success: false, error: "Invalid stage" };
  }

  const existing = await db.deliverable.findFirst({
    where: { id: deliverableId, campaign: { userId } },
  });
  if (!existing) {
    return { success: false, error: "Deliverable not found" };
  }

  const deliverable = await db.deliverable.update({
    where: { id: deliverableId },
    data: { status: parsedStage.data },
  });

  revalidatePath(`/campaigns/${existing.campaignId}`);
  revalidatePath(`/creators/${existing.creatorId}`);
  revalidatePath(`/deliverables/${deliverableId}`);
  revalidatePath("/dashboard");
  return { success: true, data: deliverable };
}
