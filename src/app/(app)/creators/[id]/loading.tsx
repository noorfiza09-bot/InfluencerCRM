export default function CreatorDetailLoading() {
  return (
    <div>
      <div className="h-4 w-32 animate-pulse rounded bg-[var(--foreground)]/[0.07]" />
      <div className="mt-6 h-8 w-48 animate-pulse rounded bg-[var(--foreground)]/[0.07]" />
      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-[var(--foreground)]/[0.06]" />
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-3 w-16 animate-pulse rounded bg-[var(--foreground)]/[0.06]" />
            <div className="mt-2 h-5 w-20 animate-pulse rounded bg-[var(--foreground)]/[0.07]" />
          </div>
        ))}
      </div>
    </div>
  );
}
