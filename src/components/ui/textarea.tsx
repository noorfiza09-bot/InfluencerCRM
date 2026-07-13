import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none placeholder:text-[var(--muted)] focus-visible:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        {...props}
      />
    );
  }
);
