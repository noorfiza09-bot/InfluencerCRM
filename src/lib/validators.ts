import { z } from "zod";

/**
 * Shared Zod schemas — imported by both client forms and server
 * routes/actions so the browser and the API reject the exact same
 * bad input (see plan.md §2).
 *
 * Note schemas get added here in Day 4 as that feature lands.
 */

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters"), // bcrypt's max input length
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Creator schemas — mirror prisma/schema.prisma's Creator model exactly.
 * Required per plan.md §2: name, handle, platform. Everything else
 * (email, niche) is optional/defaulted by design.
 */

export const platformEnum = z.enum([
  "INSTAGRAM",
  "TIKTOK",
  "YOUTUBE",
  "TWITTER",
  "OTHER",
]);

export type PlatformValue = z.infer<typeof platformEnum>;

export const PLATFORM_LABELS: Record<PlatformValue, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  TWITTER: "X / Twitter",
  OTHER: "Other",
};

const emailOptional = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const creatorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Keep it under 100 characters"),
  handle: z
    .string()
    .trim()
    .min(1, "Handle is required")
    .max(50, "Keep it under 50 characters"),
  platform: platformEnum,
  followers: z.coerce
    .number({ message: "Followers must be a number" })
    .int("Followers must be a whole number")
    .nonnegative("Followers can't be negative")
    .max(2_000_000_000, "That's more followers than any platform has users"),
  email: emailOptional,
  niche: z.array(z.string().trim().min(1).max(30)).max(10, "Up to 10 tags").default([]),
});

export type CreatorInput = z.infer<typeof creatorSchema>;

export const creatorSearchParamsSchema = z.object({
  search: z.string().trim().max(200).optional(),
  platform: platformEnum.optional(),
  niche: z.string().trim().max(30).optional(),
});

export type CreatorSearchParams = z.infer<typeof creatorSearchParamsSchema>;

/**
 * Campaign schemas — mirror prisma/schema.prisma's Campaign model.
 * Required per plan.md §2: name, startDate, endDate. budget is required
 * by the Prisma schema (non-nullable Decimal), so it's required here too.
 */

export const campaignSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100, "Keep it under 100 characters"),
    startDate: z.coerce.date({ message: "Start date is required" }),
    endDate: z.coerce.date({ message: "End date is required" }),
    budget: z.coerce
      .number({ message: "Budget must be a number" })
      .nonnegative("Budget can't be negative")
      .max(100_000_000, "That budget looks off — double check it"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date can't be before the start date",
    path: ["endDate"],
  });

export type CampaignInput = z.infer<typeof campaignSchema>;

/**
 * Deliverable schemas — attaches a Creator to a Campaign. status defaults
 * to OUTREACH_SENT server-side (plan.md §1), so it's not part of the
 * create input; moveStage (Day 4) handles status transitions separately.
 */

export const stageEnum = z.enum([
  "OUTREACH_SENT",
  "NEGOTIATING",
  "CONTRACTED",
  "CONTENT_SUBMITTED",
  "POSTED",
  "PAID",
]);

export type StageValue = z.infer<typeof stageEnum>;

export const STAGE_LABELS: Record<StageValue, string> = {
  OUTREACH_SENT: "Outreach sent",
  NEGOTIATING: "Negotiating",
  CONTRACTED: "Contracted",
  CONTENT_SUBMITTED: "Content submitted",
  POSTED: "Posted",
  PAID: "Paid",
};

// Order matters for the "grouped/sortable by stage" table (plan.md §7).
export const STAGE_ORDER: StageValue[] = [
  "OUTREACH_SENT",
  "NEGOTIATING",
  "CONTRACTED",
  "CONTENT_SUBMITTED",
  "POSTED",
  "PAID",
];

// preprocess first so these schemas are idempotent — safe to validate raw
// form input (strings) AND already-parsed output (Date/number), since the
// server action re-validates the same data the client already parsed.
const amountOptional = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? undefined : v),
  z.coerce
    .number({ message: "Amount must be a number" })
    .nonnegative("Amount can't be negative")
    .max(10_000_000, "That amount looks off — double check it")
    .optional()
);

const dueDateOptional = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? undefined : v),
  z.coerce.date({ message: "Enter a valid date" }).optional()
);

export const deliverableSchema = z.object({
  creatorId: z.string().trim().min(1, "Pick a creator"),
  campaignId: z.string().trim().min(1, "Campaign is required"),
  dueDate: dueDateOptional,
  amount: amountOptional,
});

export type DeliverableInput = z.infer<typeof deliverableSchema>;

/**
 * Note schemas — a dated note attached to a Deliverable (plan.md §1).
 * body is the only user-entered field; deliverableId is passed separately
 * by the caller and included here so the server action validates both
 * with one schema, same pattern as the rest of this file.
 */

export const noteSchema = z.object({
  deliverableId: z.string().trim().min(1, "Deliverable is required"),
  body: z
    .string()
    .trim()
    .min(1, "Note can't be empty")
    .max(2000, "Keep it under 2000 characters"),
});

export type NoteInput = z.infer<typeof noteSchema>;
