---
name: conventional-commits
description: Conventional commit format, allowed types, scope rules, and the one-commit-per-TDD-cycle discipline. Used by Coder when committing and Reviewer when validating.
user-invocable: false
---

# Conventional Commits

## Format

```
type(scope): imperative description
```

- **type**: What kind of change
- **scope**: Business module name (e.g. `auth`, `health`, `shared`)
- **description**: Imperative, lowercase, no period. Describes what changes, not why

## Allowed types

| Type | When to use |
|------|-------------|
| `feat` | New functionality |
| `fix` | Bug fix |
| `refactor` | Code change that neither adds feature nor fixes bug |
| `test` | Adding or modifying tests |
| `docs` | Documentation only |
| `chore` | Tooling, dependencies, config |
| `ci` | CI/CD pipeline changes |

## Examples

```
feat(auth): add email validation value object
test(auth): add create-user use case tests
fix(health): handle null response from health endpoint
refactor(shared): extract either monad to shared types
chore: add @upstash/context7-mcp as devDependency
```

## Rules

- **One commit per green+refactor TDD cycle** (see `xp-tdd-practices`). Do not accumulate changes across multiple cycles
- **Never commit with failing tests** or non-compiling code
- **Never commit commented-out code**
- **Never commit as Claude or with Claude as co-author.** Do not add `Co-authored-by: Claude` or any AI attribution in commit messages. Commits belong to the Tech Lead.
- Scope is the business module: `auth`, `health`, `user`, `shared`, etc.
- If the change spans multiple modules, use the most significant one or omit scope
