import Link from "next/link";
import { AddCreatorButton } from "@/components/add-creator-button";

function DirectoryIcon() {
  return (
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="6.5" r="2.5" stroke="var(--accent)" strokeWidth="1.5" />
        <path
          d="M3.5 15c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function CreatorEmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
        <DirectoryIcon />
        <p className="mt-3 text-sm font-medium">No creators match those filters</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Try a different search term or widen your filters.
        </p>
        <Link
          href="/creators"
          className="mt-4 inline-block rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-black/[.03] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <DirectoryIcon />
      <p className="mt-3 text-sm font-medium">No creators yet</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Add the first creator to start building your roster.
      </p>
      <div className="mt-4 flex justify-center">
        <AddCreatorButton />
      </div>
    </div>
  );
}
