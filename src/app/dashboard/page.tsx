import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Logged in as {session.user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 rounded-md border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
        Campaign and creator widgets land here in Day 5. This page confirms
        auth + session persistence are working end to end.
      </div>
    </main>
  );
}
