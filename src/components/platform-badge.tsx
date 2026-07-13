import { PLATFORM_LABELS, type PlatformValue } from "@/lib/validators";

const PLATFORM_CLASSES: Record<PlatformValue, string> = {
  INSTAGRAM: "bg-pink-50 text-pink-700 ring-pink-600/20 dark:bg-pink-950/40 dark:text-pink-300 dark:ring-pink-400/20",
  TIKTOK: "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-800/50 dark:text-slate-300 dark:ring-slate-400/20",
  YOUTUBE: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-400/20",
  TWITTER: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-400/20",
  OTHER: "bg-zinc-100 text-zinc-700 ring-zinc-600/20 dark:bg-zinc-800/50 dark:text-zinc-300 dark:ring-zinc-400/20",
};

export function PlatformBadge({ platform }: { platform: PlatformValue }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${PLATFORM_CLASSES[platform]}`}
    >
      {PLATFORM_LABELS[platform]}
    </span>
  );
}
