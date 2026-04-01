---
name: xp-tdd-practices
description: XP values and strict TDD cycle (REASON→RED→GREEN→REFACTOR→COMMIT) with Transformation Priority Premise. Used by Coder when implementing tasks and by Reviewer when validating TDD discipline.
user-invocable: false
---

# XP & TDD Practices

## XP values

1. **Communication**: Explain your reasoning constantly. Ask clarifying questions before assuming.
2. **Simplicity**: Always look for the simplest solution that works. YAGNI.
3. **Feedback**: Apply TDD strictly for immediate feedback.
4. **Courage**: Actively identify code smells and potential design problems.
5. **Respect**: Value the Tech Lead's decisions. Explain the "why" behind suggestions.

## TDD cycle (5 steps)

### 0. REASON (before any code)

1. Read the full task in Linear (description, criteria, dependencies)
2. Read the related Gherkin scenarios in `e2e/features/` (see `gherkin-writing`)
3. Read existing code you will modify or extend
4. Use Context7 to check current API docs for libraries you will use
5. Verify task dependencies are completed
6. **Create a case list as TODO comments in the test file**, ordered simplest to most complex:
   - First: Happy path (simplest and most common case)
   - Then: Alternative cases
   - Finally: Edge cases and exceptions
7. Validate the list before starting
8. Update the task status in Linear to "In Progress"

### 1. RED

- Take the first case from the list (the simplest)
- Write the test; it does not compile (function/class does not exist)
- Write the minimum code to compile (empty function, return null)
- Run the test; it fails (incorrect behavior)

### 2. GREEN

Implement the **minimum** to make the test pass, following TPP (Transformation Priority Premise):

| #   | Transformation         | Description                                 |
| --- | ---------------------- | ------------------------------------------- |
| 1   | {} → nil               | From nothing to returning null              |
| 2   | nil → constant         | From null to returning a literal            |
| 3   | constant → constant+   | From a simple literal to a more complex one |
| 4   | constant → scalar      | From a literal to a variable                |
| 5   | statement → statements | Adding more lines without conditionals      |
| 6   | unconditional → if     | Introducing a conditional                   |
| 7   | scalar → array         | From simple variable to collection          |
| 8   | array → container      | From collection to container                |
| 9   | statement → recursion  | Introducing recursion                       |
| 10  | if → while             | Converting conditional to loop              |
| 11  | expression → function  | Replacing expression with function call     |
| 12  | variable → assignment  | Mutating a variable's value                 |

**Principle**: In each GREEN cycle, choose the transformation with the lowest number that makes the test pass.

### 3. REFACTOR

With all tests green:

- Can this be simplified?
- Is there duplication to eliminate? (Rule of three: wait until seen 3 times before abstracting)
- Are variable names clear?
- Apply simple design principles
- Verify tests remain green after each change

### 4. COMMIT

```bash
git add -A
git commit -m "type(scope): description"
```

**Always commit after green+refactor.** Never commit with failing tests. (see `conventional-commits`)

### 5. RE-EVALUATE

Before continuing:

- Review the list of pending cases
- Is the next case still the simplest step?
- Reorder if necessary
- Mark the completed case in the TODO list
- Return to step 1 with the simplest remaining case

## Inside-out development

Always develop from the inside out (see `hexagonal-patterns`):

```
Domain (pure logic) → Use Case → InMemory Repository → Adapter/Controller
```

The first TDD iterations are on pure domain. Infrastructure comes last.

## Simple design

Verify your code meets the 4 rules of simple design:

1. Does it pass all tests?
2. Does it clearly express intention?
3. Does it have no duplication (of knowledge)? Wait to see it 3 times before abstracting
4. Does it have the minimum number of elements?
