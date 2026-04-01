---
name: gherkin-writing
description: Gherkin scenario format, feature file structure, and Given/When/Then conventions. Gherkin is the common language between CEO, Planner, Coder, and Reviewer.
user-invocable: false
---

# Gherkin Writing

Gherkin scenarios are the **contract between all agents and the Tech Lead**. When the Tech Lead approves the `.feature` files, the contract is sealed.

## File location

```
features/[module]/[feature-name].feature
```

Examples:
- `features/auth/login.feature`
- `features/health/query-health.feature`

## Feature file structure

```gherkin
# features/auth/login.feature
Feature: User login
  As a registered user
  I want to log in with my credentials
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given a registered user with email "user@example.com" and password "SecureP4ss!"
    When the user logs in with email "user@example.com" and password "SecureP4ss!"
    Then the user should receive an authentication token
    And the token should be valid for 24 hours

  Scenario: Login fails with wrong password
    Given a registered user with email "user@example.com"
    When the user logs in with email "user@example.com" and password "wrong"
    Then the login should be rejected
    And the error should indicate invalid credentials

  Scenario: Login fails with non-existent email
    When the user logs in with email "nonexistent@example.com" and password "any"
    Then the login should be rejected
    And the error should indicate invalid credentials
```

## Conventions

- **Feature**: One feature per file, named after the main functionality
- **Scenario**: One concrete example per scenario. Name it as a sentence describing the case
- **Given**: Precondition or initial state. Set up the world
- **When**: The action the actor performs
- **Then**: Expected observable outcome
- **And / But**: Continue a Given, When, or Then without repeating the keyword
- Use **concrete values** in quotes (`"user@example.com"`, not `"a valid email"`)
- Write from the **user's perspective**, not the technical implementation

## Relationship with acceptance criteria

CEO writes acceptance criteria in Given/When/Then format. Planner transforms them directly into Gherkin scenarios. The format should be compatible:

**CEO acceptance criterion:**
```
Given a registered user
When they log in with correct credentials
Then they receive an authentication token
```

**Planner's Gherkin scenario** (adds concreteness):
```gherkin
Scenario: Successful login
  Given a registered user with email "user@example.com" and password "SecureP4ss!"
  When the user logs in with email "user@example.com" and password "SecureP4ss!"
  Then the user should receive an authentication token
```

## Rules

- **Gherkin before tasks**: Feature files are the first deliverable of the Planner, not an afterthought
- **One scenario, one case**: Don't combine multiple behaviors in one scenario
- **Observable outcomes**: `Then` must describe something the user can observe, not internal state
- If a feature file for functionality doesn't exist, **that functionality does not exist** (for product purposes)
