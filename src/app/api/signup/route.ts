import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validators";

const BCRYPT_COST = 12; // handbook baseline: bcrypt cost >= 12

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // Deliberately vague — don't confirm/deny which emails are registered.
    return NextResponse.json(
      { error: "Could not create account with those details" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

  const user = await db.user.create({
    data: { email, password: hashedPassword },
    select: { id: true, email: true, createdAt: true }, // never return the hash
  });

  return NextResponse.json({ user }, { status: 201 });
}
