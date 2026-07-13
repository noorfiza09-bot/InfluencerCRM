export default function CampaignDetailLoading() {
  return (
    <div>
      <div className="h-4 w-32 animate-pulse rounded bg-black/[.06]" />
      <div className="mt-6 h-8 w-56 animate-pulse rounded bg-black/[.06]" />
      <div className="mt-2 h-4 w-40 animate-pulse rounded bg-black/[.05]" />
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[0, 1].map((i) => (
          <div key={i}>
            <div className="h-3 w-16 animate-pulse rounded bg-black/[.05]" />
            <div className="mt-2 h-5 w-20 animate-pulse rounded bg-black/[.06]" />
          </div>
        ))}
      </div>
      <div className="mt-10 h-40 animate-pulse rounded-lg bg-black/[.04]" />
    </div>
  );
}
