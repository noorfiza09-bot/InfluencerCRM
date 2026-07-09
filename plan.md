# InfluencerCRM — plan.md

> Manages creator relationships and campaign deliverables end-to-end for brand marketers running influencer campaigns.

Timebox: 7 days. This doc is the spec. Nothing gets built until every section below is locked — that's the point of writing it first.

---

## 1. User stories

- As a marketer, I can sign up and log in so my data is private to my account.
- As a marketer, I can add a creator to my directory (name, handle, platform, follower count, email, niche tags) so I have a reusable roster.
- As a marketer, I can search and filter my creator directory by platform and niche.
- As a marketer, I can create a campaign (name, start date, end date, budget).
- As a marketer, I can attach a creator to a campaign as a deliverable, which starts in the "Outreach sent" stage.
- As a marketer, I can move a deliverable through stages: Outreach sent → Negotiating → Contracted → Content submitted → Posted → Paid.
- As a marketer, I can add a dated note to any deliverable (e.g. "Replied 6/12, wants $800 instead of $500").
- As a marketer, I can see a dashboard of active campaigns, deliverables by stage, and upcoming due dates.
- As a marketer, I can delete a creator, campaign, or deliverable I no longer need.
- As a visitor with the demo login, I can see realistic seeded data immediately — no empty account on first load for reviewers.

Out of scope for v1 (do not build): team roles/multi-user accounts, email integration for actual outreach, payment processing, CSV import of creators, drag-and-drop kanban (see §7 decision).

---

## 2. Data shapes

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  creators   Creator[]
  campaigns  Campaign[]
}

model Creator {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  name       String
  handle     String
  platform   Platform
  followers  Int
  email      String?
  niche      String[]     // tags, e.g. ["beauty", "fitness"]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  deletedAt  DateTime?
  deliverables Deliverable[]

  @@index([userId])
}

enum Platform {
  INSTAGRAM
  TIKTOK
  YOUTUBE
  TWITTER
  OTHER
}

model Campaign {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  name       String
  startDate  DateTime
  endDate    DateTime
  budget     Decimal
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  deletedAt  DateTime?
  deliverables Deliverable[]

  @@index([userId])
}

model Deliverable {
  id          String   @id @default(cuid())
  creatorId   String
  creator     Creator  @relation(fields: [creatorId], references: [id])
  campaignId  String
  campaign    Campaign @relation(fields: [campaignId], references: [id])
  status      Stage    @default(OUTREACH_SENT)
  dueDate     DateTime?
  amount      Decimal?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  notes       Note[]

  @@index([campaignId])
  @@index([creatorId])
  @@index([status])
}

enum Stage {
  OUTREACH_SENT
  NEGOTIATING
  CONTRACTED
  CONTENT_SUBMITTED
  POSTED
  PAID
}

model Note {
  id            String      @id @default(cuid())
  deliverableId String
  deliverable   Deliverable @relation(fields: [deliverableId], references: [id])
  body          String
  createdAt     DateTime    @default(now())

  @@index([deliverableId])
}
```

**Flagged as required, not nullable:** `Creator.name`, `Creator.handle`, `Creator.platform`, `Campaign.name`, `Campaign.startDate`, `Campaign.endDate`, `Deliverable.status`. Everything else nullable is a deliberate call (e.g. `Creator.email` optional — you may add a creator before you have contact info).

**Shared Zod schema** (`src/lib/validators.ts`) mirrors this exactly — same file imported by both the form component and the API route, so client and server reject the same bad input.

---

## 3. Screens / affected files

```
src/app/
  (auth)/login/page.tsx
  (auth)/signup/page.tsx
  dashboard/page.tsx                # stage counts, upcoming due dates, active campaigns
  creators/page.tsx                 # directory: search + filter by platform/niche
  creators/[id]/page.tsx            # creator detail: profile + deliverable history
  campaigns/page.tsx                # list of campaigns
  campaigns/[id]/page.tsx           # single campaign: deliverables table, add-creator action
  deliverables/[id]/page.tsx        # deliverable detail: status control + notes timeline
src/components/
  ui/                               # shared button, input, select, card, badge (shadcn-based)
  creator-form.tsx
  campaign-form.tsx
  deliverable-status-select.tsx     # the stage-change control (see §7)
  note-timeline.tsx
  stage-badge.tsx                   # color-coded pill per Stage
src/server/
  creators.ts                       # server actions: create, update, delete, list+filter
  campaigns.ts
  deliverables.ts                   # includes moveStage(id, newStage)
  notes.ts
src/lib/
  auth.ts
  db.ts
  validators.ts
prisma/
  schema.prisma
  seed.ts                           # demo account with realistic seeded data
```

---

## 4. API / server actions contract

| Action | Input | Output | Auth |
|---|---|---|---|
| `createCreator` | name, handle, platform, followers, email?, niche[] | Creator | required, row scoped to user |
| `listCreators` | search?, platform?, niche? | Creator[] | required |
| `updateCreator` / `deleteCreator` | id, fields | Creator | required, must own row |
| `createCampaign` | name, startDate, endDate, budget | Campaign | required |
| `createDeliverable` | creatorId, campaignId, dueDate?, amount? | Deliverable (status defaults OUTREACH_SENT) | required, creator+campaign must belong to user |
| `moveStage` | deliverableId, newStage | Deliverable | required, must own via campaign |
| `addNote` | deliverableId, body | Note | required |
| `deleteCreator/Campaign` | id | soft delete (`deletedAt`) | required |

All mutations return the updated record so the client reconciles state without a second fetch. All list views exclude soft-deleted rows by default.

---

## 5. Edge cases to handle explicitly

- Deleting a creator that has active deliverables — block it or cascade? **Decision: soft-delete only, deliverables keep referencing the (now hidden) creator, creator detail page shows "archived."**
- Campaign end date before start date — reject at validation, both client and server.
- Empty creator directory on first login — show "Add your first creator" CTA, not a blank table.
- Empty campaign (no deliverables yet) — show "Add a creator to this campaign" CTA.
- Follower count entered as negative or non-numeric — Zod rejects, inline error under the field.
- Two deliverables for the same creator+campaign pair — allow it (a creator might do two separate posts in one campaign) but show both distinctly in the UI.
- Moving a deliverable backward in stage (e.g. Posted → Negotiating) — allow it, real workflows aren't strictly linear; don't hard-block, just don't auto-suggest it.
- Search with zero results vs. no data yet — distinguish these two empty states; the former gets a "clear filters" action, the latter gets "add your first X."

---

## 6. Assumptions

- Single-user accounts (no team/org sharing) for v1 — noted as a Roadmap item in the README, not built.
- Currency is USD only, no multi-currency handling.
- "Niche" is a free-text tag array, not a fixed taxonomy — simpler to build, still filterable.
- Demo login ships with ~3 campaigns and ~15 creators/deliverables spread across all 6 stages so reviewers see a populated pipeline immediately.

---

## 7. Decision: table view over drag-and-drop kanban

**Chosen:** the campaign detail page shows deliverables as a **filterable table with a status dropdown per row** (`deliverable-status-select.tsx`), with stage shown as a color-coded badge. Grouped/sortable by stage.

**Why not drag-and-drop kanban:** it's the single highest-risk item in this build relative to time available, and it's not a rubric requirement — the rubric scores CRUD, states, and polish, not the interaction pattern. A dropdown is fully keyboard-accessible by default too, which a raw drag-and-drop implementation usually isn't without extra work.

**If day 4 goes well and time remains:** upgrade to a kanban board using `@dnd-kit/core`, keeping the table as the underlying data layer (columns = stage, `moveStage` on drop = the same action the dropdown already calls). This is explicitly a stretch goal, not the baseline plan — do not start it until the table version is fully working, tested, and deployed.

---

## 8. Day-by-day acceptance criteria

**Day 1 — Setup, schema, auth**
- [ ] Next.js + TypeScript strict + Tailwind scaffolded, deployed to Vercel as a blank page (pipeline proven working before feature-complete).
- [ ] Prisma schema above migrated against Postgres (Supabase/Neon).
- [ ] Auth.js email+password (or Google OAuth) working: signup, login, logout, session persists.
- [ ] `.env.example` committed with every variable.

**Day 2 — Creator directory**
- [ ] Create/edit/delete a creator, all fields validated client+server with shared Zod schema.
- [ ] List page with search (debounced ~300ms) and filter by platform + niche.
- [ ] Empty state, loading skeleton, error state all implemented — not just happy path.

**Day 3 — Campaigns + deliverables**
- [ ] Create/edit/delete a campaign.
- [ ] Attach a creator to a campaign as a deliverable; defaults to Outreach sent.
- [ ] Campaign detail page lists its deliverables in the table view from §7.

**Day 4 — Stage control + notes**
- [ ] Status dropdown updates `Deliverable.status` via `moveStage`, optimistic UI with rollback on failure.
- [ ] Notes: add + list, newest first, timestamped.
- [ ] Stretch only if ahead of schedule: kanban upgrade per §7.

**Day 5 — Dashboard**
- [ ] Deliverable counts by stage across all campaigns.
- [ ] Upcoming due dates (next 7 days) list.
- [ ] Active campaigns summary cards.

**Day 6 — States, polish, deploy, SEO**
- [ ] Every async view has loading/empty/error/success — verified by hand, not assumed.
- [ ] Responsive down to 375px, keyboard-navigable, visible focus rings.
- [ ] Deployed to production Vercel URL, demo login seeded and working in production (not just localhost).
- [ ] Meta tags, OG image, sitemap.xml, robots.txt in place.
- [ ] README with screenshots, quick start, env table, demo login credentials.

**Day 7 — Buffer, demo video, case study**
- [ ] Full submission checklist pass (see handbook §"Submission Checklist").
- [ ] 60–90s Loom recorded walking: add creator → create campaign → attach deliverable → move stage → add note → dashboard.
- [ ] Case study written: problem, approach (including the §7 table-vs-kanban tradeoff as the "hard decision" writeup), result, what you'd build next.

---

## 9. Open questions (resolve before Day 1 ends)

- OAuth (Google) vs. email+password only — pick one, don't build both.
- Supabase vs. Neon for Postgres — either is fine, pick based on which you set up faster.
- Exact niche tag list vs. fully freeform — freeform chosen above; revisit only if filtering feels unusable with real data.
