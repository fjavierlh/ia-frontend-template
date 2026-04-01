---
name: git-branching
description: Git feature branching strategy, branch naming, PR structure, and the non-negotiable rule of never pushing broken commits on any branch. Used by Coder when managing branches and PRs, and by Reviewer when validating git discipline.
user-invocable: false
---

# Git Branching Strategy

## Model: Feature Branching

One branch per task. Branches are short-lived and merged via PR. `main` is always deployable.

```
main  ←──────────────────────────────────────────
         ↑              ↑              ↑
   feat/ABC-12    fix/ABC-34     chore/ABC-56
```

## Branch naming

```
<type>/<task-id>-<short-description>
```

- **type**: same types as conventional commits (`feat`, `fix`, `refactor`, `chore`, `ci`, `docs`, `test`)
- **task-id**: identifier from the project management tool in use (e.g. `ABC-12` in Linear, `ENG-34` in Jira, `PROJ-56` in Notion)
- **short-description**: 2–4 words in kebab-case

### Examples

```
feat/ABC-12-email-validation
fix/ABC-34-null-health-response
refactor/ABC-56-extract-either-monad
chore/ABC-78-upgrade-biome
```

## Branch lifecycle

1. **Create** from latest `main`:
   ```bash
   git checkout main && git pull
   git checkout -b feat/ABC-12-email-validation
   ```
2. **Develop** with atomic commits following the TDD cycle (see `xp-tdd-practices` and `conventional-commits`)
3. **Open PR** against `main` once all local checks pass
4. **Merge** after Tech Lead approval — preserve atomic commits, squash only if explicitly requested
5. **Delete** the branch after merge

Never commit directly to `main`.

## The non-negotiable rule

> **Every commit on every branch must leave the project in a working state.**

This goes beyond "never commit failing tests" (covered in `conventional-commits`). It means the full local pipeline must be green before any `git commit`:

```bash
bun run compile    # TypeScript: no type errors
bun run check      # Biome: format + lint + import order
bun test           # All tests green
bunx knip          # No dead exports or unused files
```

A broken commit on a feature branch blocks other agents working in parallel worktrees and corrupts the CI history — even if it never reaches `main`.

## PR rules

- **Title**: follows conventional commit format — `type(scope): description`
- **One task, one PR**: a PR maps 1-to-1 to a task; no bundling unrelated work
- **All CI checks must pass** before requesting review — CI is not a substitute for local validation
- **No force-push** once a PR is open; add new commits instead
- **No merge commits** on the feature branch — rebase on `main` if it drifts

### PR description template

```
## What
<one sentence: what this PR does>

## Why
<task ID and brief context>

## Test plan
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] E2E scenarios covered (if applicable)
```

## Rebase vs merge

| Situation | Action |
|-----------|--------|
| Feature branch drifted from `main` | `git rebase main` — keep history linear |
| Merge conflicts during rebase | Resolve per file; never `git checkout --ours` blindly |
| Open PR with drift | Rebase locally; force-push only if no review has started yet |

## Rules summary

- **One branch per task** — no shared feature branches
- **Always branch from latest `main`** — never from another feature branch
- **Every commit must leave the project working** — full pipeline green before every `git commit`
- **PRs map 1-to-1 to tasks** — no bundling unrelated work
- **No direct commits to `main`** — always via PR
