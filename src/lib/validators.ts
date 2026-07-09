import { z } from "zod";

/**
 * Shared Zod schemas — imported by both client forms and server
 * routes/actions so the browser and the API reject the exact same
 * bad input (see plan.md §2).
 *
 * Day 1 only needs auth schemas. Entity schemas (Creator, Campaign,
 * Deliverable, Note) get added here in Day 2/3 as those features land.
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
