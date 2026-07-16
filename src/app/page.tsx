import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreatorAvatar } from "@/components/creator-avatar";

export const metadata: Metadata = {
  title: "InfluencerCRM — Manage creator campaigns end-to-end",
  robots: { index: true, follow: true },
};

const STAGES = [
  { label: "Outreach sent", classes: "bg-zinc-800 text-white" },
  { label: "Negotiating", classes: "bg-amber-500 text-amber-950" },
  { label: "Contracted", classes: "bg-blue-600 text-white" },
  { label: "Content submitted", classes: "bg-violet-600 text-white" },
  { label: "Posted", classes: "bg-emerald-500 text-emerald-950" },
  { label: "Paid", classes: "bg-[var(--accent)] text-[var(--accent-foreground)]" },
];

const TRACKS = [
  {
    name: "Creators",
    detail:
      "Name, handle, platform, follower count, niche tags. One directory, filterable by platform and niche.",
  },
  {
    name: "Campaigns",
    detail: "Name, dates, budget. Deliverable counts and status at a glance.",
  },
  {
    name: "Deliverables",
    detail:
      "Attach a creator to a campaign, then move it through six stages — backward or forward. Real negotiations aren't linear.",
  },
  {
    name: "Notes",
    detail:
      '"Replied 6/12, wants $800 instead of $500." A dated note on every deliverable, right where you need it.',
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="font-display text-sm font-semibold tracking-tight">
          InfluencerCRM
        </span>
        <Link
          href="/login"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
        >
          Log in
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:pt-16">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animate-fade-up">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              For brand marketers running influencer campaigns
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Run the whole deal.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[var(--muted)]">
              Track every creator relationship and campaign deliverable
              end-to-end — outreach, negotiation, content, and payment — in
              one rundown.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.03] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Signature element: the real six-stage deal pipeline, in the
              product's actual stage colors (see stage-badge.tsx) — this is
              the app's real mechanic, not a decorative graphic. */}
          <div
            className="animate-fade-up rounded-xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]"
            style={{ animationDelay: "120ms" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
                The rundown
              </p>
              <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[var(--accent)]" />
                Live
              </span>
            </div>

            <ol className="mt-4 flex flex-col gap-1.5">
              {STAGES.map((stage, i) => (
                <li key={stage.label} className="flex items-center gap-2">
                  <span
                    className={`flex-1 rounded-md px-3 py-2 text-xs font-medium ${stage.classes} ${
                      i === 1 ? "ring-2 ring-[var(--accent)] ring-offset-2" : ""
                    }`}
                  >
                    {stage.label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex items-center gap-2.5 border-t border-[var(--border)] pt-3">
              <CreatorAvatar name="Priya Malhotra" size="sm" />
              <p className="text-xs leading-5 text-[var(--muted)]">
                <span className="font-medium text-[var(--foreground)]">
                  Priya Malhotra × Diwali Skincare Bundle
                </span>{" "}
                — negotiating a rate.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-24 border-t border-[var(--border)] pt-14">
          <h2 className="text-xl font-semibold tracking-tight">
            Everything a deal touches, in one place
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {TRACKS.map((track) => (
              <div key={track.name}>
                <h3 className="text-base font-semibold">{track.name}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                  {track.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] px-4 py-6">
        <p className="mx-auto max-w-5xl text-xs text-[var(--muted)]">
          Built for brand marketers running influencer campaigns.
        </p>
      </footer>
    </div>
  );
}
