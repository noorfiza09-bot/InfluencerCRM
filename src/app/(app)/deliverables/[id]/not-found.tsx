import Link from "next/link";

export default function DeliverableNotFound() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <p className="text-sm font-medium">Deliverable not found</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        It may have been removed, or the link is incorrect.
      </p>
      <Link
        href="/campaigns"
        className="mt-4 inline-block rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-black/[.03]"
      >
        Back to campaigns
      </Link>
    </div>
  );
}
