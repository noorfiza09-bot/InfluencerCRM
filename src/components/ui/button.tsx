import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 disabled:opacity-60",
  secondary:
    "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.04] disabled:opacity-60",
  ghost: "text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.05] disabled:opacity-60",
  danger: "bg-[var(--danger)] text-[var(--danger-foreground)] hover:opacity-90 disabled:opacity-60",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "primary", className = "", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
});
