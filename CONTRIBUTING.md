# Contributing

## Local setup

Follow the [Quick Start](./README.md#quick-start) in the README.

## Branching & commits

- Branch per feature: `feat/creator-directory`, `fix/stage-dropdown-rollback`, etc.
- Commit style follows [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- Keep commits small and scoped to one logical change — the git log should read as a build story.

## Before opening a PR

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three must pass. Rebase on `main` before opening the PR to keep history linear.

## Pull requests

Describe **what changed and why**, not just what changed — the reviewer's speed is capped by how fast they can reconstruct your intent.
