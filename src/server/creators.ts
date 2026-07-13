"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { creatorSchema, type CreatorInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { Creator, Platform } from "@prisma/client";

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

// --- Queries — safe to call from Server Components or Client Components ---

export async function listCreators(params: {
  search?: string;
  platform?: Platform;
  niche?: string;
}): Promise<Creator[]> {
  const userId = await requireUserId();

  return db.creator.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { handle: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(params.platform ? { platform: params.platform } : {}),
      ...(params.niche ? { niche: { has: params.niche } } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }], // stable secondary sort
  });
}

/** Distinct niche tags across the user's directory, for the filter dropdown. */
export async function listNiches(): Promise<string[]> {
  const userId = await requireUserId();
  const creators = await db.creator.findMany({
    where: { userId, deletedAt: null },
    select: { niche: true },
  });
  const set = new Set<string>();
  for (const c of creators) for (const tag of c.niche) set.add(tag);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Unlike listCreators, this intentionally does NOT filter deletedAt —
 *  the detail page needs to load archived creators to show an "archived"
 *  banner (plan.md §5), even though they're hidden from the directory list. */
export async function getCreatorById(id: string): Promise<Creator | null> {
  const userId = await requireUserId();
  return db.creator.findFirst({
    where: { id, userId },
  });
}

/** True count ignoring filters — used to tell "no data yet" apart from "no matches". */
export async function countAllCreators(): Promise<number> {
  const userId = await requireUserId();
  return db.creator.count({ where: { userId, deletedAt: null } });
}

// --- Mutations ---

export async function createCreator(
  input: CreatorInput
): Promise<ActionResult<Creator>> {
  const userId = await requireUserId();
  const parsed = creatorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const creator = await db.creator.create({
    data: { ...parsed.data, userId },
  });

  revalidatePath("/creators");
  return { success: true, data: creator };
}

export async function updateCreator(
  id: string,
  input: CreatorInput
): Promise<ActionResult<Creator>> {
  const userId = await requireUserId();
  const parsed = creatorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // Row-level ownership check — never trust the id alone.
  const existing = await db.creator.findFirst({ where: { id, userId, deletedAt: null } });
  if (!existing) {
    return { success: false, error: "Creator not found" };
  }

  const creator = await db.creator.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/creators");
  revalidatePath(`/creators/${id}`);
  return { success: true, data: creator };
}

export async function deleteCreator(id: string): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUserId();

  const existing = await db.creator.findFirst({ where: { id, userId, deletedAt: null } });
  if (!existing) {
    return { success: false, error: "Creator not found" };
  }

  // Soft delete only — deliverables (Day 3+) keep referencing this creator,
  // the creator detail page shows "archived" (plan.md §5).
  await db.creator.update({ where: { id }, data: { deletedAt: new Date() } });

  revalidatePath("/creators");
  return { success: true, data: { id } };
}
