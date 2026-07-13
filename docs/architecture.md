# Architecture

## Data model

Entities: `User` 1—* `Creator`, `User` 1—* `Campaign`, `Campaign` 1—* `Deliverable` *—1 `Creator`, `Deliverable` 1—* `Note`.

Full schema lives in [`prisma/schema.prisma`](../prisma/schema.prisma) and mirrors `plan.md` section 2 exactly — that file is the source of truth for field names, nullability, and enums.

```
User
 ├── Creator[]        (soft-deletable, one owner)
 └── Campaign[]        (soft-deletable, one owner)
      └── Deliverable[] (belongs to one Campaign + one Creator, status enum)
           └── Note[]   (timestamped, append-only)
```

## Auth & authorization

Auth.js (NextAuth v5) with a Credentials provider (email + password) and JWT sessions — no server-side session table needed. Passwords are hashed with bcrypt (cost 12) in `src/app/api/signup/route.ts` and never stored or returned in plaintext.

Every request to `/dashboard`, `/creators`, `/campaigns`, and `/deliverables` is checked server-side in `src/middleware.ts`, which redirects unauthenticated requests to `/login` before the route handler ever runs. Client-side checks are never trusted as the only gate.

Row-level ownership (a user can only see/mutate their own Creators, Campaigns, Deliverables, and Notes) is enforced by scoping every Prisma query with `where: { userId }` for Creators/Campaigns, or via the owning Campaign for Deliverables and via the owning Deliverable → Campaign for Notes — never by trusting an ID passed from the client alone. See `src/server/creators.ts` for the pattern: every mutation re-fetches the row scoped to `userId` before acting on it, so passing another user's creator `id` returns "not found" rather than leaking or mutating it.

## Decisions & trade-offs

- **JWT sessions over database sessions** — simpler to reason about with a Credentials-only provider, avoids an extra `Session` table, trades off centralized session revocation (acceptable for a single-user-per-account v1 with no team sharing).
- **Table view over drag-and-drop kanban for deliverables** — see `plan.md` section 7. Lower risk relative to the 7-day timebox, and the rubric scores CRUD/states/polish, not the interaction pattern.
- **Soft deletes (`deletedAt`) over hard deletes** — recovery matters for Creators and Campaigns since deliverables reference them; hard-deleting would orphan deliverable history.
- **Whole-file `"use server"` in `src/server/*.ts`** — query functions (`listCreators`) and mutations (`createCreator`, etc.) live in the same file per plan.md's file map. A single top-of-file directive turns every export into a callable Server Action; queries are called directly from Server Components (no network hop, same process), mutations are imported into Client Components and invoked like normal async functions.
