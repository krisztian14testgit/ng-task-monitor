# AI Code Review Agent Setup

> **Inspected by:** GitHub Copilot (Claude Opus 4.6)  
> **Inspection date:** 2026-04-04  
> **Source analyzed:** `.github/workflows/ai-code-review.yml`, `.github/ai/agent/*.mjs`  
> **Reference docs:** [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions), [GITHUB_TOKEN Authentication](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication)

This document describes the AI Code Review Agent setup for the ng-task-monitor Angular project.

## Overview

The AI Code Review Agent automatically reviews pull requests against the project's coding guidelines and posts feedback as PR comments. It can optionally create auto-fix PRs for issues it can resolve.

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
│       └── fixer.mjs               # Auto-fix branch + PR creator
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
| `contents: write` | Allows the agent to push fix branches (autofix mode) |
| `pull-requests: write` | Allows the agent to post PR comments and open fix PRs |
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
| `agent_mode` | `report` / `autofix` | Post comments only or create fix PR |
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

### AI Model (GitHub Models)

The agent uses **GitHub Models** inference (not a direct OpenAI API key). The model is configured via the `GITHUB_MODEL` environment variable in the workflow.

| Variable | Default Value | Description |
|----------|--------------|-------------|
| `GITHUB_MODEL` | `openai/gpt-4.1` | Model ID for GitHub Models inference |

The inference endpoint used is `https://models.github.ai/inference/chat/completions` with the `GITHUB_TOKEN` for authentication.

To change the model, update the `GITHUB_MODEL` value in the `env` section of `.github/workflows/ai-code-review.yml`.

## Safety Features

| Feature | How |
|---------|-----|
| **Loop prevention** | Guard job skips `github-actions[bot]` actor and `ai-fix/*` branches |
| **Draft PRs** | Auto-fix PRs always open as drafts |
| **Comment upsert** | Re-runs update the same comment instead of creating duplicates |
| **Chunked review** | Large diffs are split into smaller chunks for LLM processing |
| **Concurrency** | Only one agent run per PR at a time |
| **Extension filter** | Only code files are reviewed (skips binaries, images, etc.) |

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

### Auto-fix PR not created

1. Auto-fix only runs when `agent_mode` is set to `autofix`
2. Only `critical` and `warning` findings with suggestions are auto-fixed
3. Check git permissions in the workflow logs
