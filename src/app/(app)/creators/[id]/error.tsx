"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CreatorDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-dashed border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20 px-6 py-16 text-center">
      <p className="text-sm font-medium text-red-800 dark:text-red-300">Couldn&apos;t load this creator</p>
      <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/70">Something went wrong. This has been logged.</p>
      <div className="mt-4 flex justify-center">
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
