function SkeletonRow() {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--foreground)]/[0.07]" />
        <div className="mt-1.5 h-3 w-20 animate-pulse rounded bg-[var(--foreground)]/[0.06]" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-20 animate-pulse rounded-full bg-[var(--foreground)]/[0.07]" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-12 animate-pulse rounded bg-[var(--foreground)]/[0.07]" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-24 animate-pulse rounded-full bg-[var(--foreground)]/[0.07]" />
      </td>
      <td className="px-4 py-3" />
    </tr>
  );
}

export default function CreatorsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-28 animate-pulse rounded bg-[var(--foreground)]/[0.07]" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-[var(--foreground)]/[0.06]" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-md bg-[var(--foreground)]/[0.07]" />
      </div>

      <div className="mt-6 flex gap-3">
        <div className="h-9 w-64 animate-pulse rounded-md bg-[var(--foreground)]/[0.07]" />
        <div className="h-9 w-44 animate-pulse rounded-md bg-[var(--foreground)]/[0.07]" />
        <div className="h-9 w-44 animate-pulse rounded-md bg-[var(--foreground)]/[0.07]" />
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--foreground)]/[0.03]">
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
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    </div>
  );
}
