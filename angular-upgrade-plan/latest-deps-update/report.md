# Latest Dependencies Update Report

## Date: 2026-02-21

---

## Updates — ncu results applied

| Package | From | To | Status |
|---|---|---|---|
| `@angular/*` (10 pkgs), `zone.js`, `@angular-devkit/build-angular`, `@angular/cli`, `@angular/compiler-cli` | `~21.1.2` | `~21.1.5` | ✅ Updated |
| `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` | `^8.54.0` | `^8.56.0` | ✅ Updated |
| `globals` | `^17.2.0` | `^17.3.0` | ✅ Updated |
| `@types/node` | `^25.1.0` | `^25.3.0` | ✅ Updated |
| `eslint` | `^9.39.2` | `^9.39.3` | ✅ Updated (capped at v9, see below) |
| `puppeteer` | `~24.36.1` | `~24.37.5` | ✅ Updated |
| `eslint` | `^9.39.x` | `^10.0.1` | ❌ Blocked — see below |

`@eslint/js` was also added as an explicit `devDependency` (`^9.39.3`) because `eslint.config.js` imports it directly and it was not reliably hoisted from inside `eslint`'s own `node_modules`.

---

## Why `eslint` cannot be upgraded to v10

`@angular-eslint/*` (`^21.2.0`) declares the peer dependency `eslint: "^8.57.0 || ^9.0.0"`, explicitly excluding v10.
Attempting `eslint@^10` caused a runtime crash: `TypeError: Cannot read properties of null (reading '__addVariables')` inside the `@angular-eslint` template parser, breaking `npm run lint`.
**Blocked until `@angular-eslint` publishes support for ESLint v10.**

---

## Security vulnerabilities — `npm audit`

**Baseline:** 30 vulnerabilities (7 moderate, 23 high) from two CVEs:
- **GHSA-2g4f-4pwh-qvx6** — `ajv <8.18.0`, ReDoS via `$data` option (moderate)
- **GHSA-3ppc-4f35-3m26** — `minimatch <10.2.1`, ReDoS via repeated wildcards (high)

**Remediation via `package.json` overrides:**

```json
"overrides": {
  "@angular-devkit/core": { "ajv": "^8.18.0" },
  "minimatch": "^10.2.2",
  "karma":          { "minimatch": "3.1.2" },
  "karma-coverage": { "minimatch": "3.1.2" }
}
```

| CVE | Resolved? | Notes |
|---|---|---|
| GHSA-2g4f-4pwh-qvx6 (`ajv`) | ✅ | Scoped to `@angular-devkit/core` only — a global override breaks ESLint, which uses `ajv@^6` with the `missingRefs` option and `_opts` property removed in v8 |
| GHSA-3ppc-4f35-3m26 (`minimatch`) in `eslint`, `@eslint/*`, `@typescript-eslint/*` | ✅ | Global override to `^10.2.2` |
| GHSA-3ppc-4f35-3m26 (`minimatch`) in `karma` / `karma-coverage` | ❌ | Cannot upgrade — see below |

**Why `karma`/`karma-coverage` cannot use `minimatch@10`:**
Both packages call `minimatch(path, pattern)` as a **function** (`mm(path, pattern, {dot:true})`).
In `minimatch@10` the default export is a plain object; the callable was renamed to `minimatch.minimatch()`.
Forcing v10 causes `TypeError: mm is not a function`, crashing the test runner.
`karma@6.4.4` is the **latest published version** — no upstream fix exists yet.
Using `npm audit fix --force` would downgrade `@angular-devkit/build-angular` to v10 (Angular 10), which is not acceptable.

**Final audit result:** `7 high vulnerabilities` (all `devDependencies`, karma chain only)
`npm audit --omit=dev` → **0 vulnerabilities** ✅

---

## Final test results

| Test | Result |
|---|---|
| `npm run build.prod` | ✅ PASSED |
| `npm run lint` | ✅ PASSED |
| `npm test` | ✅ PASSED — 169/169 (Chrome Headless 145) |
