/**
 * reporter.mjs — Formats findings and posts them as a PR comment.
 * ================================================================
 * 
 * Node.js v24 / ES Modules
 */

import { Octokit } from '@octokit/rest';

/**
 * @typedef {import('./reviewer.mjs').Finding} Finding
 */

const BOT_MARKER = '<!-- ai-code-review-agent -->';

/**
 * Format findings into a Markdown report
 * @param {Finding[]} findings 
 * @param {string} scanMode 
 * @returns {string}
 */
function formatReport(findings, scanMode) {
  const modeLabel = scanMode === 'full' 
    ? '🔍 Full Repository Scan' 
    : '🔎 Changed Files Scan';

  const lines = [
    '## 🤖 AI Code Review Report',
    '',
    `**Mode:** ${modeLabel}`,
    `**Findings:** ${findings.length}`,
    '',
  ];

  if (findings.length === 0) {
    lines.push(
      '✅ **No issues found!** The code looks good.',
      '',
      '---',
      '_This report was generated automatically by the AI Code Review Agent._'
    );
    return lines.join('\n');
  }

  // Summary table
  const critical = findings.filter(f => f.severity === 'critical').length;
  const warning = findings.filter(f => f.severity === 'warning').length;
  const info = findings.filter(f => f.severity === 'info').length;

  lines.push(
    '### Summary',
    '',
    '| Severity | Count |',
    '|----------|-------|',
    `| 🔴 Critical | ${critical} |`,
    `| 🟡 Warning  | ${warning} |`,
    `| 🔵 Info     | ${info} |`,
    '',
    '---',
    ''
  );

  // Detailed findings
  lines.push('### Detailed Findings\n');

  const severityIcons = {
    critical: '🔴',
    warning: '🟡',
    info: '🔵',
  };

  for (let idx = 0; idx < findings.length; idx++) {
    const f = findings[idx];
    const icon = severityIcons[f.severity] || '⚪';
    const lineRange = f.line_start === f.line_end 
      ? `Line ${f.line_start}` 
      : `Lines ${f.line_start}–${f.line_end}`;

    lines.push(
      `#### ${icon} #${idx + 1} — ${f.category}`,
      '',
      `**File:** \`${f.file}\` · ${lineRange}`,
      `**Severity:** ${f.severity} · **Guideline:** ${f.guideline_ref}`,
      '',
      `**Issue:** ${f.description}`,
      ''
    );

    if (f.suggestion) {
      lines.push(
        '<details>',
        '<summary>💡 Suggested fix</summary>',
        '',
        '```suggestion',
        f.suggestion,
        '```',
        '',
        '</details>',
        ''
      );
    }

    lines.push('---', '');
  }

  lines.push('_This report was generated automatically by the AI Code Review Agent._');
  return lines.join('\n');
}

/**
 * Post the review report as a PR comment
 * @param {Object} options
 * @param {string} options.repo - Repository full name (owner/repo)
 * @param {number} options.prNumber - Pull request number
 * @param {Finding[]} options.findings - List of findings
 * @param {string} options.scanMode - Scan mode used
 */
export async function postReport({ repo, prNumber, findings, scanMode }) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const octokit = new Octokit({ auth: token });
  const [owner, repoName] = repo.split('/');

  const body = formatReport(findings, scanMode);
  const bodyWithMarker = `${BOT_MARKER}\n${body}`;

  try {
    // Get existing comments to check for upsert
    const { data: comments } = await octokit.issues.listComments({
      owner,
      repo: repoName,
      issue_number: prNumber,
    });

    // Find existing bot comment
    const existingComment = comments.find(c => c.body?.includes(BOT_MARKER));

    if (existingComment) {
      // Update existing comment
      await octokit.issues.updateComment({
        owner,
        repo: repoName,
        comment_id: existingComment.id,
        body: bodyWithMarker,
      });
      console.log(`[reporter] Updated existing comment #${existingComment.id}`);
    } else {
      // Create new comment
      const { data: newComment } = await octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: prNumber,
        body: bodyWithMarker,
      });
      console.log(`[reporter] Posted new review comment #${newComment.id}`);
    }
  } catch (error) {
    console.error('[reporter] Error posting comment:', error.message);
    throw error;
  }
}
