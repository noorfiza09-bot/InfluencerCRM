"use client";

import { useState } from "react";
import { DeliverableTable } from "@/components/deliverable-table";
import { DeliverableBoard } from "@/components/deliverable-board";
import type { DeliverableWithCreator } from "@/server/deliverables";

const TAB_BASE =
  "rounded px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2";

export function DeliverableView({ deliverables }: { deliverables: DeliverableWithCreator[] }) {
  const [view, setView] = useState<"table" | "board">("table");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Deliverables view"
        className="mb-3 inline-flex rounded-md border border-[var(--border)] bg-black/[.02] p-0.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === "table"}
          onClick={() => setView("table")}
          className={`${TAB_BASE} ${
            view === "table" ? "bg-white shadow-[var(--shadow-sm)]" : "text-[var(--muted)]"
          }`}
        >
          Table
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "board"}
          onClick={() => setView("board")}
          className={`${TAB_BASE} ${
            view === "board" ? "bg-white shadow-[var(--shadow-sm)]" : "text-[var(--muted)]"
          }`}
        >
          Board
        </button>
      </div>

      {view === "table" ? (
        <DeliverableTable deliverables={deliverables} />
      ) : (
        <DeliverableBoard deliverables={deliverables} />
      )}
    </div>
  );
}
