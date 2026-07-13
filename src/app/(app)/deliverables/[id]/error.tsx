"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DeliverableDetailError({
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
    <div className="rounded-lg border border-dashed border-red-200 bg-red-50/50 px-6 py-16 text-center">
      <p className="text-sm font-medium text-red-800">Couldn&apos;t load this deliverable</p>
      <p className="mt-1 text-sm text-red-700/80">Something went wrong. This has been logged.</p>
      <div className="mt-4 flex justify-center">
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
