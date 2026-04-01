---
name: user-story-format
description: Standard user story template with As a/I want/So that, Context, Given/When/Then acceptance criteria, Notes, and Priority. Used by CEO when creating stories and Planner when decomposing them.
user-invocable: false
---

# User Story Format

```markdown
## [Descriptive and concise title]

**As a** [user type]
**I want** [action/functionality]
**So that** [benefit/value]

### Context

[Brief description of the problem or need motivating this story.
Include Sentry data if relevant.
Reference existing .feature files if there is related functionality.]

### Acceptance criteria

- **Given** [precondition]
  **When** [action]
  **Then** [expected result]

- **Given** [precondition]
  **When** [action]
  **Then** [expected result]

### Notes

- [Known constraints]
- [Dependencies with other stories]
- [Related existing features: features/auth/login.feature]

### Suggested priority: [Urgent | High | Medium | Low]
```

## Rules

- **Be specific in acceptance criteria.** They must be verifiable without ambiguity. Use Given/When/Then — the Planner will transform them directly into Gherkin scenarios.
- **One story, one objective.** If a story has more than 5 acceptance criteria, it should probably be split.
- **Prioritize with data.** If Sentry shows an error affecting many users, that outweighs a new feature.
- **Use labels in Linear** to categorize: `feature`, `bug`, `improvement`, `tech-debt`.
- **Do not design technical solutions.** Describe the problem and acceptance criteria. The Planner and Coder decide the implementation.
