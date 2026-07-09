import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">InfluencerCRM</h1>
        <p className="max-w-md text-base leading-6 text-[var(--muted)]">
          Manage creator relationships and campaign deliverables end-to-end
          for brand marketers running influencer campaigns.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.03]"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
