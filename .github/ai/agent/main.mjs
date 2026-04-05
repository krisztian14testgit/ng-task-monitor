/**
 * AI Code Review Agent — Entry Point
 * ====================================
 * Orchestrates: scan → review → report (→ auto-fix when enabled).
 * 
 * ⚠️  Autofix mode is temporarily DISABLED for security reasons.
 *     To re-enable, set AUTOFIX_ENABLED = true below and update
 *     the workflow permissions (contents: write).
 *     See code-review-setup/AI-CODE-REVIEW-SETUP.md § Security → Known Limitations.
 * 
 * Node.js v24 / ES Modules
 */

import { scanChanges, scanFull } from './scanner.mjs';
import { review } from './reviewer.mjs';
import { postReport } from './reporter.mjs';
import { createFixPR } from './fixer.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// ── Autofix feature flag ─────────────────────────────────────
// Set to true to re-enable autofix mode.
// SECURITY: Before enabling, ensure the workflow has contents:write
//           and review the fixer.mjs security guards.
const AUTOFIX_ENABLED = false;
// ─────────────────────────────────────────────────────────────

/**
 * Load guidelines from file paths
 * @param {string[]} paths - Array of guideline file paths
 * @returns {Array<{path: string, content: string}>}
 */
function loadGuidelines(paths) {
  const guidelines = [];
  
  for (const filePath of paths) {
    const trimmedPath = filePath.trim();
    if (!trimmedPath) continue;
    
    const resolvedPath = resolve(process.cwd(), trimmedPath);
    
    if (existsSync(resolvedPath)) {
      const content = readFileSync(resolvedPath, 'utf8');
      guidelines.push({ path: trimmedPath, content });
      console.log(`[agent] Loaded guideline: ${trimmedPath}`);
    } else {
      console.warn(`[agent] WARNING: guideline file not found → ${trimmedPath}`);
    }
  }
  
  return guidelines;
}

async function main() {
  // Read environment variables
  const scanMode = process.env.SCAN_MODE || 'changes';
  const agentMode = process.env.AGENT_MODE || 'report';
  const targetBranch = process.env.TARGET_BRANCH || 'main';
  const guidelineFiles = (process.env.GUIDELINE_FILES || '').split(',');
  const prNumber = process.env.PR_NUMBER;
  const repo = process.env.REPO_FULL_NAME;
  const headRef = process.env.HEAD_REF;
  const headSha = process.env.HEAD_SHA;
  const isForkPR = process.env.IS_FORK_PR === 'true';

  // ── Autofix gate ─────────────────────────────────────────
  // SECURITY: Autofix is blocked by feature flag.
  // Even if AGENT_MODE=autofix is passed, it will be overridden.
  let effectiveMode = agentMode;
  if (effectiveMode === 'autofix' && !AUTOFIX_ENABLED) {
    console.warn('[agent] BLOCKED: Autofix mode is temporarily disabled (AUTOFIX_ENABLED=false)');
    effectiveMode = 'report';
  }
  // SECURITY: Disable autofix for fork PRs to prevent malicious code injection
  if (isForkPR && effectiveMode === 'autofix') {
    console.warn('[agent] SECURITY: Autofix disabled for fork PR');
    effectiveMode = 'report';
  }

  console.log(`[agent] scan_mode=${scanMode}  agent_mode=${effectiveMode}${effectiveMode !== agentMode ? ` (requested: ${agentMode})` : ''}`);
  console.log(`[agent] target_branch=${targetBranch}`);
  console.log(`[agent] guidelines=${guidelineFiles.join(', ')}`);
  if (isForkPR) {
    console.log('[agent] Fork PR detected - autofix blocked by policy');
  }

  // 1. Load guidelines
  const guidelines = loadGuidelines(guidelineFiles);

  if (guidelines.length === 0) {
    console.error('[agent] ERROR: no guideline files loaded. Exiting.');
    process.exit(1);
  }

  // 2. Scan files
  let files;
  if (scanMode === 'full') {
    files = await scanFull(targetBranch);
  } else {
    files = await scanChanges(targetBranch);
  }

  if (files.length === 0) {
    console.log('[agent] No files to review. Exiting cleanly.');
    return;
  }

  console.log(`[agent] ${files.length} file(s) to review.`);

  // 3. Review
  const findings = await review(files, guidelines);

  if (findings.length === 0) {
    console.log('[agent] ✅ No issues found.');
    // Still post a clean report so the author knows it ran
    if (prNumber) {
      await postReport({
        repo,
        prNumber: parseInt(prNumber, 10),
        findings: [],
        scanMode,
      });
    }
    return;
  }

  console.log(`[agent] ${findings.length} finding(s).`);

  // 4. Report
  if (prNumber) {
    await postReport({
      repo,
      prNumber: parseInt(prNumber, 10),
      findings,
      scanMode,
    });
  }

  // 5. Auto-fix (gated by feature flag + security checks)
  //    Currently DISABLED — AUTOFIX_ENABLED = false
  if (effectiveMode === 'autofix' && headRef) {
    await createFixPR({
      repo,
      sourceBranch: headRef,
      findings,
      guidelines,
    });
  }
}

// Run
main().catch((err) => {
  console.error('[agent] Fatal error:', err);
  process.exit(1);
});
