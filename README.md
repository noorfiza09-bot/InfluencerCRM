# InfluencerCRM

> Manages creator relationships and campaign deliverables end-to-end for brand marketers running influencer campaigns.

Built for the Digital Heroes Full Stack Developer Trial. See [`plan.md`](./plan.md) for the full spec.

**Status: Day 2 of 7 — creator directory complete.** Campaigns, deliverables, and the dashboard land Days 3-5 per the plan.

## Features (Day 1-2)

- Email + password signup and login (Auth.js / NextAuth v5, JWT sessions)
- Passwords hashed with bcrypt (cost 12), never stored or returned in plaintext
- Session-gated routes enforced server-side in `src/proxy.ts` — not just hidden client-side
- Prisma schema modeling Users, Creators, Campaigns, Deliverables, Notes
- Shared Zod validation (`src/lib/validators.ts`) used by both forms and server actions
- Creator directory: create/edit/delete (soft delete), server-side search (debounced 300ms) and filter by platform + niche, all mirrored into the URL query string
- Every async view covers loading (skeleton), empty (two variants — no data vs. no matches), error (with retry), and success states
- Row-level authorization on every mutation — creators are scoped to `userId`, never trusted from the client
- TypeScript strict mode, zero `any`, ESLint clean

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

## Architecture

See [`docs/architecture.md`](./docs/architecture.md) for the data model and auth notes.

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
- [ ] Day 3 - Campaigns + deliverables
- [ ] Day 4 - Stage control (optimistic UI) + notes
- [ ] Day 5 - Dashboard (stage counts, upcoming due dates)
- [ ] Day 6 - Full state coverage, responsive polish, SEO, production deploy
- [ ] Day 7 - Demo video, case study
- [ ] Stretch - kanban board upgrade (`@dnd-kit/core`) per plan.md section 7, only if ahead of schedule

## License

MIT - see [LICENSE](./LICENSE).
