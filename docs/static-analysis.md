# Static Analysis

SonarCloud runs on every PR as a CI quality gate — security, code quality, and coverage.

---

## Overview

SonarCloud is the single static analysis tool in this project. It runs automatically in CI on every PR and blocks merging if the quality gate fails.

ESLint and Vitest coverage handle code quality and coverage locally.

---

## SonarCloud setup

### 1. Create organization and project

1. Sign in to [sonarcloud.io](https://sonarcloud.io) with your GitHub account.
2. Create or select an **organization** (usually your GitHub user or organization).
3. Go to **+** → **Analyze new project** → select the GitHub repository.
4. Note the `Organization Key` and `Project Key` — the project key follows the pattern `<org>_<repo>` (e.g. `javi-lopez_front-template`).

> See: [Getting started with GitHub – SonarQube Cloud](https://docs.sonarsource.com/sonarqube-cloud/getting-started/github)

### 2. Disable Automatic Analysis

SonarCloud enables **Automatic Analysis** by default. This conflicts with CI-based analysis and causes the scanner to fail with:

> `You are running CI analysis while Automatic Analysis is enabled.`

Disable it: **Project → Administration → Analysis Method → turn off Automatic Analysis**.

### 3. Update `sonar-project.properties`

Replace the placeholders at the project root:

```properties
sonar.projectKey=<YOUR_ORG>_<YOUR_REPO>   # → your actual project key (must match SonarCloud exactly)
sonar.organization=<YOUR_ORG>              # → your organization key (not the display name)
```

### 4. Generate a token

1. In SonarCloud: **My Account → Security → Generate Tokens**.
2. Create a **Project Analysis Token** for this project.
3. Copy it (shown only once).

> See: [Managing tokens – SonarQube Cloud](https://docs.sonarsource.com/sonarqube-cloud/managing-your-account/managing-tokens)

### 5. Add the secret in GitHub

1. Go to **Settings → Secrets and variables → Actions** in your repository.
2. Create a new secret named `SONAR_TOKEN` with the token value.

---

## CI quality gate

The `sonar` job in `.github/workflows/ci.yml` runs automatically on every PR:

1. Generates coverage with `npm run test:coverage` → produces `coverage/lcov.info`.
2. Runs the scanner via [`SonarSource/sonarqube-scan-action@v6`](https://github.com/SonarSource/sonarqube-scan-action).
3. **Fails the PR** if the quality gate does not pass (quality gate check is built into v6).

---

## Branch protection (manual step)

To enforce the quality gate as a blocking check:

1. Go to **Settings → Branches → Branch protection rules** in your repository.
2. Add a rule for `main`.
3. Enable **Require status checks to pass before merging**.
4. Add **SonarCloud Analysis** as a required status check.

> See: [GitHub Actions for SonarQube Cloud](https://docs.sonarsource.com/sonarqube-cloud/advanced-setup/ci-based-analysis/github-actions-for-sonarcloud)

---

## Scripts reference

| Script                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run test:coverage` | Generate `coverage/lcov.info` for SonarCloud |
