function CardSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <div className="h-6 w-10 animate-pulse rounded bg-black/[.06]" />
      <div className="mt-2 h-3 w-16 animate-pulse rounded bg-black/[.05]" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div>
      <div className="h-7 w-32 animate-pulse rounded bg-black/[.06]" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded bg-black/[.05]" />

      <div className="mt-8">
        <div className="h-4 w-40 animate-pulse rounded bg-black/[.06]" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="h-4 w-44 animate-pulse rounded bg-black/[.06]" />
        <div className="mt-3 h-32 animate-pulse rounded-lg bg-black/[.04]" />
      </div>

      <div className="mt-10">
        <div className="h-4 w-36 animate-pulse rounded bg-black/[.06]" />
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-black/[.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}
