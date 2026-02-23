# Electron Dependencies Upgrade Report

**Date**: February 2026  
**Branch**: `copilot/update-electron-dependencies` → `inElectronJs`  
**Goal**: Reach 0 vulnerabilities via `npm audit` on the Electron bundle and its related dependencies

---

## Initial State

**Before this upgrade**: 42 high severity vulnerabilities were reported by `npm audit`.

The vulnerabilities were found in two major groups:
1. **Electron packaging chain** – `@electron-forge/*`, `@electron/rebuild`, `@electron/packager`, `@electron/asar`, `@electron/universal`, `electron-winstaller`, `electron-installer-*`
2. **Angular build tooling** – `@angular/cli`, `@angular/build`, `@angular-devkit/build-angular`, `karma`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`

All 42 vulnerabilities were traced back to three root-cause packages: `tar`, `minimatch` (via `glob` and `rimraf`), and `tmp`.

---

## Commits Applied

| Commit | Summary |
|--------|---------|
| `f81853f` | Updated `tar` override to 7.5.9, added `glob`/`rimraf` overrides, removed karma minimatch pinning, attempted electron major-version overrides |
| `297a710` | Reverted the electron major-version overrides (`@electron/packager`, `@electron/rebuild`, `@electron/asar`, `@electron/universal`) that caused a CI build failure (`TypeError: done is not a function`) |

---

## Changes Made to `package.json` Overrides

### Updated
| Package | Before | After | Advisory Fixed |
|---------|--------|-------|---------------|
| `tar` | `7.5.7` | `7.5.9` | GHSA-83g3-92jg-28cx: Arbitrary File Read/Write via Hardlink Target Escape (`< 7.5.8`) |

### Added
| Package | Version Added | Vulnerability Fixed |
|---------|---------------|---------------------|
| `glob` | `^11.0.3` | GHSA-3ppc-4f35-3m26: minimatch ReDoS via glob chain (`3.0.0–10.5.0`) |
| `rimraf` | `^6.1.3` | Vulnerable rimraf via glob dependency chain (`2.3.0–3.0.2`, `4.2.0–5.0.10`) |

### Removed
| Override Removed | Reason |
|-----------------|--------|
| `"karma": { "minimatch": "3.1.2" }` | Was pinning a vulnerable minimatch version. Karma is deprecated since Angular 16 and not recommended for Angular 21+. The global `minimatch: "^10.2.2"` override now applies universally. |
| `"karma-coverage": { "minimatch": "3.1.2" }` | Same as above. |

---

## Succeeded: All 42 Vulnerabilities Resolved

### `npm audit` result after upgrade: 0 vulnerabilities ✅

All 42 high severity vulnerabilities were eliminated. Below is the full breakdown:

#### Electron Bundle (Primary Target)

| Vulnerable Package | Root Cause | Fix Applied |
|--------------------|------------|-------------|
| `@electron-forge/cli` | via `tar`, `glob`, `rimraf` chains | Fixed via `tar`/`glob`/`rimraf` overrides |
| `@electron-forge/core` | via `tar`, `glob`, `rimraf` chains | Fixed via `tar`/`glob`/`rimraf` overrides |
| `@electron-forge/core-utils` | via `@electron/rebuild` → `tar` | Fixed via `tar` override |
| `@electron-forge/shared-types` | via `@electron/rebuild` → `tar` | Fixed via `tar` override |
| `@electron-forge/maker-*` (4 packages) | via `@electron-forge/shared-types` | Fixed via `tar` override |
| `@electron/rebuild` | via `@electron/node-gyp` → `tar` and `glob` | Fixed via `tar`/`glob` overrides |
| `@electron/node-gyp` | via `tar`, `glob`, `make-fetch-happen` | Fixed via `tar`/`glob` overrides |
| `@electron/asar` | via `glob` | Fixed via `glob` override |
| `@electron/packager` | via `glob`, `tar` | Fixed via `glob`/`tar` overrides |
| `@electron/universal` | via `@electron/asar` → `glob` | Fixed via `glob` override |
| `electron-winstaller` | via `@electron/asar`, `temp` → `rimraf` | Fixed via `glob`/`rimraf` overrides |
| `electron-installer-common` | via `@electron/asar`, `glob` | Fixed via `glob` override |
| `electron-installer-debian` | via `electron-installer-common` | Fixed via `glob` override |
| `electron-installer-redhat` | via `electron-installer-common` | Fixed via `glob` override |

#### Angular / Build Tooling (Secondary)

| Vulnerable Package | Root Cause | Fix Applied |
|--------------------|------------|-------------|
| `@angular/cli` | via `pacote` → `tar` | Fixed via `tar` override |
| `@angular/build` | via `karma` → `minimatch` | Fixed by removing karma minimatch pin |
| `@angular-devkit/build-angular` | via `karma` → `minimatch` | Fixed by removing karma minimatch pin |
| `pacote` | via `tar` | Fixed via `tar` override |
| `karma` | via `minimatch` (was pinned to 3.1.2) | Fixed by removing pin; now uses `minimatch 10.x` |
| `karma-coverage` | via `minimatch` (was pinned to 3.1.2) | Fixed by removing pin; now uses `minimatch 10.x` |
| `karma-jasmine` | via `karma` | Fixed via karma fix |
| `karma-jasmine-html-reporter` | via `karma`, `karma-jasmine` | Fixed via karma fix |

#### Transitive Dependencies

| Vulnerable Package | Root Cause | Fix Applied |
|--------------------|------------|-------------|
| `tar` | GHSA-83g3-92jg-28cx (< 7.5.8) | Overridden to `7.5.9` |
| `minimatch` | GHSA-3ppc-4f35-3m26 (< 10.2.1) | Global override to `^10.2.2` |
| `glob` | Via minimatch chain (`3.0.0–10.5.0`) | Overridden to `^11.0.3` |
| `rimraf` | Via glob chain (`2.3.0–3.0.2`, `4.2.0–5.0.10`) | Overridden to `^6.1.3` |
| `cacache` | Via glob/rimraf chain | Fixed via `glob`/`rimraf` overrides |
| `make-fetch-happen` | Via cacache chain | Fixed via `glob`/`rimraf` overrides |
| `@npmcli/move-file` | Via rimraf chain | Fixed via `rimraf` override |
| `node-gyp` | Via tar chain | Fixed via `tar` override |
| `temp` | Via rimraf chain | Fixed via `rimraf` override |

---

## Not Solved / Known Issues

### Karma Tests (Side Effect)

Removing the `"karma": { "minimatch": "3.1.2" }` override means karma now receives `minimatch 10.x`. The `minimatch 10.x` API is no longer a callable function — the legacy `minimatch('pattern', 'str')` call breaks. As a result:

- **`npm test` will fail** when attempting to run karma-based unit tests
- **Root cause**: The only way to keep karma working is to re-add the `"karma": { "minimatch": "3.1.2" }` override, but doing so reintroduces the minimatch vulnerability
- **Why not fixed**: There is no version of karma (latest: 6.4.4) that supports `minimatch ≥ 10.x`. The karma project is no longer actively maintained and has no planned update for this API change.

**Recommendation**: Migrate unit tests from Karma/Jasmine to **Vitest**, the official Angular test runner replacement. See the [Angular migration guide](https://angular.dev/guide/testing/migrating-to-vitest).

> **Note**: This does NOT affect the `inElectronJs` CI workflow, which only runs lint, build, package, and make — not karma tests.

### Attempted But Reverted: Electron Major Version Overrides

In commit `f81853f`, the following overrides were added to force newer major versions of vulnerable electron packages:

| Package | Attempted Version | Issue |
|---------|------------------|-------|
| `@electron/packager` | `^19.0.5` | Broke `@electron-forge@7.11.1`: `TypeError: done is not a function` at `@electron-forge/core/dist/api/package.js:76`. Packager 19.x removed the callback `done` from hook functions, which electron-forge 7.x still expects. |
| `@electron/rebuild` | `^4.0.3` | Reverted along with packager to restore CI build |
| `@electron/asar` | `^4.0.1` | Reverted along with packager to restore CI build |
| `@electron/universal` | `^3.0.2` | Reverted along with packager to restore CI build |

These overrides were removed in commit `297a710`. The vulnerability chains for these packages are fully resolved by the `glob`, `tar`, and `rimraf` overrides, so the electron packages remain at their versions compatible with `@electron-forge@7.x`:

| Package | Current Version | Compatible With |
|---------|----------------|-----------------|
| `@electron/packager` | 18.4.4 | `@electron-forge@7.x` |
| `@electron/rebuild` | 3.7.2 | `@electron-forge@7.x` |
| `@electron/asar` | 3.4.1 | `@electron-forge@7.x` |
| `@electron/universal` | 2.0.3 | `@electron-forge@7.x` |

**Resolution path**: To upgrade these electron packages to 19.x/4.x, `@electron-forge` would also need to be upgraded to 8.x (currently in alpha). This is a separate, larger upgrade task.

---

## Final `npm audit` Result

```
found 0 vulnerabilities
```

**Result: 0 vulnerabilities** ✅
