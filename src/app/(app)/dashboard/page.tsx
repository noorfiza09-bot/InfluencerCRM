import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Logged in as {session?.user.email}
      </p>

      <div className="mt-10 rounded-md border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
        Campaign summary cards and stage counts land here in Day 5.{" "}
        <Link href="/creators" className="font-medium text-[var(--accent)]">
          Manage your creator directory →
        </Link>
      </div>
    </div>
  );
}
