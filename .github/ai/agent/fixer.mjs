/**
 * fixer.mjs — Creates a fix branch and opens a PR with suggested changes.
 * =======================================================================
 * Only runs when agent_mode == "autofix".
 * 
 * Node.js v24 / ES Modules
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { Octokit } from '@octokit/rest';

/**
 * @typedef {import('./reviewer.mjs').Finding} Finding
 */

/**
 * Execute a git command
 * @param {string[]} args 
 * @returns {string}
 */
function runGit(args) {
  const result = execSync(['git', ...args].join(' '), {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  return result.trim();
}

/**
 * Apply fix suggestions to local files
 * @param {Finding[]} findings 
 * @returns {string[]} - List of modified file paths
 */
function applyFixes(findings) {
  const modified = new Set();

  for (const f of findings) {
    // Only apply critical and warning fixes with non-empty suggestions
    if (!f.suggestion || f.severity === 'info') {
      continue;
    }

    if (!existsSync(f.file)) {
      console.warn(`[fixer] File not found: ${f.file}`);
      continue;
    }

    try {
      const lines = readFileSync(f.file, 'utf8').split('\n');

      // Replace the line range with the suggestion
      const start = Math.max(f.line_start - 1, 0);
      const end = Math.min(f.line_end, lines.length);
      const suggestionLines = f.suggestion.trimEnd().split('\n');

      lines.splice(start, end - start, ...suggestionLines);

      writeFileSync(f.file, lines.join('\n'), 'utf8');
      modified.add(f.file);
      
      console.log(`[fixer] Applied fix to ${f.file} (lines ${f.line_start}-${f.line_end})`);
    } catch (error) {
      console.warn(`[fixer] Could not apply fix to ${f.file}:`, error.message);
    }
  }

  return Array.from(modified);
}

/**
 * Create a fix PR with applied suggestions
 * @param {Object} options
 * @param {string} options.repo - Repository full name (owner/repo)
 * @param {string} options.sourceBranch - Source branch name
 * @param {Finding[]} options.findings - List of findings
 * @param {Array<{path: string, content: string}>} options.guidelines - Guidelines used
 */
export async function createFixPR({ repo, sourceBranch, findings, guidelines }) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  // Apply fixes to local files
  const modified = applyFixes(findings);

  if (modified.length === 0) {
    console.log('[fixer] No auto-fixable findings. Skipping PR creation.');
    return;
  }

  const fixBranch = `ai-fix/${sourceBranch}`;

  try {
    // Configure git
    runGit(['config', 'user.name', 'github-actions[bot]']);
    runGit(['config', 'user.email', 'github-actions[bot]@users.noreply.github.com']);

    // Create and switch to fix branch
    try {
      runGit(['checkout', '-b', fixBranch]);
    } catch {
      // Branch might exist, force switch
      runGit(['checkout', fixBranch]);
      runGit(['reset', '--hard', 'HEAD']);
    }

    // Stage and commit changes
    for (const filePath of modified) {
      runGit(['add', filePath]);
    }

    runGit(['commit', '-m', 'refactor: AI agent auto-fix based on coding guidelines']);
    runGit(['push', '--force', 'origin', fixBranch]);

    console.log(`[fixer] Pushed fix branch: ${fixBranch}`);
  } catch (error) {
    console.error('[fixer] Git error:', error.message);
    return;
  }

  // Create PR via GitHub API
  const octokit = new Octokit({ auth: token });
  const [owner, repoName] = repo.split('/');

  // Build PR body
  const bodyParts = [
    '## 🤖 AI Auto-Fix PR',
    '',
    'This PR was created automatically by the AI Code Review Agent.',
    '',
    '### Changes Applied',
    '',
    '| File | Category | Severity |',
    '|------|----------|----------|',
  ];

  for (const f of findings) {
    if (modified.includes(f.file)) {
      bodyParts.push(`| \`${f.file}\` | ${f.category} | ${f.severity} |`);
    }
  }

  bodyParts.push(
    '',
    '### Guidelines Referenced',
    ''
  );

  for (const g of guidelines) {
    bodyParts.push(`- \`${g.path}\``);
  }

  bodyParts.push(
    '',
    '---',
    '⚠️ **Please review these changes carefully before merging.**',
    '_Auto-generated fixes are suggestions — they may require manual adjustments._'
  );

  const prBody = bodyParts.join('\n');

  try {
    // Check if PR already exists
    const { data: existingPRs } = await octokit.pulls.list({
      owner,
      repo: repoName,
      state: 'open',
      head: `${owner}:${fixBranch}`,
    });

    if (existingPRs.length > 0) {
      // Update existing PR
      const existing = existingPRs[0];
      await octokit.pulls.update({
        owner,
        repo: repoName,
        pull_number: existing.number,
        body: prBody,
      });
      console.log(`[fixer] Updated existing fix PR #${existing.number}`);
      return;
    }

    // Create new PR
    const { data: newPR } = await octokit.pulls.create({
      owner,
      repo: repoName,
      title: `🤖 AI Auto-Fix: ${sourceBranch}`,
      body: prBody,
      head: fixBranch,
      base: sourceBranch,
      draft: true, // Always open as draft for safety
    });

    // Try to add label for loop prevention
    try {
      await octokit.issues.addLabels({
        owner,
        repo: repoName,
        issue_number: newPR.number,
        labels: ['ai-generated'],
      });
    } catch {
      // Label may not exist yet
    }

    console.log(`[fixer] Created fix PR #${newPR.number} (draft)`);
  } catch (error) {
    console.error('[fixer] Error creating PR:', error.message);
  }
}
