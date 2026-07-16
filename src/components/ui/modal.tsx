"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="modal-title"
      className="m-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-[var(--border)] bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <h2 id="modal-title" className="text-sm font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded-md p-1 text-[var(--muted)] hover:bg-black/[.05] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          ✕
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </dialog>
  );
}
