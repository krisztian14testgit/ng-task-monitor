# Latest Dependencies Update Report

## Date: 2026-02-21

## Goal
Upgrade all outdated dependencies detected by `npm-check-updates (ncu)` and reach **0 vulnerabilities** after `npm audit`.

---

## ncu Scan Results (before update)

Running `ncu` (without `-u`) revealed the following outdated packages:

| Package | From | To |
|---|---|---|
| `@angular-devkit/build-angular` | `^21.1.2` | `^21.1.4` |
| `@angular/animations` | `~21.1.2` | `~21.1.5` |
| `@angular/cdk` | `~21.1.2` | `~21.1.5` |
| `@angular/cli` | `~21.1.2` | `~21.1.4` |
| `@angular/common` | `~21.1.2` | `~21.1.5` |
| `@angular/compiler` | `~21.1.2` | `~21.1.5` |
| `@angular/compiler-cli` | `~21.1.2` | `~21.1.5` |
| `@angular/core` | `~21.1.2` | `~21.1.5` |
| `@angular/forms` | `~21.1.2` | `~21.1.5` |
| `@angular/material` | `~21.1.2` | `~21.1.5` |
| `@angular/platform-browser` | `~21.1.2` | `~21.1.5` |
| `@angular/platform-browser-dynamic` | `~21.1.2` | `~21.1.5` |
| `@angular/router` | `~21.1.2` | `~21.1.5` |
| `@types/node` | `^25.1.0` | `^25.3.0` |
| `@typescript-eslint/eslint-plugin` | `^8.54.0` | `^8.56.0` |
| `@typescript-eslint/parser` | `^8.54.0` | `^8.56.0` |
| `eslint` | `^9.39.2` | `^10.0.1` |
| `globals` | `^17.2.0` | `^17.3.0` |
| `puppeteer` | `~24.36.1` | `~24.37.5` |
| `zone.js` | `~0.16.0` | `~0.16.1` |

---

## Step 1 — Angular Packages Update ✅ SUCCESS

**Packages updated:**

| Package | From | To |
|---|---|---|
| `@angular/animations` | `~21.1.2` | `~21.1.5` |
| `@angular/cdk` | `~21.1.2` | `~21.1.5` |
| `@angular/common` | `~21.1.2` | `~21.1.5` |
| `@angular/compiler` | `~21.1.2` | `~21.1.5` |
| `@angular/core` | `~21.1.2` | `~21.1.5` |
| `@angular/forms` | `~21.1.2` | `~21.1.5` |
| `@angular/material` | `~21.1.2` | `~21.1.5` |
| `@angular/platform-browser` | `~21.1.2` | `~21.1.5` |
| `@angular/platform-browser-dynamic` | `~21.1.2` | `~21.1.5` |
| `@angular/router` | `~21.1.2` | `~21.1.5` |
| `zone.js` | `~0.16.0` | `~0.16.1` |
| `@angular-devkit/build-angular` | `^21.1.2` | `^21.1.4` |
| `@angular/cli` | `~21.1.2` | `~21.1.4` |
| `@angular/compiler-cli` | `~21.1.2` | `~21.1.5` |

**Test results after update:**

| Test | Result |
|---|---|
| `npm run build.prod` | ✅ PASSED |
| `npm run lint` | ✅ PASSED |
| `npm test` | ✅ PASSED (169/169 tests) |

---

## Step 2 — ESLint Bundles Update ⚠️ PARTIAL SUCCESS

### Successfully updated

| Package | From | To |
|---|---|---|
| `@typescript-eslint/eslint-plugin` | `^8.54.0` | `^8.56.0` |
| `@typescript-eslint/parser` | `^8.54.0` | `^8.56.0` |
| `globals` | `^17.2.0` | `^17.3.0` |
| `@types/node` | `^25.1.0` | `^25.3.0` |
| `eslint` | `^9.39.2` | `^9.39.3` |

Additionally, `@eslint/js` was added as an explicit `devDependency` at `^9.39.3` because `eslint.config.js` imports it directly (`require('@eslint/js')`), and it was previously only available as a deeply nested transitive dependency of `eslint` — which was not reliably hoisted to the root `node_modules`.

### Failed to update

| Package | ncu Suggested | Installed | Reason |
|---|---|---|---|
| `eslint` | `^10.0.1` | `^9.39.3` | ❌ Blocked by peer-dependency conflict |

**Why `eslint` cannot be upgraded to v10:**

ESLint 10 is a **major breaking release** with several incompatible changes:
- It requires **Node.js `>=20.19.0 || >=22.13.0 || >=24`** (the environment satisfies this)
- It **drops `@eslint/js`** from its own bundle — `@eslint/js@10.x` must be installed separately
- Most critically, all `@angular-eslint/*` packages (`^21.2.0`) declare the peer dependency `eslint: "^8.57.0 || ^9.0.0"`, **excluding v10**
- Attempting `eslint@^10` caused ESLint to fail with `TypeError: Cannot read properties of null (reading '__addVariables')` — an internal incompatibility with the `@angular-eslint` template parser at runtime

Until `@angular-eslint` publishes a release that declares support for `eslint@^10`, upgrading ESLint beyond v9.x is not possible without breaking `npm run lint`.

**Test results after update:**

| Test | Result |
|---|---|
| `npm run build.prod` | ✅ PASSED |
| `npm run lint` | ✅ PASSED |
| `npm test` | ✅ PASSED (169/169 tests) |

---

## Step 3 — Puppeteer Update ✅ SUCCESS

| Package | From | To |
|---|---|---|
| `puppeteer` | `~24.36.1` | `~24.37.5` |

Puppeteer was updated without issues. The new version downloaded Chrome 145 and the test runner continued to work correctly.

**Test results after update:**

| Test | Result |
|---|---|
| `npm run build.prod` | ✅ PASSED |
| `npm run lint` | ✅ PASSED |
| `npm test` | ✅ PASSED (169/169 tests, Chrome Headless 145) |

---

## Step 4 — Security Vulnerability Remediation ⚠️ PARTIAL SUCCESS

### Vulnerability baseline (before remediation)

`npm audit` reported **30 vulnerabilities (7 moderate, 23 high)** from two CVEs:

| CVE | Package | Severity | Description |
|---|---|---|---|
| GHSA-2g4f-4pwh-qvx6 | `ajv` `<8.18.0` | Moderate | ReDoS via `$data` option |
| GHSA-3ppc-4f35-3m26 | `minimatch` `<10.2.1` | High | ReDoS via repeated wildcards |

### Remediation: npm `overrides`

Since the vulnerable packages are pulled in as transitive dependencies, direct `npm install` cannot fix them. The `overrides` section in `package.json` was used to force safe versions:

```json
"overrides": {
  "@angular-devkit/core": {
    "ajv": "^8.18.0"
  },
  "minimatch": "^10.2.2",
  "karma": {
    "minimatch": "3.1.2"
  },
  "karma-coverage": {
    "minimatch": "3.1.2"
  }
}
```

**Why the `ajv` override is scoped to `@angular-devkit/core` only:**
A global `ajv` override to `^8.18.0` breaks ESLint. Both `eslint` and `@eslint/eslintrc` depend on `ajv@^6.x`, and they use the `missingRefs` constructor option along with the `_opts` internal property — APIs that do not exist in `ajv@8`. Scoping the override to `@angular-devkit/core` (the only package that uses `ajv@8`) leaves ESLint's private `ajv@6` copies intact.

**Why `karma` and `karma-coverage` keep `minimatch@3.1.2`:**
Both packages call `minimatch(path, pattern)` directly as a **function** (e.g., `mm(path, pattern, { dot: true })`). In `minimatch@10`, the default export is a plain object — the callable function was renamed to `minimatch.minimatch()`. Forcing `minimatch@10` into karma causes a runtime `TypeError: mm is not a function`, breaking the test runner.

### Vulnerabilities resolved vs. remaining

| Status | Vulnerability | Package | Notes |
|---|---|---|---|
| ✅ Resolved | GHSA-2g4f-4pwh-qvx6 | `ajv` in `@angular-devkit/core` | Overridden to `^8.18.0` |
| ✅ Resolved | GHSA-3ppc-4f35-3m26 | `minimatch` in `eslint`, `@eslint/*`, `@typescript-eslint/*` | Overridden to `^10.2.2` |
| ❌ Unresolved | GHSA-3ppc-4f35-3m26 | `minimatch` in `karma@6.4.4` | Cannot upgrade — API break |
| ❌ Unresolved | GHSA-3ppc-4f35-3m26 | `minimatch` in `karma-coverage@2.2.1` | Cannot upgrade — API break |

### Final `npm audit` result

```
7 high severity vulnerabilities  (all in devDependencies, all in karma chain)
```

All remaining vulnerabilities are **developer-tooling only** (test runner). They do not affect the production build or any shipped code.

**Production dependencies audit:**
```
npm audit --omit=dev
found 0 vulnerabilities
```

---

## Final Verification Results

All three required test cases pass after the complete update:

### 1. `npm run build.prod` ✅ PASSED

```
Build at: 2026-02-21T17:46:12.252Z - Hash: b21ee5c051bb978e - Time: 21958ms
Warning: bundle initial exceeded maximum budget. Budget 1.00 MB was not met by 216.17 kB with a total of 1.22 MB.
```

> The budget warning is pre-existing and not related to the dependency update.

### 2. `npm run lint` ✅ PASSED

```
Linting "ng-task-monitor"...
All files pass linting.
```

### 3. `npm test` ✅ PASSED

```
Chrome Headless 145.0.0.0 (Linux 0.0.0): Executed 169 of 170 (skipped 1) SUCCESS
TOTAL: 169 SUCCESS
```

---

## Why 0 Vulnerabilities Could Not Be Achieved

The 7 remaining high-severity vulnerabilities all trace back to `minimatch <10.2.1` inside `karma@6.4.4` and `karma-coverage@2.2.1`. Here is a precise explanation for why they cannot be resolved:

1. **`karma@6.4.4` is the latest published version** — no newer release exists that updates the `minimatch` dependency.

2. **`minimatch` made a breaking API change** between v3.x and v10.x:
   - `v3.x`: `minimatch` was exported as a **callable function** — `const mm = require('minimatch'); mm(path, pattern)`.
   - `v10.x`: the default export is a **plain object**; the function became `minimatch.minimatch(path, pattern)`.
   - karma calls `mm(path, pattern, ...)` in `file-list.js`, `preprocessor.js`, and `watcher.js` — forcing v10 causes `TypeError: mm is not a function` and the test suite cannot start.

3. **`npm audit fix --force`** would install `@angular-devkit/build-angular@0.1002.1` (Angular 10!) to satisfy the audit, which is a completely incompatible breaking change and would destroy the project.

4. **The vulnerability is in `devDependencies` only** — it does not affect the production bundle or any end-user code. The attack surface requires an adversary to be able to supply crafted glob patterns to the local karma process during development.

**Recommended future path:** Once the Karma project releases a version that replaces its `minimatch@^3` dependency with `minimatch@^10` (or an equivalent like `picomatch`), the remaining 7 vulnerabilities will be automatically resolved by upgrading `karma`.
