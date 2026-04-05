# AI Code Review Agent Setup

> **Inspected by:** GitHub Copilot (Claude Opus 4.6)  
> **Inspection date:** 2026-04-04  
> **Security audit:** 2026-04-05  
> **Source analyzed:** `.github/workflows/ai-code-review.yml`, `.github/ai/agent/*.mjs`  
> **Reference docs:** [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions), [GITHUB_TOKEN Authentication](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication), [Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)

This document describes the AI Code Review Agent setup for the ng-task-monitor Angular project.

## Overview

The AI Code Review Agent automatically reviews pull requests against the project's coding guidelines and posts feedback as PR comments.

> **Note:** Autofix mode (automatic creation of fix PRs) is temporarily **disabled** for security reasons.
> The code is preserved but blocked by a feature flag (`AUTOFIX_ENABLED = false` in `main.mjs`).
> The LLM's generated code suggestions cannot be trusted to be safe without human review,
> and the write permissions required for autofix expand the attack surface.
> See the [Security](#security) section and [Re-enabling Autofix](#re-enabling-autofix) for details.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     PR opened → main/develop                      │
└──────────┬───────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────┐     ┌──────────────────────────────────┐
│  Guard Job            │────▶│ Is actor bot or ai-fix/* branch? │
│  (loop prevention)    │     │  YES → skip    NO → continue     │
└──────────────────────┘     └──────────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│  scanner.mjs          │  Collects changed files (diff mode)
│                       │  or all files (full mode)
└──────────┬───────────┘
           │  FileToReview[]
           ▼
┌──────────────────────┐
│  reviewer.mjs         │  Sends files + guidelines → LLM
│                       │  Returns Finding[]
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐ ┌────────────┐
│ reporter │ │   fixer    │  (only if agent_mode == "autofix")
│  .mjs    │ │   .mjs     │
│          │ │            │
│ Posts PR │ │ Creates    │
│ comment  │ │ ai-fix/*   │
│ with     │ │ branch +   │
│ findings │ │ draft PR   │
└──────────┘ └────────────┘
```

## File Structure

```
.github/
├── workflows/
│   └── ai-code-review.yml          # GitHub Actions workflow
├── ai/
│   ├── guidelines/
│   │   └── security-rules.md       # Security-specific guidelines
│   └── agent/
│       ├── package.json            # Node.js dependencies
│       ├── main.mjs                # Agent entry point
│       ├── scanner.mjs             # Diff / full-scan logic
│       ├── reviewer.mjs            # LLM-based review engine
│       ├── reporter.mjs            # Report formatter + PR commenter
│       └── fixer.mjs               # Auto-fix branch + PR creator (disabled)
coding-guideline/
├── ANGULAR_CODING_GUIDELINES.md    # Angular best practices
├── RXJS_CODING_GUIDELINES.md       # RxJS patterns
└── COGNITIVE_COMPLEXITY_GUIDELINES.md  # Code complexity rules
```

## Requirements

### Repository Secrets & Permissions

No additional secrets are required. The agent uses the built-in `GITHUB_TOKEN` (automatically provided by GitHub Actions) with GitHub Models inference.

| Token / Permission | Description |
|--------|-------------|
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions — no manual setup needed |
| `models: read` | Workflow permission that enables GitHub Models inference API access |
| `contents: read` | Read repository contents (change to `write` when re-enabling autofix) |
| `pull-requests: write` | Allows the agent to post PR comments (& open fix PRs when autofix enabled) |
| `issues: write` | (Optional) allows opening issues for critical findings |

> **Note:** The repository must have GitHub Models access enabled for the `models: read` permission to work. See [Prototyping with AI models](https://docs.github.com/en/github-models/prototyping-with-ai-models).

### Node.js Version

The agent requires **Node.js v24** or later.

## Usage

### Automatic Trigger

The workflow automatically runs on:
- Pull requests opened against `main`, `develop`, or `release/**` branches
- Pull request updates (synchronize, reopened)

### Manual Trigger

You can manually trigger a review from the Actions tab with these options:

| Input | Options | Description |
|-------|---------|-------------|
| `scan_mode` | `changes` / `full` | Scan only changed files or entire repo |
| `agent_mode` | `report` | Report only (autofix option currently disabled) |
| `target_branch` | branch name | Branch to scan (for full mode) |

## Configuration

### Guidelines

The agent reviews code against these guideline files (configured in the workflow):

1. `coding-guideline/ANGULAR_CODING_GUIDELINES.md` - Angular v21 best practices
2. `coding-guideline/RXJS_CODING_GUIDELINES.md` - RxJS patterns and subscription management
3. `coding-guideline/COGNITIVE_COMPLEXITY_GUIDELINES.md` - Code complexity reduction
4. `.github/ai/guidelines/security-rules.md` - Security rules for Angular apps

To add or modify guidelines, update the `GUIDELINE_FILES` environment variable in `.github/workflows/ai-code-review.yml`.

### File Filtering

The scanner only reviews files with these extensions:
- TypeScript/JavaScript: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`
- Angular templates: `.html`
- Styles: `.scss`, `.css`
- Configuration: `.json`, `.yaml`, `.yml`

Excluded paths:
- `node_modules/`
- `dist/`
- `coverage/`
- `.angular/`
- `package-lock.json`
- `.github/ai/agent/` (the agent itself)
- `.github/workflows/` (security: prevents workflow file manipulation)
- `.env` (security: prevents secrets exposure)

### AI Model (GitHub Models)

The agent uses **GitHub Models** inference (not a direct OpenAI API key). The model is configured via the `GITHUB_MODEL` environment variable in the workflow.

| Variable | Default Value | Description |
|----------|--------------|-------------|
| `GITHUB_MODEL` | `openai/gpt-4.1` | Model ID for GitHub Models inference |

The inference endpoint used is `https://models.github.ai/inference/chat/completions` with the `GITHUB_TOKEN` for authentication.

To change the model, update the `GITHUB_MODEL` value in the `env` section of `.github/workflows/ai-code-review.yml`.

## Security

The AI Code Review Agent implements multiple layers of security hardening to protect against common attack vectors.

### Script Injection Prevention

The workflow uses **environment variable indirection** instead of directly interpolating untrusted GitHub context values in shell scripts:

```yaml
# ✅ Secure: Environment variable indirection
env:
  PR_ACTOR: ${{ github.actor }}
  PR_HEAD_REF: ${{ github.head_ref }}
run: |
  if [[ "$PR_ACTOR" == "github-actions[bot]" ]]; then
    # Safe - variable is quoted and not directly interpreted
  fi

# ❌ Insecure: Direct interpolation (DO NOT USE)
run: |
  ACTOR="${{ github.actor }}"  # Shell injection risk!
```

This prevents malicious PR authors from injecting shell commands via branch names or other PR metadata.

### Path Traversal Protection

The `fixer.mjs` module validates file paths to prevent path traversal attacks. This guard remains as defense-in-depth should autofix ever be re-enabled:

```javascript
function isSafeFilePath(filePath) {
  // Reject absolute paths and path traversal attempts
  if (filePath.startsWith('/') || filePath.startsWith('\\')) return false;
  if (filePath.includes('..')) return false;
  if (/^[a-zA-Z]:/.test(filePath)) return false; // Windows absolute path
  
  // Reject writes to sensitive locations
  const sensitivePatterns = [
    /^\.github[\/\\]workflows/i,  // Workflow files
    /^\.github[\/\\]actions/i,    // Custom actions
    /package\.json$/i,             // Dependency definitions
    /\.env/i,                      // Environment files
    /\.(pem|key|crt|cer)$/i,       // Certificates/keys
  ];
  return !sensitivePatterns.some(pattern => pattern.test(filePath));
}
```

This prevents the LLM from being tricked into writing to sensitive files like `.github/workflows/deploy.yml`.

### Branch Name Validation

The `scanner.mjs` module validates branch names before using them in git commands:

```javascript
function isValidBranchName(branch) {
  if (!branch || typeof branch !== 'string') return false;
  // Reject shell metacharacters and path traversal
  if (/[;&|`$(){}\[\]<>!\\]/.test(branch)) return false;
  if (branch.includes('..')) return false;
  // Only allow alphanumeric, dash, underscore, slash, dot
  return /^[a-zA-Z0-9._\/-]+$/.test(branch) && branch.length <= 250;
}
```

While `execFileSync` with `shell: false` already prevents shell injection, this provides defense-in-depth.

### Fork PR Protection

> **Note:** With autofix removed, fork PR protection is enforced structurally — the agent never writes code.
> The guard below is retained in `fixer.mjs` as defense-in-depth.

The fixer module contains a defense-in-depth check that would force `report` mode for forks:

```javascript
// main.mjs - Defense-in-depth fork protection
if (isForkPR && agentMode === 'autofix') {
  console.warn('[agent] SECURITY: Autofix disabled for fork PR');
  agentMode = 'report';
}
```

This prevents external contributors from using prompt injection to write malicious code to the repository.

### Sensitive File Exclusions

The scanner excludes sensitive files from review. The fixer also blocks writes to them when autofix is re-enabled:

| File Pattern | Reason |
|--------------|--------|
| `.github/workflows/*` | Workflow manipulation could compromise CI/CD |
| `.github/actions/*` | Custom action manipulation |
| `.env*` | Environment files may contain secrets |
| `package.json` | Dependency manipulation (supply chain attack) |
| `*.pem`, `*.key`, `*.crt` | Cryptographic material |

### Security Summary

| Attack Vector | Mitigation | Implementation |
|---------------|------------|----------------|
| Shell injection via PR metadata | Environment variable indirection | `ai-code-review.yml` |
| LLM output trust / autofix | **Autofix disabled** via feature flag | `main.mjs` (`AUTOFIX_ENABLED`) |
| Path traversal (defense-in-depth) | `isSafeFilePath()` validation | `fixer.mjs` |
| Git command injection | Branch name validation + `shell: false` | `scanner.mjs` |
| Fork PR code injection | Fork detection + autofix block | `main.mjs`, `fixer.mjs` |
| Sensitive file tampering | Exclusion patterns | `scanner.mjs`, `fixer.mjs` |
| Excessive permissions | `contents: read` while autofix disabled | `ai-code-review.yml` |
| LLM prompt injection | Report-only mode (no code writes while disabled) | `main.mjs` |

### Known Limitations

1. **LLM output trust:** In autofix mode, the agent trusts LLM-generated code suggestions, which poses risks:
   - LLM hallucination could introduce bugs or vulnerabilities
   - Prompt injection in reviewed source code could manipulate suggested fixes
   - Write permissions (`contents: write`) expand the attack surface
   
   **Current status:** Autofix is **disabled** (`AUTOFIX_ENABLED = false`). When re-enabled, the following mitigations apply:
   - Auto-fix PRs always open as **drafts** requiring human review
   - Fork PRs cannot trigger autofix (blocked in `main.mjs`)
   - Sensitive files are blocked from writes (`isSafeFilePath()` in `fixer.mjs`)

2. **Guideline file access:** The agent reads guideline files from the repository. If a malicious PR modifies these files, subsequent reviews use the modified guidelines. This is limited because:
   - The workflow checks out the base branch (target), not the PR branch, for guidelines
   - Critical security rules should be in `.github/ai/guidelines/` which is protected

## Safety Features

| Feature | How |
|---------|-----|
| **Autofix disabled** | Blocked by `AUTOFIX_ENABLED = false` feature flag in `main.mjs` |
| **Least privilege** | `contents: read` while autofix is disabled |
| **Fork PR protection** | Autofix blocked for fork PRs even when re-enabled |
| **Loop prevention** | Guard job skips `github-actions[bot]` actor and `ai-fix/*` branches |
| **Script injection prevention** | Environment variable indirection for all untrusted inputs |
| **Path traversal protection** | `isSafeFilePath()` validates all write paths (in fixer.mjs) |
| **Branch name validation** | `isValidBranchName()` rejects dangerous branch names |
| **Sensitive file exclusions** | Workflows, `.env`, certificates excluded from scanning/writes |
| **Draft PRs** | Auto-fix PRs always open as drafts (when autofix is re-enabled) |
| **Comment upsert** | Re-runs update the same comment instead of creating duplicates |
| **Chunked review** | Large diffs are split into smaller chunks for LLM processing |
| **Concurrency** | Only one agent run per PR at a time |
| **Extension filter** | Only code files are reviewed (skips binaries, images, etc.) |

## Re-enabling Autofix

To re-enable autofix mode, follow these steps in order:

1. **`main.mjs`** — Change the feature flag:
   ```javascript
   const AUTOFIX_ENABLED = true;
   ```

2. **`ai-code-review.yml`** — Uncomment the `autofix` option in `agent_mode`:
   ```yaml
   options:
     - report
     - autofix   # uncomment this line
   ```

3. **`ai-code-review.yml`** — Switch permissions from `read` to `write`:
   ```yaml
   permissions:
     contents: write   # required for pushing fix branches
   ```

4. **Verify security guards** — Ensure these protections are still active:
   - `isSafeFilePath()` in `fixer.mjs` blocks writes to sensitive files
   - `isValidBranchName()` in `scanner.mjs` validates branch names
   - Fork PR detection in `main.mjs` blocks autofix for external contributors
   - Auto-fix PRs open as **drafts** requiring human review

## Troubleshooting

### Agent not running

1. Verify the repository has GitHub Models access enabled (required for `models: read` permission)
2. Confirm the `GITHUB_TOKEN` has sufficient permissions (check repository Settings → Actions → General → Workflow permissions)
3. Verify the PR targets a branch configured in the workflow (`main`, `develop`, or `release/**`)
4. Check the Actions tab for error logs

### No findings posted

1. The code may already comply with all guidelines
2. Check for LLM API errors in the workflow logs
3. Verify guideline files exist and are readable
