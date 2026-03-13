/**
 * reviewer.mjs — Sends code + guidelines to an LLM and parses findings.
 * ======================================================================
 * Returns a structured list of findings the reporter/fixer can consume.
 * 
 * Node.js v24 / ES Modules
 */

import OpenAI from 'openai';

/**
 * @typedef {Object} Finding
 * @property {string} file - File path
 * @property {number} line_start - Start line number
 * @property {number} line_end - End line number
 * @property {'critical'|'warning'|'info'} severity
 * @property {string} category - e.g. "naming", "security", "complexity"
 * @property {string} description - Human-readable explanation  
 * @property {string} suggestion - What the code should look like
 * @property {string} guideline_ref - Which guideline triggered this
 */

/**
 * @typedef {import('./scanner.mjs').FileToReview} FileToReview
 */

const SYSTEM_PROMPT = `You are an expert code reviewer acting as a CI agent for an Angular v21 project.
Your job is to analyse source code against a set of coding guidelines
and produce a JSON array of findings.

Each finding MUST have these keys:
  file, line_start, line_end, severity, category, description, suggestion, guideline_ref

severity is one of: "critical", "warning", "info".

Rules:
• Only report genuine issues backed by the guidelines provided.
• Prefer precision over recall — do NOT invent issues.
• When a diff is provided, focus primarily on changed lines, but you
  may flag pre-existing issues in the same function if they are critical.
• Keep suggestions minimal — change only what is necessary.
• Preserve existing tests — never remove or weaken assertions.
• Return an empty JSON array [] if there are no issues.

Tech stack context:
• Angular v21 with standalone components (standalone: true is the default, NOT needed in decorators)
• TypeScript with strict mode
• RxJS v7 for observables  
• Angular Signals for local state management
• Angular Material v21 for UI components
• Chart.js with ng2-charts for data visualization

Respond with ONLY the raw JSON array. No markdown fences, no commentary.`;

/**
 * Build the user message with files and guidelines
 * @param {FileToReview[]} files 
 * @param {Array<{path: string, content: string}>} guidelines 
 * @returns {string}
 */
function buildUserMessage(files, guidelines) {
  const parts = [];

  // Guidelines
  parts.push('=== CODING GUIDELINES ===\n');
  for (const g of guidelines) {
    parts.push(`--- ${g.path} ---\n${g.content}\n`);
  }

  // Files
  parts.push('\n=== FILES TO REVIEW ===\n');
  for (const f of files) {
    parts.push(`--- ${f.path} ---`);
    if (f.diff) {
      parts.push(`[DIFF]\n${f.diff}\n`);
    }
    parts.push(`[FULL FILE]\n${f.content}\n`);
  }

  return parts.join('\n');
}

// Max files per LLM chunk to stay within context limits
const MAX_FILES_PER_CHUNK = 6;

/**
 * Split files into chunks for processing
 * @param {FileToReview[]} files 
 * @returns {FileToReview[][]}
 */
function chunkFiles(files) {
  const chunks = [];
  for (let i = 0; i < files.length; i += MAX_FILES_PER_CHUNK) {
    chunks.push(files.slice(i, i + MAX_FILES_PER_CHUNK));
  }
  return chunks;
}

/**
 * Review files against guidelines using LLM
 * @param {FileToReview[]} files 
 * @param {Array<{path: string, content: string}>} guidelines 
 * @returns {Promise<Finding[]>}
 */
export async function review(files, guidelines) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  /** @type {Finding[]} */
  const allFindings = [];

  const chunks = chunkFiles(files);
  console.log(`[reviewer] Processing ${chunks.length} chunk(s) with model: ${model}`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`[reviewer] Processing chunk ${i + 1}/${chunks.length} (${chunk.length} files)`);

    const userMessage = buildUserMessage(chunk, guidelines);

    try {
      const response = await client.chat.completions.create({
        model,
        temperature: 0,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
      });

      const raw = response.choices[0]?.message?.content || '[]';

      try {
        const parsed = JSON.parse(raw);
        // Handle both {"findings": [...]} and bare [...]
        const items = Array.isArray(parsed) ? parsed : (parsed.findings || []);
        
        for (const item of items) {
          // Validate required fields
          if (item.file && item.severity && item.description) {
            allFindings.push({
              file: item.file,
              line_start: item.line_start || 1,
              line_end: item.line_end || item.line_start || 1,
              severity: item.severity,
              category: item.category || 'general',
              description: item.description,
              suggestion: item.suggestion || '',
              guideline_ref: item.guideline_ref || 'N/A',
            });
          }
        }
      } catch (parseError) {
        console.warn(`[reviewer] WARNING: failed to parse LLM response — ${parseError.message}`);
        console.warn('[reviewer] Raw response:', raw.slice(0, 500));
      }
    } catch (apiError) {
      console.error(`[reviewer] API error for chunk ${i + 1}:`, apiError.message);
    }
  }

  return allFindings;
}
