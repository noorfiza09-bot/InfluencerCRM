"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { campaignSchema, type CampaignInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { Campaign } from "@prisma/client";

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

export type CampaignWithCount = Campaign & { _count: { deliverables: number } };

// --- Queries — safe to call from Server Components or Client Components ---

export async function listCampaigns(): Promise<CampaignWithCount[]> {
  const userId = await requireUserId();

  return db.campaign.findMany({
    where: { userId, deletedAt: null },
    include: { _count: { select: { deliverables: true } } },
    orderBy: [{ startDate: "desc" }, { id: "asc" }], // stable secondary sort
  });
}

/** Unlike listCampaigns, this intentionally does NOT filter deletedAt —
 *  a deliverable's campaign may be archived; the detail page still needs
 *  to render it (mirrors getCreatorById's behavior, plan.md §5). */
export async function getCampaignById(id: string): Promise<Campaign | null> {
  const userId = await requireUserId();
  return db.campaign.findFirst({
    where: { id, userId },
  });
}

/** True count ignoring filters — used to tell "no data yet" apart from "no matches". */
export async function countAllCampaigns(): Promise<number> {
  const userId = await requireUserId();
  return db.campaign.count({ where: { userId, deletedAt: null } });
}

// --- Mutations ---

export async function createCampaign(
  input: CampaignInput
): Promise<ActionResult<Campaign>> {
  const userId = await requireUserId();
  const parsed = campaignSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const campaign = await db.campaign.create({
    data: { ...parsed.data, userId },
  });

  revalidatePath("/campaigns");
  revalidatePath("/dashboard");
  return { success: true, data: campaign };
}

export async function updateCampaign(
  id: string,
  input: CampaignInput
): Promise<ActionResult<Campaign>> {
  const userId = await requireUserId();
  const parsed = campaignSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // Row-level ownership check — never trust the id alone.
  const existing = await db.campaign.findFirst({ where: { id, userId, deletedAt: null } });
  if (!existing) {
    return { success: false, error: "Campaign not found" };
  }

  const campaign = await db.campaign.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  revalidatePath("/dashboard");
  return { success: true, data: campaign };
}

export async function deleteCampaign(id: string): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUserId();

  const existing = await db.campaign.findFirst({ where: { id, userId, deletedAt: null } });
  if (!existing) {
    return { success: false, error: "Campaign not found" };
  }

  // Soft delete only, consistent with Creator (plan.md §5) — deliverables
  // keep referencing the (now hidden) campaign rather than cascading.
  await db.campaign.update({ where: { id }, data: { deletedAt: new Date() } });

  revalidatePath("/campaigns");
  revalidatePath("/dashboard");
  return { success: true, data: { id } };
}
