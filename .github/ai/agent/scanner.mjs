/**
 * scanner.mjs — Collects files for the agent to review.
 * ======================================================
 * Two modes:
 *   • changes : only files changed vs. the target branch (PR diff)
 *   • full    : every tracked file on the target branch
 * 
 * Node.js v24 / ES Modules
 */

import { execFileSync } from 'node:child_process';

/**
 * @typedef {Object} FileToReview
 * @property {string} path - File path
 * @property {string} content - Full file content
 * @property {string|null} diff - Unified diff (null for full scans)
 */

/**
 * Execute a git command and return trimmed stdout
 * @param {string[]} args - Command arguments
 * @returns {string}
 */
function runGit(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large diffs
    shell: false,
  }).trim();
}

// File-extension allow-list for Angular/TypeScript projects
const REVIEWABLE_EXTENSIONS = new Set([
  // TypeScript/JavaScript
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  // Angular templates & styles
  '.html', '.scss', '.css',
  // Configuration
  '.json', '.yaml', '.yml',
]);

// Paths to exclude from review
const EXCLUDED_PATHS = [
  'node_modules/',
  'dist/',
  'coverage/',
  '.angular/',
  'package-lock.json',
  '.github/ai/agent/', // Don't review the agent itself
  '.github/workflows/', // Don't review workflow files (sensitive)
  '.env',
];

/**
 * Validate branch name format
 * @param {string} branch
 * @returns {boolean}
 */
function isValidBranchName(branch) {
  if (!branch || typeof branch !== 'string') return false;
  // Reject shell metacharacters and path traversal
  if (/[;&|`$(){}\[\]<>!\\]/.test(branch)) return false;
  if (branch.includes('..')) return false;
  // Only allow alphanumeric, dash, underscore, slash, dot
  return /^[a-zA-Z0-9._\/-]+$/.test(branch) && branch.length <= 250;
}

/**
 * Check if a file should be reviewed
 * @param {string} filePath
 * @returns {boolean}
 */
function isReviewable(filePath) {
  // Check excluded paths
  if (EXCLUDED_PATHS.some(excluded => filePath.includes(excluded))) {
    return false;
  }
  
  // Check extension
  const ext = filePath.slice(filePath.lastIndexOf('.'));
  return REVIEWABLE_EXTENSIONS.has(ext);
}

/**
 * Scan only changed files (PR diff mode)
 * @param {string} targetBranch
 * @returns {Promise<FileToReview[]>}
 */
export async function scanChanges(targetBranch) {
  // Security: Validate branch name before using in git commands
  if (!isValidBranchName(targetBranch)) {
    console.error(`[scanner] SECURITY: Invalid branch name rejected: ${targetBranch}`);
    return [];
  }

  try {
    // Get merge base
    const mergeBase = runGit(['merge-base', `origin/${targetBranch}`, 'HEAD']);
    
    // Get changed files (Added, Copied, Modified, Renamed)
    const diffNames = runGit(['diff', '--name-only', '--diff-filter=ACMR', mergeBase, 'HEAD']);
    
    if (!diffNames) {
      return [];
    }

    /** @type {FileToReview[]} */
    const files = [];

    for (const filePath of diffNames.split('\n')) {
      const trimmedPath = filePath.trim();
      if (!trimmedPath || !isReviewable(trimmedPath)) {
        continue;
      }

      try {
        const content = runGit(['show', `HEAD:${trimmedPath}`]);
        const diff = runGit(['diff', mergeBase, 'HEAD', '--', trimmedPath]);
        
        files.push({
          path: trimmedPath,
          content,
          diff,
        });
      } catch (error) {
        console.warn(`[scanner] Could not read file: ${trimmedPath}`, error.message);
        continue;
      }
    }

    return files;
  } catch (error) {
    console.error('[scanner] Error scanning changes:', error.message);
    return [];
  }
}

/**
 * Scan all tracked files (full scan mode)
 * @param {string} targetBranch
 * @returns {Promise<FileToReview[]>}
 */
export async function scanFull(targetBranch) {
  // Security: Validate branch name before using in git commands
  if (!isValidBranchName(targetBranch)) {
    console.error(`[scanner] SECURITY: Invalid branch name rejected: ${targetBranch}`);
    return [];
  }

  try {
    const allFiles = runGit(['ls-tree', '-r', '--name-only', `origin/${targetBranch}`]);
    
    if (!allFiles) {
      return [];
    }

    /** @type {FileToReview[]} */
    const files = [];

    for (const filePath of allFiles.split('\n')) {
      const trimmedPath = filePath.trim();
      if (!trimmedPath || !isReviewable(trimmedPath)) {
        continue;
      }

      try {
        const content = runGit(['show', `origin/${targetBranch}:${trimmedPath}`]);
        
        files.push({
          path: trimmedPath,
          content,
          diff: null,
        });
      } catch (error) {
        console.warn(`[scanner] Could not read file: ${trimmedPath}`, error.message);
        continue;
      }
    }

    return files;
  } catch (error) {
    console.error('[scanner] Error scanning full repo:', error.message);
    return [];
  }
}
