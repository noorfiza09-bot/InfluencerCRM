"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { CreatorAvatar } from "@/components/creator-avatar";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/creators", label: "Creators" },
  { href: "/campaigns", label: "Campaigns" },
];

const LINK_FOCUS = "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2";

export function AppNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile menu on navigation, so it doesn't stay open after
  // a link is followed.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`rounded font-display text-sm font-semibold tracking-tight ${LINK_FOCUS}`}
          >
            InfluencerCRM
          </Link>

          {/* Desktop nav — hidden below sm, where it wouldn't fit alongside
              the logo and account controls (plan.md Day 6: responsive to 375px). */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${LINK_FOCUS} ${
                  isActive(link.href)
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "text-[var(--muted)] hover:bg-black/[.04] hover:text-[var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <CreatorAvatar name={email} size="sm" />
            <span className="text-sm text-[var(--muted)]">{email}</span>
          </div>
          <LogoutButton />

          {/* Mobile menu toggle — shown only below sm. */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className={`rounded-md p-2 text-[var(--foreground)] hover:bg-black/[.04] sm:hidden ${LINK_FOCUS}`}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 3.5H17M1 9H17M1 14.5H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-[var(--border)] px-4 py-2 sm:hidden"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${LINK_FOCUS} ${
                    isActive(link.href)
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "text-[var(--muted)] hover:bg-black/[.04] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-2 px-3">
            <CreatorAvatar name={email} size="sm" />
            <p className="text-xs text-[var(--muted)]">{email}</p>
          </div>
        </nav>
      )}
    </header>
  );
}
