import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const STAGES = [
  "Outreach sent",
  "Negotiating",
  "Contracted",
  "Content submitted",
  "Posted",
  "Paid",
];

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="font-display text-base font-semibold tracking-tight">
          Influencer<span className="text-[var(--accent)]">CRM</span>
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--foreground)]/[0.05] hover:text-[var(--foreground)]"
          >
            Log in
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:pt-20">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
          For brand marketers running influencer campaigns
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Every creator relationship.
          <br />
          One pipeline.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-6 text-[var(--muted)]">
          Track outreach, negotiate rates, and get deliverables posted and
          paid — without losing a single thread across a hundred DMs and
          spreadsheets.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--foreground)]/[0.04]"
          >
            View demo
          </Link>
        </div>
      </section>

      {/* Signature element: the actual deliverable pipeline, in order — 
          not a generic feature-grid, the real mechanic this product runs on. */}
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Every deliverable moves through the same six stages
          </p>
          <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            {STAGES.map((stage, i) => (
              <li key={stage} className="flex items-center gap-2">
                <span
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium"
                  style={{
                    borderColor: "var(--accent)",
                    color: i === 0 ? "var(--accent-foreground)" : "var(--accent)",
                    backgroundColor: i === 0 ? "var(--accent)" : "transparent",
                  }}
                >
                  <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                  {stage}
                </span>
                {i < STAGES.length - 1 && (
                  <span aria-hidden className="h-px w-4 bg-[var(--border)] sm:w-6" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
