import Link from "next/link";
import { AddCreatorButton } from "@/components/add-creator-button";

export function CreatorEmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
        <p className="text-sm font-medium">No creators match those filters</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Try a different search term or widen your filters.
        </p>
        <Link
          href="/creators"
          className="mt-4 inline-block rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--foreground)]/[0.04]"
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <p className="text-sm font-medium">No creators yet</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Add the first creator to start building your roster.
      </p>
      <div className="mt-4 flex justify-center">
        <AddCreatorButton />
      </div>
    </div>
  );
}
