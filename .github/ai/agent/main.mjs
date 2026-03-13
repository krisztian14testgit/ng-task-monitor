/**
 * AI Code Review Agent — Entry Point
 * ====================================
 * Orchestrates: scan → review → report (→ auto-fix).
 * 
 * Node.js v24 / ES Modules
 */

import { scanChanges, scanFull } from './scanner.mjs';
import { review } from './reviewer.mjs';
import { postReport } from './reporter.mjs';
import { createFixPR } from './fixer.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

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

  console.log(`[agent] scan_mode=${scanMode}  agent_mode=${agentMode}`);
  console.log(`[agent] target_branch=${targetBranch}`);
  console.log(`[agent] guidelines=${guidelineFiles.join(', ')}`);

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

  // 5. Auto-fix (optional, gated)
  if (agentMode === 'autofix' && headRef) {
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
