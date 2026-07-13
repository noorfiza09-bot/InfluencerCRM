"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CreatorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Full details are logged server-side via the digest; keep the
    // client-facing message friendly and actionable.
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-dashed border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20 px-6 py-16 text-center">
      <p className="text-sm font-medium text-red-800 dark:text-red-300">Couldn&apos;t load your creators</p>
      <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/70">
        Something went wrong fetching your directory. This has been logged.
      </p>
      <div className="mt-4 flex justify-center">
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
