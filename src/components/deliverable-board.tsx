"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { STAGE_ORDER, STAGE_LABELS, type StageValue } from "@/lib/validators";
import { CreatorAvatar } from "@/components/creator-avatar";
import { DeliverableStatusSelect } from "@/components/deliverable-status-select";
import { moveStage, type DeliverableWithCreator } from "@/server/deliverables";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="3" cy="2.5" r="1" fill="currentColor" />
      <circle cx="9" cy="2.5" r="1" fill="currentColor" />
      <circle cx="3" cy="6" r="1" fill="currentColor" />
      <circle cx="9" cy="6" r="1" fill="currentColor" />
      <circle cx="3" cy="9.5" r="1" fill="currentColor" />
      <circle cx="9" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}

function DeliverableCard({
  deliverable,
  dragging = false,
}: {
  deliverable: DeliverableWithCreator;
  dragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deliverable.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={`rounded-lg border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)] ${
        isDragging ? "opacity-40" : ""
      } ${dragging ? "rotate-2 shadow-[var(--shadow-md)]" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <CreatorAvatar name={deliverable.creator.name} size="sm" />
          <div className="min-w-0">
            <Link
              href={`/deliverables/${deliverable.id}`}
              className="truncate rounded text-sm font-medium hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
            >
              {deliverable.creator.name}
            </Link>
            <p className="truncate text-xs text-[var(--muted)]">{deliverable.creator.handle}</p>
          </div>
        </div>
        <button
          type="button"
          {...listeners}
          {...attributes}
          aria-label={`Drag ${deliverable.creator.name}'s deliverable to another stage`}
          className="shrink-0 cursor-grab touch-none rounded p-1 text-[var(--muted)] hover:bg-black/[.05] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <GripIcon />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{deliverable.dueDate ? DATE.format(deliverable.dueDate) : "No due date"}</span>
        <span className="font-mono tabular-nums">
          {deliverable.amount !== null ? CURRENCY.format(Number(deliverable.amount)) : "—"}
        </span>
      </div>

      {/* Keyboard-accessible fallback — dragging isn't reliably operable by
          keyboard, so every card also carries the same dropdown the table
          view uses (plan.md §7: "a dropdown is fully keyboard-accessible
          by default"). Both paths call the same moveStage action. */}
      <div className="mt-2">
        <DeliverableStatusSelect deliverableId={deliverable.id} status={deliverable.status} />
      </div>
    </div>
  );
}

function BoardColumn({
  stage,
  deliverables,
}: {
  stage: StageValue;
  deliverables: DeliverableWithCreator[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-lg border p-2 transition-colors ${
        isOver ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-black/[.02]"
      }`}
    >
      <div className="flex items-center justify-between px-1 py-1">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {STAGE_LABELS[stage]}
        </span>
        <span className="text-xs text-[var(--muted)]">{deliverables.length}</span>
      </div>
      <div className="mt-2 flex min-h-16 flex-col gap-2">
        {deliverables.map((deliverable) => (
          <DeliverableCard key={deliverable.id} deliverable={deliverable} />
        ))}
      </div>
    </div>
  );
}

export function DeliverableBoard({ deliverables }: { deliverables: DeliverableWithCreator[] }) {
  const router = useRouter();
  const [items, setItems] = useState(deliverables);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Resync when the server-rendered prop changes — e.g. after any mutation
  // (including a card's own dropdown) triggers router.refresh().
  useEffect(() => {
    setItems(deliverables);
  }, [deliverables]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const deliverableId = active.id as string;
    const newStage = over.id as StageValue;
    const deliverable = items.find((d) => d.id === deliverableId);
    if (!deliverable || deliverable.status === newStage) return;

    const previousStage = deliverable.status;
    setError(null);
    // Optimistic — move the card to its new column immediately.
    setItems((prev) =>
      prev.map((d) => (d.id === deliverableId ? { ...d, status: newStage } : d))
    );

    startTransition(async () => {
      try {
        const result = await moveStage(deliverableId, newStage);
        if (!result.success) {
          setItems((prev) =>
            prev.map((d) => (d.id === deliverableId ? { ...d, status: previousStage } : d))
          );
          setError(result.error);
          return;
        }
        router.refresh();
      } catch {
        setItems((prev) =>
          prev.map((d) => (d.id === deliverableId ? { ...d, status: previousStage } : d))
        );
        setError("Something went wrong. Try again.");
      }
    });
  }

  const activeDeliverable = items.find((d) => d.id === activeId) ?? null;

  return (
    <div>
      {error && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STAGE_ORDER.map((stage) => (
            <BoardColumn
              key={stage}
              stage={stage}
              deliverables={items.filter((d) => d.status === stage)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDeliverable ? <DeliverableCard deliverable={activeDeliverable} dragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
