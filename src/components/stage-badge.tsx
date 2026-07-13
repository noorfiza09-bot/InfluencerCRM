import { STAGE_LABELS, type StageValue } from "@/lib/validators";

const STAGE_CLASSES: Record<StageValue, string> = {
  OUTREACH_SENT: "bg-zinc-100 text-zinc-700 ring-zinc-600/20",
  NEGOTIATING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CONTRACTED: "bg-blue-50 text-blue-700 ring-blue-600/20",
  CONTENT_SUBMITTED: "bg-violet-50 text-violet-700 ring-violet-600/20",
  POSTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PAID: "bg-green-100 text-green-800 ring-green-700/20",
};

export function StageBadge({ stage }: { stage: StageValue }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STAGE_CLASSES[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
