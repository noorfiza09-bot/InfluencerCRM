import Link from "next/link";

export default function CreatorNotFound() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <p className="text-sm font-medium">Creator not found</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        It may have been removed, or the link is incorrect.
      </p>
      <Link
        href="/creators"
        className="mt-4 inline-block rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--foreground)]/[0.04]"
      >
        Back to creators
      </Link>
    </div>
  );
}
