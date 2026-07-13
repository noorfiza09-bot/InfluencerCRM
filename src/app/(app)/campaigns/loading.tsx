function SkeletonRow() {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="h-4 w-40 animate-pulse rounded bg-black/[.06]" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-32 animate-pulse rounded bg-black/[.05]" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 animate-pulse rounded bg-black/[.06]" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-10 animate-pulse rounded bg-black/[.06]" />
      </td>
      <td className="px-4 py-3" />
    </tr>
  );
}

export default function CampaignsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-32 animate-pulse rounded bg-black/[.06]" />
          <div className="mt-2 h-4 w-36 animate-pulse rounded bg-black/[.05]" />
        </div>
        <div className="h-9 w-36 animate-pulse rounded-md bg-black/[.06]" />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-black/[.02]">
            <tr>
              <th className="px-4 py-2.5" />
              <th className="px-4 py-2.5" />
              <th className="px-4 py-2.5" />
              <th className="px-4 py-2.5" />
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    </div>
  );
}
