# InfluencerCRM

> Manages creator relationships and campaign deliverables end-to-end for brand marketers running influencer campaigns.

Built for the Digital Heroes Full Stack Developer Trial. See [`plan.md`](./plan.md) for the full spec.

**Status: Day 6 of 7 — polish, SEO, and production deploy complete.** Demo video and case study land Day 7 per the plan.

## Screenshots

<!--
  Add real screenshots before submitting — these placeholders won't render
  until you do. Easiest path: run `npm run dev`, open each route below,
  save a screenshot into a `screenshots/` folder at the repo root, and
  point these links at the actual filenames.
-->

| Dashboard | Creator directory |
| --- | --- |
| ![Dashboard](./screenshots/dashboard.png) | ![Creators](./screenshots/creators.png) |

| Campaign detail (deliverables table) | Deliverable detail (stage control + notes) |
| --- | --- |
| ![Campaign detail](./screenshots/campaign-detail.png) | ![Deliverable detail](./screenshots/deliverable-detail.png) |

## Features (Day 1-6)

- Email + password signup and login (Auth.js / NextAuth v5, JWT sessions)
- Passwords hashed with bcrypt (cost 12), never stored or returned in plaintext
- Session-gated routes enforced server-side in `src/proxy.ts` — not just hidden client-side
- Prisma schema modeling Users, Creators, Campaigns, Deliverables, Notes
- Shared Zod validation (`src/lib/validators.ts`) used by both forms and server actions
- Creator directory: create/edit/delete (soft delete), server-side search (debounced 300ms) and filter by platform + niche, all mirrored into the URL query string
- Campaigns: create/edit/delete (soft delete), with a deliverable-count summary per campaign
- Deliverables: attach a creator to a campaign (defaults to Outreach sent), table view grouped by stage (plan.md §7), remove a deliverable
- **Kanban board (plan.md §7 stretch goal)**: campaign detail page has a Table/Board toggle — the board is drag-and-drop between stage columns, calling the exact same `moveStage` action as the table's dropdown, with optimistic reordering and rollback on failure. Every card also carries the same dropdown as a keyboard-accessible fallback, since drag-and-drop alone isn't reliably keyboard-operable.
- Deliverable detail page: interactive stage dropdown with optimistic UI and rollback on failure, notes timeline (add + list, newest first, timestamped)
- Dashboard: deliverable counts by stage across all campaigns, upcoming due dates (next 7 days), active campaign summary cards with a derived Upcoming/Active/Ended status
- Deliverable history surfaced on the creator detail page and campaign detail page
- Every async view covers loading (skeleton), empty (two variants — no data vs. no matches), error (with retry), and success states
- Row-level authorization on every mutation — creators/campaigns are scoped to `userId`; deliverables and notes are scoped via their owning campaign, never trusted from the client
- TypeScript strict mode, zero `any`, ESLint clean
- Responsive down to 375px: table sections scroll horizontally instead of squashing, primary nav collapses into a keyboard-accessible mobile menu below `sm`
- Every interactive link and control has a visible `focus-visible` ring, not just `:hover` — verified by tabbing through each page
- Metadata: per-page titles via a title template, Open Graph + Twitter card metadata, a dynamically generated OG image (`src/app/opengraph-image.tsx`), `sitemap.xml` and `robots.txt` (public marketing pages indexable, the session-gated app disallowed)

## Tech Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · PostgreSQL · Prisma · Auth.js (NextAuth v5) · Zod · bcryptjs

## Quick Start

```bash
git clone https://github.com/<you>/influencer-crm && cd influencer-crm
cp .env.example .env        # then fill in DATABASE_URL and AUTH_SECRET
npm install                 # also runs `prisma generate` via postinstall
npm run db:migrate          # creates tables from prisma/schema.prisma
npm run db:seed             # creates the demo login + 15 demo creators (demo@demo.com / demo1234)
npm run dev                 # http://localhost:3000
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Supabase or Neon — either works, see plan.md section 9) |
| `AUTH_SECRET` | Session signing secret. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of the deployment (`http://localhost:3000` locally, your Vercel URL in production) |

## Database Setup (Supabase or Neon)

1. Create a free Postgres project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Copy the connection string into `DATABASE_URL` in `.env` (use the pooled/transaction-mode URI if offered — Vercel's serverless functions need pooling).
3. Run `npm run db:migrate` locally to create the tables and generate the first migration file (commit the generated `prisma/migrations/` folder).
4. On Vercel, add the same env vars under **Settings -> Environment Variables**, then run `npm run db:deploy` (applies committed migrations) against production.

> **Note on Prisma 7:** this project uses Prisma 7, which moved the database connection out of `schema.prisma` and into [`prisma.config.ts`](./prisma.config.ts), and now requires an explicit driver adapter (`@prisma/adapter-pg`) instead of connecting internally — see `src/lib/db.ts` and `prisma/seed.ts`. `DATABASE_URL` must be set in `.env` before running *any* `prisma` command, including `prisma generate`.

## Demo Login

Once seeded: `demo@demo.com` / `demo1234`

## Manual QA Checklist (Day 6)

Loading/empty/error/success states and accessibility can't be verified by reading code — walk through this by hand against your production deploy before recording the Day 7 demo:

**Every async view — all four states**
- [ ] Creators: loading skeleton on first paint, empty state with "Add your first creator" (fresh account or clear seed data), empty state with "clear filters" (search a nonsense term), populated list, error state (temporarily rename `DATABASE_URL` locally and hit the page)
- [ ] Campaigns: same four states as creators
- [ ] Campaign detail: "Add a creator to this campaign" empty state, populated deliverables table, not-found page (visit a random/garbage id)
- [ ] Deliverable detail: notes empty state, populated notes timeline, not-found page
- [ ] Dashboard: zero-data state on a fresh account, populated state with seeded data

**Responsive (375px)**
- [ ] Chrome DevTools → device toolbar → iPhone SE (375px) on every page above
- [ ] Nav collapses to the hamburger menu; menu opens/closes and links work
- [ ] Tables scroll horizontally inside their own border, not the whole page

**Keyboard-only**
- [ ] Tab through the login page, dashboard, and a creator/campaign form using only the keyboard — every interactive element should show a visible focus ring
- [ ] Open a modal (add creator / add campaign) with Enter, close it with Escape
- [ ] Confirm a delete using only the keyboard (Tab to the button, Enter to confirm)

**Production, not just localhost**
- [ ] Demo login works on the Vercel URL
- [ ] Seed data appears in production (run `npm run db:seed` against the production `DATABASE_URL`, or confirm it ran during deploy)
- [ ] `https://<your-app>.vercel.app/sitemap.xml` and `/robots.txt` both resolve
- [ ] Share the Vercel URL in Slack/iMessage and confirm the OG preview card renders (title, description, image)

## Architecture

See [`docs/architecture.md`](./docs/architecture.md) for the data model and auth notes.

## Design System

The visual identity ("The Rundown") is grounded in the product's own mechanic — every deliverable moves through a real six-stage pipeline, and that's the one place the app spends bold color (see the landing page hero and the dashboard stage cards). Everything else stays quiet and disciplined:

- **Type**: Space Grotesk for headings (`--font-display`), Inter for body text, JetBrains Mono for numeric data — budgets, follower counts, dates read as a ledger, not prose.
- **Color**: a single accent (`--accent`, deep petrol teal) instead of the generic indigo/purple most AI-assisted SaaS UIs default to. Stage colors (zinc → amber → blue → violet → emerald → the accent) are the one deliberate moment of range, reused consistently between `stage-badge.tsx`, the dashboard, and the landing page hero.
- **Motion**: a single staggered fade-up on page load, a hover-lift on cards, and a pulsing "live" dot on the landing page — nothing more. All of it is wrapped in `@media (prefers-reduced-motion: no-preference)` in `globals.css`, so anyone with reduced-motion enabled gets an instant, static render instead.
- All tokens live in `src/app/globals.css` under the same CSS variable names the app already used (`--accent`, `--border`, `--muted`, `--foreground`) — changing the palette meant editing one file, not every component.

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint          # ESLint
npm run db:migrate   # create/apply a dev migration
npm run db:deploy    # apply committed migrations (production)
npm run db:seed      # seed the demo account
npm run db:studio    # open Prisma Studio
```

## Roadmap

- [x] Day 1 - Next.js + TS + Tailwind scaffold, Prisma schema, Auth.js email/password, deployed blank pipeline
- [x] Day 2 - Creator directory (CRUD, search, filter by platform/niche)
- [x] Day 3 - Campaigns + deliverables
- [x] Day 4 - Stage control (optimistic UI) + notes
- [x] Day 5 - Dashboard (stage counts, upcoming due dates)
- [x] Day 6 - Full state coverage, responsive polish, SEO, production deploy
- [ ] Day 7 - Demo video, case study
- [ ] Stretch - kanban board upgrade (`@dnd-kit/core`) per plan.md section 7, only if ahead of schedule

## License

MIT - see [LICENSE](./LICENSE).
