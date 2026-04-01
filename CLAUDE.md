# CLAUDE.md — General project instructions

## Architecture

Hexagonal architecture with vertical slicing by business module. Dependencies flow inward: Infrastructure → Application → Domain.

### Project structure

```
src/
  shared/
    domain/
      entities/           — Shared entities (e.g. DomainError)
      types/              — Shared types (e.g. Maybe, Either, BrandId)
      value-objects/      — Shared value objects (e.g. Id)
      ports/              — Shared port interfaces (e.g. TokenRepository)
    application/
      query-token-use-case.ts    — Shared use cases (e.g. QueryTokenUseCase)
      token-dto.ts               — Shared DTOs (e.g. TokenDTO)
    infrastructure/
      http/               — Shared network implementations (e.g. HttpClient, Endpoints enum)
      ui/                 — [Frontend only] Shared UI elements (e.g. App, ProtectedRoute, global styles, routes)
    tests/                — Shared unit and integration (sociable) tests

  [module]/               — Business module directory (e.g. health, auth)
    domain/
      entities/           — Entities (e.g. Health, User)
      value-objects/      — Value objects (e.g. HealthId, OtpCode)
      repositories/       — Repository port interfaces (e.g. HealthRepository)
    application/
      query-health-use-case.ts    — One use case per file (e.g. QueryHealthUseCase)
      health-dto.ts               — Data transfer objects (e.g. HealthDTO)
    infrastructure/
      adapters/           — HTTP adapters implementing repository ports (e.g. HttpHealthRepository)
      controllers/        — [Backend only] Express controllers (e.g. HealthController)
      ui/                 — [Frontend only] Module UI components
    tests/
      domain/             — Domain unit tests
      application/        — Use case unit tests (with InMemory repositories)
      infrastructure/     — Integration tests
```

### Template differences

| Aspect | Backend | Frontend |
|--------|---------|----------|
| `infrastructure/controllers/` | Express controllers | Does not exist |
| `infrastructure/ui/` | Does not exist | UI components |
| `shared/infrastructure/ui/` | Does not exist | App, routes, global styles |
| Framework | Express 5 | React 19 + Vite 8 |

### Naming conventions

- **Files**: Always kebab-case (`query-health-use-case.ts`, `health-dto.ts`, `http-health-repository.ts`)
- **Classes/Interfaces**: PascalCase (`QueryHealthUseCase`, `HealthDTO`, `HttpHealthRepository`)
- `Repository` is **exclusive** for persistence ports (e.g. `HealthRepository`)
- `Adapter` is used for **all other** port implementations (e.g. `HttpHealthRepository`, `StripePaymentAdapter`)
- Use cases follow the pattern `[query/command]-[entity]-use-case.ts`
- DTOs use the suffix `-dto.ts`
- Value objects are immutable and validated at construction

### Dependency rules (strict)

See `@.claude/skills/hexagonal-patterns/SKILL.md` for dependency rules, code patterns, and naming conventions.

Summary: Domain → Application → Infrastructure (inward only). Dependencies injected, never instantiated directly. Validated with `eslint-plugin-hexagonal-architecture` and `ArchUnitTS`.

## Error handling

**Monads** are used for expressive error handling:

- `Either<Error, Value>` — For operations that can fail with typed errors. `Either.left()` and `Either.right()` are static methods on the Either class to maintain cohesion.
- `Maybe<Value>` — For optional values (replaces `null`/`undefined`). `Maybe.some()` and `Maybe.none()` are static methods.

Domain never throws exceptions for business flows. Exceptions are reserved for programming errors (bugs). Business errors flow as `Left` values in `Either`.

## Testing

### BDD + TDD strategy

See `@.claude/skills/xp-tdd-practices/SKILL.md` for the full TDD cycle, TPP table, and case list methodology.

See `@.claude/skills/gherkin-writing/SKILL.md` for Gherkin scenario format and conventions.

Summary:
1. **BDD**: Planner writes Gherkin in `features/`. Playwright executes them.
2. **TDD**: Red → Green → Refactor → Commit per case. One commit per cycle.
3. **Unit/Integration**: Sociable style. InMemory repositories for use case tests, never mocks.
4. **E2E**: Gherkin scenarios via Playwright against the running app.
5. **Architectural**: ArchUnitTS validates hexagonal boundaries in CI.

### Test commands

```bash
bun test               # All tests
bun test:unit          # Unit only (src/)
bun test:int           # Integration tests (verbose)
bun test:e2e           # E2E only (Playwright + Gherkin)
bun test:coverage      # With coverage
```

## Git workflow

See `@.claude/skills/git-branching/SKILL.md` for branch naming, PR rules, branch lifecycle, and the non-negotiable rule of never pushing broken commits on any branch.

## Conventional commits

See `@.claude/skills/conventional-commits/SKILL.md` for format, types, scope rules, and commit discipline (including the no-Claude-authorship rule).

## Static analysis and quality

Validation pipeline (in this order):

1. `bun run compile` — TypeScript compilation (type errors)
2. `bun run check` — Biome format + lint + import sorting
3. `bun test` — All tests pass
4. `bunx knip` — No dead code or unused exports
5. SonarCloud (CI) — Code smells, vulnerabilities, tech debt

## Agent system

This project uses a multi-agent system. Agents are defined in `.claude/agents/` and are automatically delegated to by Claude based on task context.

Each agent runs in its own **isolated worktree** with a clean context, ensuring no state leakage between tasks.

### Workflow

1. CEO → defines user story (reading Gherkin + Sentry, not code) → Tech Lead validates
2. Planner → decomposes into tasks + **writes Gherkin scenarios** → Tech Lead validates
3. Coder → implements with TDD inside-out → passes to review
4. Reviewer → validates quality → approves or returns to Coder
5. Reviewer → approves changes → Tech Lead validates

### Required MCP servers

All four MCP servers are configured in `.mcp.json` (project scope, shared via git):
- **Playwright** and **Context7**: local command-based (run via `npm run mcp:*`)
- **Linear** and **Sentry**: remote HTTP transport (require OAuth authentication per user via `/mcp`)

| MCP Server | CEO | Planner | Coder | Reviewer |
|------------|-----|---------|-------|----------|
| Linear | ✅ | ✅ | ✅ | ✅ |
| Sentry | ✅ | — | — | ✅ |
| Playwright | — | — | ✅ | ✅ |
| Context7 | — | ✅ | ✅ | ✅ |

### Fundamental rules

- **The Tech Lead (human) has the final word on all decisions.**
- **No agent modifies an existing test that was passing** without explicit Tech Lead authorization.
- **Gherkin scenarios are the common language** between all agents and the human.