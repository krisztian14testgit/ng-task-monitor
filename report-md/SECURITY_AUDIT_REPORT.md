# NPM Dependency Security Audit Report

**Project**: ng-task-monitor v2.3.2  
**Date**: April 12, 2026 
**AI model**: Claude Opus 4.6 
**Audited Packages**: 38 direct (15 prod + 23 dev) | 1,236 total (incl. transitive)  
**Overall Risk Level**: LOW (all known CVEs already patched)

---

## Executive Summary

| Check | Result |
|-------|--------|
| `npm audit` | **0 vulnerabilities** (info: 0, low: 0, moderate: 0, high: 0, critical: 0) |
| Registry integrity | All packages resolve to `https://registry.npmjs.org/` |
| Lock file integrity | All packages have SHA-512 integrity hashes |
| Malicious install scripts | None detected (5 packages have legitimate build/download scripts) |
| Typosquatting | No suspicious package names found |
| Supply-chain attacks | No evidence of backdoors or compromised packages |
| Known CVEs | **All 6 Angular advisories already patched** in v21.2.8 |

---

## 1. Angular Framework Security Advisories (All Patched)

Your Angular version **21.2.8** already includes fixes for all published advisories. No action needed.

| Advisory | CVE | Severity | Patched In | Your Version | Status |
|----------|-----|----------|------------|--------------|--------|
| [GHSA-g93w-mfhg-p222](https://github.com/angular/angular/security/advisories/GHSA-g93w-mfhg-p222) — XSS in i18n attribute bindings | CVE-2026-32635 | High (8.6) | 21.2.4 | 21.2.8 | **PATCHED** |
| [GHSA-prjf-86w9-mfqv](https://github.com/angular/angular/security/advisories/GHSA-prjf-86w9-mfqv) — XSS in Angular i18n (ICU) | CVE-2026-27970 | High (7.6) | 21.2.0 | 21.2.8 | **PATCHED** |
| [GHSA-jrmj-c5cx-3cw6](https://github.com/angular/angular/security/advisories/GHSA-jrmj-c5cx-3cw6) — SVG Script Attributes XSS | CVE-2026-22610 | High (8.5) | 21.0.7 | 21.2.8 | **PATCHED** |
| [GHSA-v4hv-rgfq-gp49](https://github.com/angular/angular/security/advisories/GHSA-v4hv-rgfq-gp49) — SVG Animation / MathML XSS | CVE-2025-66412 | High (8.5) | 21.0.2 | 21.2.8 | **PATCHED** |
| [GHSA-58c5-g7wp-6w37](https://github.com/angular/angular/security/advisories/GHSA-58c5-g7wp-6w37) — XSRF Token Leakage via Protocol-Relative URLs | CVE-2025-66035 | High (7.7) | 21.0.1 | 21.2.8 | **PATCHED** |
| [GHSA-68x2-mx4q-78m7](https://github.com/angular/angular/security/advisories/GHSA-68x2-mx4q-78m7) — SSR Race Condition Data Leakage | N/A | High | 18.2.6 | 21.2.8 | **PATCHED** (SSR not used) |

---

## 2. Production Dependencies Analysis

| Package | Version | Risk | Notes |
|---------|---------|------|-------|
| `@angular/*` (10 packages) | 21.2.8 | **None** | All advisories patched, maintained by Google |
| `@angular/cdk` | 21.2.6 | **None** | Clean, maintained by Angular team |
| `@angular/material` | 21.2.6 | **None** | Clean, maintained by Angular team |
| `chart.js` | 4.5.1 | **None** | Canvas-based (lower XSS surface than SVG libs) |
| `ng2-charts` | 10.0.0 | **None** | Thin wrapper over chart.js, 2 dep levels deep |
| `rxjs` | 7.8.2 | **None** | Stable release, Apache-2.0 licensed |
| `tslib` | 2.8.1 | **None** | Minimal attack surface (TS runtime helpers) |
| `zone.js` | 0.16.1 | **None** | Maintained by Angular team; monkey-patching is architectural, not a CVE |

**Production verdict**: All 15 production dependencies are clean.

---

## 3. Dev Dependencies Analysis

| Package | Version | Risk | Notes |
|---------|---------|------|-------|
| `@angular-devkit/build-angular` | 21.2.7 | **None** | Official Angular build tooling |
| `@angular-eslint/*` (5 packages) | 21.3.1 | **None** | Clean, static analysis only |
| `@angular/cli` | 21.2.7 | **None** | Official CLI |
| `@angular/compiler-cli` | 21.2.8 | **None** | Official compiler |
| `@eslint/js` | 10.0.1 | **None** | Clean |
| `@types/jasmine` | 6.0.0 | **None** | Type definitions only (zero runtime risk) |
| `@types/node` | 25.6.0 | **None** | Type definitions only |
| `@typescript-eslint/*` (2 packages) | 8.58.1 | **None** | Clean, actively maintained |
| `eslint` | 10.2.0 | **None** | Clean, well-maintained |
| `globals` | 17.5.0 | **None** | Clean, minimal package |
| `jasmine-core` | 6.1.0 | **Low** | Outdated (6.2.0 available), no known CVEs |
| `karma` | 6.4.4 | **Medium** | See Section 4 — Deprecated |
| `karma-chrome-launcher` | 3.2.0 | **None** | Clean |
| `karma-coverage` | 2.2.1 | **None** | Clean |
| `karma-jasmine` | 5.1.0 | **None** | Clean |
| `karma-jasmine-html-reporter` | 2.2.0 | **None** | Clean |
| `puppeteer` | 24.37.5 | **Low** | Outdated (24.40.0 available), large binary download but signed by Google |
| `typescript` | 6.0.2 | **None** | Clean, Microsoft-maintained with provenance signing |
| `webpack` | 5.106.1 | **None** | Clean, actively maintained |

---

## 4. Key Findings & Recommendations

### FINDING 1: Karma is Deprecated (Medium Risk)

**Package**: `karma@6.4.4`  
**Issue**: Karma is officially deprecated by the Angular team. While no direct CVEs exist in this version, the lack of active maintenance means future vulnerabilities will not be patched.  
**Transitive dependencies**: `socket.io@4.8.3` (safe — the known DoS advisories GHSA-677m-j7p3-52f9 and GHSA-25hc-qcg6-38wj are fixed in 4.8.1+).

**Recommendation**: Migrate to **Jest** or **Web Test Runner** within 6-12 months.

---

### FINDING 2: minimatch Override for Karma (Informational)

**Override**: `karma → minimatch: 3.1.5` and `karma-coverage → minimatch: 3.1.5`  
**Reason**: Karma depends on `glob@7.2.3` which pulls `minimatch@3.x`. Older minimatch versions (<3.0.5) had ReDoS vulnerability (CVE-2022-3517). Version 3.1.5 is safe.  
**Global override**: `minimatch: ^10.2.2` — resolved to 10.2.5 for modern packages. This is correct.

**No action needed.** Overrides are correctly configured.

---

### FINDING 3: Minor Version Lag (Low Risk)

| Package | Current | Latest | Priority |
|---------|---------|--------|----------|
| `jasmine-core` | 6.1.0 | 6.2.0 | Low |
| `puppeteer` | 24.37.5 | 24.40.0 | Low |

**Recommendation**: Update on next dependency maintenance cycle. No security urgency.

---

## 5. Install Script Analysis

Only 5 packages have lifecycle scripts — all are legitimate:

| Package | Script Type | Purpose | Risk |
|---------|-------------|---------|------|
| `@parcel/watcher@2.5.6` | install | Native file watcher module build | **None** — official Parcel tooling |
| `esbuild@0.27.3` | postinstall | Downloads platform-specific binary | **None** — official esbuild |
| `lmdb@3.5.1` | install | Optional native module build | **None** — well-known DB package |
| `msgpackr-extract@3.0.3` | install | Optional native module build | **None** — msgpack serialization |
| `puppeteer@24.37.5` | postinstall | Downloads Chromium binary | **None** — official Google package |

No suspicious `preinstall` hooks, no crypto-miners, no exfiltration scripts detected.

---

## 6. Supply Chain & Integrity Checks

| Check | Result |
|-------|--------|
| Non-npm registry URLs in lock file | **None** — all resolve to `registry.npmjs.org` |
| Missing integrity hashes | **None** — all 1,236 packages have SHA-512 hashes |
| Typosquatting detection | **Clean** — all package names are official/well-known |
| Deprecated transitive dependencies | **None detected** in direct dependency tree |
| Known backdoor patterns (event-stream, ua-parser-js, colors.js style) | **None detected** |

---

## 7. Application-Level Security Observations

Your `SafeHtmlPipe` and `SanitizeService` correctly use Angular's `DomSanitizer` with `SecurityContext.HTML` — this is the recommended approach. No `bypassSecurityTrustHtml()` bypasses were detected in these files.

---

## 8. Recommended Actions

### Immediate (No Urgency — Informational)
- [x] `npm audit` passes with 0 vulnerabilities
- [x] All Angular CVEs already patched in v21.2.8
- [x] socket.io@4.8.3 is safe (≥4.8.1 required)
- [x] Package-lock integrity verified

### Short-term (Next Sprint)
- [ ] Update `jasmine-core` to 6.2.0
- [ ] Update `puppeteer` to 24.40.0
- [ ] Add `npm audit --audit-level=moderate` to CI pipeline

### Medium-term (3-6 Months)
- [ ] Plan migration from Karma to Jest or Web Test Runner
- [ ] Enable Content Security Policy (CSP) headers in production
- [ ] Consider enabling [Trusted Types](https://angular.dev/best-practices/security#enforcing-trusted-types)

### Long-term (12 Months)
- [ ] Complete Karma removal
- [ ] Track Angular 22 upgrade timeline
- [ ] Monitor webpack 6 release for migration planning

---

## Conclusion

**No malicious packages, backdoors, or unpatched vulnerabilities detected.** The dependency tree is healthy and well-maintained. The primary maintenance concern is the deprecated Karma test runner, which should be migrated away from in upcoming development cycles.
