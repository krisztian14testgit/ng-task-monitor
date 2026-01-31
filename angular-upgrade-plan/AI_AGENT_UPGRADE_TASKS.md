# AI Agent Task Templates for Angular v14 → v21 Upgrade

This document contains ready-to-use task templates for AI agents to execute the Angular upgrade process step-by-step. Each task is designed to be independent and includes verification steps.

---

## Task Template Format

Each task includes:
- **Task ID**: Unique identifier
- **Dependencies**: Previous tasks that must be completed
- **Objective**: Clear goal statement
- **Instructions**: Step-by-step actions
- **Verification**: How to confirm success
- **Rollback**: How to undo if needed

---

## Pre-Upgrade Tasks

### Task PRE-001: Repository Backup and Preparation

**Dependencies**: None  
**Objective**: Create backup and prepare repository for upgrade  
**Estimated Time**: 10 minutes

**Instructions**:
1. Verify current branch is clean: `git status`
2. Create backup tag: `git tag -a v14.2.8-pre-upgrade -m "Backup before Angular v21 upgrade"`
3. Push tag: `git push origin v14.2.8-pre-upgrade`
4. Create upgrade branch: `git checkout -b upgrade/angular-v21`
5. Document current state:
   - Run: `npm list --depth=0 > pre-upgrade-dependencies.txt`
   - Run: `npm run build.prod` and note build time
   - Run: `npm run test` and note test results

**Verification**:
- [ ] Tag created successfully
- [ ] New branch created
- [ ] `pre-upgrade-dependencies.txt` file exists
- [ ] Current build and test pass

**Rollback**: `git checkout main && git branch -D upgrade/angular-v21`

---

### Task PRE-002: Audit Current Dependencies

**Dependencies**: PRE-001  
**Objective**: Check for security vulnerabilities and outdated packages  
**Estimated Time**: 5 minutes

**Instructions**:
1. Run security audit: `npm audit > pre-upgrade-audit.txt`
2. Check for outdated packages: `npm outdated > pre-upgrade-outdated.txt`
3. Review and document any critical vulnerabilities
4. Verify no uncommitted changes: `git status`

**Verification**:
- [ ] Audit report generated
- [ ] Outdated packages documented
- [ ] No blocking vulnerabilities (or documented)

**Rollback**: N/A (information gathering only)

---

### Task PRE-003: Install Angular CLI Globally

**Dependencies**: PRE-002  
**Objective**: Ensure latest Angular CLI is available  
**Estimated Time**: 5 minutes

**Instructions**:
1. Check current CLI version: `ng version`
2. Install latest CLI globally: `npm install -g @angular/cli@latest`
3. Verify installation: `ng version`
4. Document CLI version in upgrade notes

**Verification**:
- [ ] Angular CLI v21+ installed globally
- [ ] `ng version` command works
- [ ] CLI version documented

**Rollback**: `npm install -g @angular/cli@14`

---

## Phase 1: Angular v14 → v15

### Task P1-001: Update Angular Core to v15

**Dependencies**: PRE-003  
**Objective**: Upgrade Angular framework from v14 to v15  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Angular update command:
   ```bash
   ng update @angular/core@15 @angular/cli@15 --force
   ```
2. Review migration output and warnings
3. If prompted, accept automatic migrations
4. Install dependencies: `npm install`
5. Check for peer dependency warnings

**Verification**:
- [ ] package.json shows Angular 15.x versions
- [ ] npm install completes without errors
- [ ] Migration scripts executed successfully

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P1-002: Update Angular Material to v15

**Dependencies**: P1-001  
**Objective**: Update Material Design components to v15  
**Estimated Time**: 20 minutes

**Instructions**:
1. Run Material update:
   ```bash
   ng update @angular/material@15
   ```
2. Review migration schematic output
3. Check for legacy component warnings
4. Install dependencies: `npm install`

**Verification**:
- [ ] @angular/material v15 in package.json
- [ ] @angular/cdk v15 in package.json
- [ ] No installation errors

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P1-003: Update TypeScript to v4.9

**Dependencies**: P1-002  
**Objective**: Update TypeScript for v15 compatibility  
**Estimated Time**: 15 minutes

**Instructions**:
1. Update TypeScript:
   ```bash
   npm install --save-dev typescript@~4.9.5
   ```
2. Update @types/node:
   ```bash
   npm install --save-dev @types/node@^18.0.0
   ```
3. Run type check: `npx tsc --noEmit`
4. Fix any type errors that appear

**Verification**:
- [ ] TypeScript v4.9.x installed
- [ ] Type check passes or errors documented
- [ ] No critical type errors

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P1-004: Migrate Polyfills to main.ts

**Dependencies**: P1-003  
**Objective**: Remove deprecated polyfills.ts file  
**Estimated Time**: 20 minutes

**Instructions**:
1. Open `src/main.ts`
2. Add at the top:
   ```typescript
   import 'zone.js';
   ```
3. Check `src/polyfills.ts` for any custom polyfills
4. Move any custom polyfills to `main.ts`
5. Update `angular.json`:
   - Remove `"polyfills": "src/polyfills.ts"` from build options
   - Remove `"polyfills": "src/polyfills.ts"` from test options
6. Update `tsconfig.app.json`:
   - Remove `"src/polyfills.ts"` from files array
7. Update `tsconfig.spec.json`:
   - Remove `"src/polyfills.ts"` from files array
8. Delete `src/polyfills.ts` file

**Verification**:
- [ ] zone.js imported in main.ts
- [ ] polyfills.ts removed from all config files
- [ ] Build succeeds: `npm run build.prod`
- [ ] Dev server works: `npm start` (test briefly)

**Rollback**: 
```bash
git checkout src/main.ts src/polyfills.ts angular.json tsconfig.app.json tsconfig.spec.json
```

---

### Task P1-005: Update RxJS to v7.8

**Dependencies**: P1-004  
**Objective**: Update RxJS to latest v7.x  
**Estimated Time**: 10 minutes

**Instructions**:
1. Update RxJS:
   ```bash
   npm install rxjs@~7.8.0
   ```
2. Check for deprecated RxJS operators in code
3. Run build to verify compatibility

**Verification**:
- [ ] RxJS v7.8.x in package.json
- [ ] Build succeeds
- [ ] No RxJS deprecation warnings

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P1-006: Build and Test Angular v15

**Dependencies**: P1-005  
**Objective**: Verify v15 upgrade is successful  
**Estimated Time**: 30 minutes

**Instructions**:
1. Clean build artifacts: `rm -rf dist/ node_modules/.cache`
2. Build production: `npm run build.prod`
3. Note build time and bundle size
4. Run lint: `npm run lint`
5. Run tests: `npm run test`
6. Start dev server: `npm start`
7. Manual testing checklist:
   - [ ] Navigate to /tasks/all
   - [ ] Navigate to /statistic
   - [ ] Test theme switching
   - [ ] Test task timer countdown
   - [ ] Verify charts render

**Verification**:
- [ ] Production build succeeds
- [ ] Lint passes (or errors documented)
- [ ] Tests pass (or failures documented)
- [ ] Dev server starts without errors
- [ ] Manual tests pass

**Rollback**: Full rollback to v14 if major issues found

---

### Task P1-007: Commit Angular v15 Upgrade

**Dependencies**: P1-006  
**Objective**: Save v15 upgrade progress  
**Estimated Time**: 5 minutes

**Instructions**:
1. Review changes: `git status`
2. Add changes: `git add .`
3. Commit:
   ```bash
   git commit -m "chore: upgrade Angular v14 to v15
   
   - Updated Angular core and CLI to v15
   - Updated Angular Material to v15
   - Migrated polyfills to main.ts
   - Updated TypeScript to v4.9
   - Updated RxJS to v7.8
   - All builds and tests passing"
   ```
4. Create tag: `git tag v15-upgrade-complete`

**Verification**:
- [ ] Changes committed
- [ ] Tag created
- [ ] Git log shows commit

**Rollback**: `git reset --hard HEAD~1`

---

## Phase 2: Angular v15 → v16

### Task P2-001: Update Angular Core to v16

**Dependencies**: P1-007  
**Objective**: Upgrade Angular framework from v15 to v16  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Angular update command:
   ```bash
   ng update @angular/core@16 @angular/cli@16
   ```
2. Review migration output for ESBuild changes
3. Accept automatic migrations
4. Install dependencies: `npm install`

**Verification**:
- [ ] package.json shows Angular 16.x versions
- [ ] npm install completes
- [ ] Migration output reviewed

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P2-002: Update Angular Material to v16

**Dependencies**: P2-001  
**Objective**: Update Material to v16  
**Estimated Time**: 20 minutes

**Instructions**:
1. Run Material update:
   ```bash
   ng update @angular/material@16
   ```
2. Review MDC migration warnings
3. Install dependencies: `npm install`

**Verification**:
- [ ] @angular/material v16 installed
- [ ] Installation successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P2-003: Update TypeScript to v5.0

**Dependencies**: P2-002  
**Objective**: Update TypeScript for v16 compatibility  
**Estimated Time**: 20 minutes

**Instructions**:
1. Update TypeScript:
   ```bash
   npm install --save-dev typescript@~5.0.4
   ```
2. Run type check: `npx tsc --noEmit`
3. Fix any new type errors
4. Update tsconfig.json if needed for stricter checks

**Verification**:
- [ ] TypeScript v5.0.x installed
- [ ] Type check passes or errors documented
- [ ] Build succeeds

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P2-004: Optional - Enable ESBuild Builder

**Dependencies**: P2-003  
**Objective**: Switch to faster ESBuild-based builder  
**Estimated Time**: 30 minutes

**Instructions**:
1. Update `angular.json` build configuration:
   - Change builder from `@angular-devkit/build-angular:browser`
   - To: `@angular-devkit/build-angular:browser-esbuild`
2. Test build: `npm run build.prod`
3. Compare build times (should be faster)
4. Test dev server: `npm start`

**Note**: This is optional. Can keep old builder if issues arise.

**Verification**:
- [ ] ESBuild builder configured in angular.json
- [ ] Build succeeds with new builder
- [ ] Build time improved
- [ ] Dev server works

**Rollback**: Change builder back to `@angular-devkit/build-angular:browser`

---

### Task P2-005: Update ESLint Configuration

**Dependencies**: P2-004  
**Objective**: Update ESLint for v16 compatibility  
**Estimated Time**: 15 minutes

**Instructions**:
1. Update @angular-eslint packages:
   ```bash
   npm install --save-dev @angular-eslint/builder@16 @angular-eslint/eslint-plugin@16 @angular-eslint/eslint-plugin-template@16 @angular-eslint/template-parser@16
   ```
2. Update TypeScript ESLint:
   ```bash
   npm install --save-dev @typescript-eslint/eslint-plugin@5.62.0 @typescript-eslint/parser@5.62.0
   ```
3. Run lint: `npm run lint`
4. Fix any new lint errors

**Verification**:
- [ ] ESLint packages updated
- [ ] Lint runs successfully
- [ ] Critical errors fixed

**Rollback**: 
```bash
git checkout package.json package-lock.json .eslintrc.json
npm install
```

---

### Task P2-006: Build and Test Angular v16

**Dependencies**: P2-005  
**Objective**: Verify v16 upgrade is successful  
**Estimated Time**: 30 minutes

**Instructions**:
1. Clean build: `rm -rf dist/ node_modules/.cache`
2. Production build: `npm run build.prod`
3. Note build time (should be faster with ESBuild)
4. Run lint: `npm run lint`
5. Run tests: `npm run test`
6. Start dev server: `npm start`
7. Manual testing (same checklist as P1-006)

**Verification**:
- [ ] Production build succeeds
- [ ] Build time improved (if ESBuild enabled)
- [ ] Lint passes
- [ ] Tests pass
- [ ] Manual tests pass

**Rollback**: Rollback to v15 if critical issues

---

### Task P2-007: Commit Angular v16 Upgrade

**Dependencies**: P2-006  
**Objective**: Save v16 upgrade progress  
**Estimated Time**: 5 minutes

**Instructions**:
1. Add changes: `git add .`
2. Commit:
   ```bash
   git commit -m "chore: upgrade Angular v15 to v16
   
   - Updated Angular core and CLI to v16
   - Updated Angular Material to v16
   - Updated TypeScript to v5.0
   - Updated ESLint configuration
   - Optionally enabled ESBuild builder
   - All builds and tests passing"
   ```
3. Create tag: `git tag v16-upgrade-complete`

**Verification**:
- [ ] Committed successfully
- [ ] Tag created

**Rollback**: `git reset --hard HEAD~1`

---

## Phase 3: Angular v16 → v17

### Task P3-001: Update Angular Core to v17

**Dependencies**: P2-007  
**Objective**: Upgrade Angular framework from v16 to v17  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Angular update command:
   ```bash
   ng update @angular/core@17 @angular/cli@17
   ```
2. Review migration output (major release with new features)
3. Accept automatic migrations
4. Note: v17 introduces new application builder and SSR improvements
5. Install dependencies: `npm install`

**Verification**:
- [ ] package.json shows Angular 17.x versions
- [ ] npm install completes
- [ ] Migration successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P3-002: Update Angular Material to v17

**Dependencies**: P3-001  
**Objective**: Update Material to v17 with MDC components  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Material update:
   ```bash
   ng update @angular/material@17
   ```
2. **IMPORTANT**: v17 removes legacy components
3. Run MDC migration if not done:
   ```bash
   ng generate @angular/material:mdc-migration
   ```
4. Review and update any legacy imports
5. Install dependencies: `npm install`

**Verification**:
- [ ] @angular/material v17 installed
- [ ] MDC migration completed
- [ ] No legacy component imports remain
- [ ] Build succeeds

**Rollback**: 
```bash
git checkout package.json package-lock.json src/
npm install
```

---

### Task P3-003: Update TypeScript to v5.2

**Dependencies**: P3-002  
**Objective**: Update TypeScript for v17 compatibility  
**Estimated Time**: 20 minutes

**Instructions**:
1. Update TypeScript:
   ```bash
   npm install --save-dev typescript@~5.2.2
   ```
2. Run type check: `npx tsc --noEmit`
3. Fix any decorator-related type errors
4. Update tsconfig.json for ES2022 target if needed

**Verification**:
- [ ] TypeScript v5.2.x installed
- [ ] Type check passes
- [ ] Build succeeds

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P3-004: Migrate to New Application Builder (Optional)

**Dependencies**: P3-003  
**Objective**: Use Angular v17's new application builder  
**Estimated Time**: 45 minutes

**Instructions**:
1. Update `angular.json` build configuration:
   - Change: `@angular-devkit/build-angular:browser-esbuild`
   - To: `@angular-devkit/build-angular:application`
2. Update build options structure:
   ```json
   "browser": "src/main.ts",
   "outputPath": "dist/ng-task-monitor",
   ```
3. Remove `main` option, use `browser` instead
4. Test build: `npm run build.prod`
5. Test dev server: `npm start`

**Note**: This is optional but recommended for best performance.

**Verification**:
- [ ] New builder configured
- [ ] Build succeeds (faster build times)
- [ ] Dev server works
- [ ] App functions correctly

**Rollback**: Revert angular.json to previous builder

---

### Task P3-005: Update zone.js to v0.14

**Dependencies**: P3-004  
**Objective**: Update zone.js for v17 compatibility  
**Estimated Time**: 10 minutes

**Instructions**:
1. Update zone.js:
   ```bash
   npm install zone.js@~0.14.0
   ```
2. Verify import in main.ts is still correct
3. Test build and runtime

**Verification**:
- [ ] zone.js v0.14 installed
- [ ] Build succeeds
- [ ] App runs without zone errors

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P3-006: Update Web Worker Configuration

**Dependencies**: P3-005  
**Objective**: Ensure web worker compatibility with v17  
**Estimated Time**: 20 minutes

**Instructions**:
1. Review `tsconfig.worker.json` configuration
2. Verify worker bundling in new builder
3. Test worker functionality:
   - Navigate to tasks page
   - Verify countdown timer works
   - Check browser console for worker errors
4. Update worker code if needed for v17 APIs

**Verification**:
- [ ] Worker TypeScript config valid
- [ ] Worker builds correctly
- [ ] Worker executes in browser
- [ ] Countdown timer functions correctly

**Rollback**: Revert any worker config changes

---

### Task P3-007: Build and Test Angular v17

**Dependencies**: P3-006  
**Objective**: Verify v17 upgrade is successful  
**Estimated Time**: 30 minutes

**Instructions**:
1. Clean build: `rm -rf dist/ .angular/cache`
2. Production build: `npm run build.prod`
3. Note build time (should be significantly faster)
4. Check bundle size (should be smaller)
5. Run lint: `npm run lint`
6. Run tests: `npm run test`
7. Start dev server: `npm start`
8. Manual testing (full checklist)

**Verification**:
- [ ] Production build succeeds
- [ ] Build time improved significantly
- [ ] Bundle size reduced
- [ ] Lint passes
- [ ] Tests pass
- [ ] Manual tests pass
- [ ] Web worker functions

**Rollback**: Rollback to v16 if critical issues

---

### Task P3-008: Commit Angular v17 Upgrade

**Dependencies**: P3-007  
**Objective**: Save v17 upgrade progress  
**Estimated Time**: 5 minutes

**Instructions**:
1. Add changes: `git add .`
2. Commit:
   ```bash
   git commit -m "chore: upgrade Angular v16 to v17
   
   - Updated Angular core and CLI to v17
   - Updated Angular Material to v17 with MDC components
   - Updated TypeScript to v5.2
   - Migrated to new application builder
   - Updated zone.js to v0.14
   - Verified web worker functionality
   - All builds and tests passing"
   ```
3. Create tag: `git tag v17-upgrade-complete`

**Verification**:
- [ ] Committed successfully
- [ ] Tag created

**Rollback**: `git reset --hard HEAD~1`

---

## Phase 4: Angular v17 → v18

### Task P4-001: Update Angular Core to v18

**Dependencies**: P3-008  
**Objective**: Upgrade Angular framework from v17 to v18  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Angular update command:
   ```bash
   ng update @angular/core@18 @angular/cli@18
   ```
2. Review migration output (v18 introduces zoneless support)
3. Accept automatic migrations
4. Install dependencies: `npm install`

**Verification**:
- [ ] package.json shows Angular 18.x versions
- [ ] npm install completes
- [ ] Migration successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P4-002: Update Angular Material to v18

**Dependencies**: P4-001  
**Objective**: Update Material to v18  
**Estimated Time**: 20 minutes

**Instructions**:
1. Run Material update:
   ```bash
   ng update @angular/material@18
   ```
2. Install dependencies: `npm install`
3. Verify no breaking changes in Material components

**Verification**:
- [ ] @angular/material v18 installed
- [ ] Installation successful
- [ ] Build succeeds

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P4-003: Update TypeScript to v5.4

**Dependencies**: P4-002  
**Objective**: Update TypeScript for v18 compatibility  
**Estimated Time**: 15 minutes

**Instructions**:
1. Update TypeScript:
   ```bash
   npm install --save-dev typescript@~5.4.5
   ```
2. Run type check: `npx tsc --noEmit`
3. Fix any type errors

**Verification**:
- [ ] TypeScript v5.4.x installed
- [ ] Type check passes
- [ ] Build succeeds

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P4-004: Build and Test Angular v18

**Dependencies**: P4-003  
**Objective**: Verify v18 upgrade is successful  
**Estimated Time**: 30 minutes

**Instructions**:
1. Clean build: `rm -rf dist/ .angular/cache`
2. Production build: `npm run build.prod`
3. Run lint: `npm run lint`
4. Run tests: `npm run test`
5. Start dev server: `npm start`
6. Manual testing

**Verification**:
- [ ] Production build succeeds
- [ ] Lint passes
- [ ] Tests pass
- [ ] Manual tests pass

**Rollback**: Rollback to v17 if critical issues

---

### Task P4-005: Commit Angular v18 Upgrade

**Dependencies**: P4-004  
**Objective**: Save v18 upgrade progress  
**Estimated Time**: 5 minutes

**Instructions**:
1. Add changes: `git add .`
2. Commit:
   ```bash
   git commit -m "chore: upgrade Angular v17 to v18
   
   - Updated Angular core and CLI to v18
   - Updated Angular Material to v18
   - Updated TypeScript to v5.4
   - All builds and tests passing"
   ```
3. Create tag: `git tag v18-upgrade-complete`

**Verification**:
- [ ] Committed successfully
- [ ] Tag created

**Rollback**: `git reset --hard HEAD~1`

---

## Phase 5: Angular v18 → v19 → v20 → v21

### Task P5-001: Update Angular Core to v19

**Dependencies**: P4-005  
**Objective**: Upgrade Angular framework from v18 to v19  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Angular update command:
   ```bash
   ng update @angular/core@19 @angular/cli@19
   ```
2. Review migration output
3. Accept automatic migrations
4. Install dependencies: `npm install`

**Verification**:
- [ ] package.json shows Angular 19.x versions
- [ ] npm install completes
- [ ] Migration successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-002: Update Angular Material to v19

**Dependencies**: P5-001  
**Objective**: Update Material to v19  
**Estimated Time**: 20 minutes

**Instructions**:
1. Run Material update:
   ```bash
   ng update @angular/material@19
   ```
2. Install dependencies: `npm install`

**Verification**:
- [ ] @angular/material v19 installed
- [ ] Installation successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-003: Update Angular Core to v20

**Dependencies**: P5-002  
**Objective**: Upgrade Angular framework from v19 to v20  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Angular update command:
   ```bash
   ng update @angular/core@20 @angular/cli@20
   ```
2. Review migration output
3. Accept automatic migrations
4. Install dependencies: `npm install`

**Verification**:
- [ ] package.json shows Angular 20.x versions
- [ ] npm install completes
- [ ] Migration successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-004: Update Angular Material to v20

**Dependencies**: P5-003  
**Objective**: Update Material to v20  
**Estimated Time**: 20 minutes

**Instructions**:
1. Run Material update:
   ```bash
   ng update @angular/material@20
   ```
2. Install dependencies: `npm install`

**Verification**:
- [ ] @angular/material v20 installed
- [ ] Installation successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-005: Update Angular Core to v21 (FINAL)

**Dependencies**: P5-004  
**Objective**: Upgrade Angular framework from v20 to v21  
**Estimated Time**: 30 minutes

**Instructions**:
1. Run Angular update command:
   ```bash
   ng update @angular/core@21 @angular/cli@21
   ```
2. Review migration output carefully
3. Accept automatic migrations
4. Install dependencies: `npm install`

**Verification**:
- [ ] package.json shows Angular 21.x versions
- [ ] npm install completes
- [ ] Migration successful

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-006: Update Angular Material to v21 (FINAL)

**Dependencies**: P5-005  
**Objective**: Update Material to v21  
**Estimated Time**: 20 minutes

**Instructions**:
1. Run Material update:
   ```bash
   ng update @angular/material@21
   ```
2. Install dependencies: `npm install`
3. Verify all Material components still work

**Verification**:
- [ ] @angular/material v21 installed
- [ ] Installation successful
- [ ] Material components render correctly

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-007: Update TypeScript to v5.6 (FINAL)

**Dependencies**: P5-006  
**Objective**: Update TypeScript to latest compatible version  
**Estimated Time**: 20 minutes

**Instructions**:
1. Update TypeScript:
   ```bash
   npm install --save-dev typescript@~5.6.0
   ```
2. Run type check: `npx tsc --noEmit`
3. Fix any type errors with v5.6 strictness

**Verification**:
- [ ] TypeScript v5.6.x installed
- [ ] Type check passes
- [ ] Build succeeds

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-008: Update Remaining Dependencies

**Dependencies**: P5-007  
**Objective**: Update supporting libraries to latest versions  
**Estimated Time**: 30 minutes

**Instructions**:
1. Update Jasmine and Karma:
   ```bash
   npm install --save-dev jasmine-core@~5.1.0 karma@~6.4.0 karma-jasmine@~5.1.0
   ```
2. Update ESLint packages:
   ```bash
   npm install --save-dev @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
   ```
3. Update chart.js to v4:
   ```bash
   npm install chart.js@^4.4.0
   ```
4. Update ng2-charts (check compatibility):
   ```bash
   npm install ng2-charts@latest
   ```
   OR consider migrating to alternative if ng2-charts is outdated
5. Update puppeteer:
   ```bash
   npm install --save-dev puppeteer@latest
   ```

**Verification**:
- [ ] All dependencies updated
- [ ] npm install completes
- [ ] No peer dependency errors
- [ ] Charts still render correctly

**Rollback**: 
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task P5-009: Final Build and Test

**Dependencies**: P5-008  
**Objective**: Complete verification of Angular v21 upgrade  
**Estimated Time**: 60 minutes

**Instructions**:
1. Clean all caches:
   ```bash
   rm -rf dist/ .angular/cache node_modules/.cache
   ```
2. Production build:
   ```bash
   npm run build.prod
   ```
3. Note final build time and bundle sizes
4. Run lint:
   ```bash
   npm run lint
   ```
5. Run tests:
   ```bash
   npm run test
   ```
6. Start dev server:
   ```bash
   npm start
   ```
7. **Complete manual testing checklist**:
   - [ ] App loads without console errors
   - [ ] Navigate to /tasks/all - tasks display
   - [ ] Create new task - form works
   - [ ] Edit task - updates work
   - [ ] Delete task - removal works
   - [ ] Task timer countdown - worker functions
   - [ ] Navigate to /statistic - page loads
   - [ ] Charts render correctly with data
   - [ ] Different chart types display
   - [ ] Navigate to /location - page loads
   - [ ] Location form works
   - [ ] Theme switching (light/dark/blueDragon) works
   - [ ] Responsive design works (test different screen sizes)
   - [ ] No console errors during navigation
   - [ ] All Material components render correctly
   - [ ] Test in Chrome browser
   - [ ] Test in Firefox browser
   - [ ] Test in Safari browser (if available)

8. Performance comparison:
   - [ ] Compare build time (should be 50-90% faster)
   - [ ] Compare bundle size (should be smaller)
   - [ ] Compare dev server startup time (should be faster)

**Verification**:
- [ ] Production build succeeds
- [ ] Build time significantly improved
- [ ] Bundle size optimized
- [ ] Lint passes with no errors
- [ ] All tests pass
- [ ] Dev server starts quickly
- [ ] All manual tests pass
- [ ] No console errors
- [ ] Performance improved

**Rollback**: If critical issues, consider full rollback to v14

---

### Task P5-010: Update Documentation

**Dependencies**: P5-009  
**Objective**: Update README and documentation for v21  
**Estimated Time**: 30 minutes

**Instructions**:
1. Update `README.md`:
   - Change "Angular 14v framework" to "Angular 21v framework"
   - Update "Angular CLI version: 14.2.7" to "Angular CLI version: 21.x.x"
   - Update Node.js version requirements
   - Update any version-specific documentation
2. Update any developer documentation
3. Document breaking changes if any
4. Update package.json description if needed

**Verification**:
- [ ] README.md updated
- [ ] Version references updated
- [ ] Documentation accurate

**Rollback**: `git checkout README.md`

---

### Task P5-011: Final Commit and Tagging

**Dependencies**: P5-010  
**Objective**: Commit final Angular v21 upgrade  
**Estimated Time**: 10 minutes

**Instructions**:
1. Review all changes: `git status`
2. Add all changes: `git add .`
3. Create comprehensive commit:
   ```bash
   git commit -m "chore: complete Angular v14 to v21 upgrade
   
   Major Changes:
   - Upgraded Angular core from v14.2.8 to v21.x.x
   - Upgraded Angular Material from v14 to v21
   - Updated TypeScript from v4.8.4 to v5.6.x
   - Migrated polyfills to main.ts
   - Updated to new application builder
   - Updated zone.js to v0.14
   - Updated all supporting dependencies
   - Updated chart.js to v4.x
   - Updated RxJS to v7.8
   
   Performance Improvements:
   - Build time reduced by XX%
   - Bundle size reduced by XX%
   - Dev server startup faster
   
   Breaking Changes:
   - (Document any breaking changes found)
   
   Testing:
   - All tests passing
   - Manual testing completed
   - Cross-browser testing done
   
   Verified:
   - Production build: PASS
   - Development server: PASS
   - Lint: PASS
   - Tests: PASS
   - Web workers: PASS
   - Lazy loading: PASS
   - Charts: PASS
   - Theme switching: PASS"
   ```
4. Create final tag:
   ```bash
   git tag -a v21-upgrade-complete -m "Angular v21 upgrade completed successfully"
   ```
5. Push changes:
   ```bash
   git push origin upgrade/angular-v21
   git push origin --tags
   ```

**Verification**:
- [ ] All changes committed
- [ ] Descriptive commit message
- [ ] Tag created
- [ ] Changes pushed to remote

**Rollback**: N/A (create new branch if issues found)

---

## Post-Upgrade Tasks

### Task POST-001: Create Pull Request

**Dependencies**: P5-011  
**Objective**: Create PR for review and merge  
**Estimated Time**: 15 minutes

**Instructions**:
1. Go to GitHub repository
2. Create Pull Request from `upgrade/angular-v21` to `main`
3. Title: "Upgrade Angular v14 to v21"
4. Description should include:
   - Summary of changes
   - Testing completed
   - Performance improvements
   - Breaking changes (if any)
   - Upgrade tasks completed
   - Verification checklist
5. Request review from team members
6. Add labels: `enhancement`, `dependencies`

**Verification**:
- [ ] PR created
- [ ] Description complete
- [ ] Reviewers assigned
- [ ] CI/CD passes (if configured)

**Rollback**: Close PR if issues found

---

### Task POST-002: Monitor Production Deployment

**Dependencies**: POST-001 (after merge)  
**Objective**: Monitor application after upgrade deployment  
**Estimated Time**: Ongoing

**Instructions**:
1. After PR merge and deployment, monitor:
   - Application logs for errors
   - User reports of issues
   - Performance metrics
   - Browser console errors
2. Keep rollback plan ready for first 48 hours
3. Document any issues and fixes

**Verification**:
- [ ] No critical errors reported
- [ ] Performance as expected
- [ ] Users not reporting major issues
- [ ] Monitoring in place

**Rollback**: Revert to v14 tag if critical production issues

---

### Task POST-003: Cleanup and Optimization (Optional)

**Dependencies**: POST-002  
**Objective**: Optimize for Angular v21 features  
**Estimated Time**: 1-2 weeks (future work)

**Optional improvements**:
1. Migrate to standalone components
2. Implement Angular Signals
3. Migrate from Karma to Jest
4. Enable zoneless mode (experimental)
5. Implement SSR if needed
6. Optimize bundle splitting
7. Add PWA features
8. Implement lazy loading for images

**Note**: These are optional enhancements and can be separate tasks/PRs.

---

## Quick Reference: Complete Task Order

For an AI agent to execute, run tasks in this exact order:

```
Pre-Upgrade:
1. PRE-001: Repository Backup
2. PRE-002: Audit Dependencies
3. PRE-003: Install Angular CLI

Phase 1 (v14→v15):
4. P1-001: Update Core to v15
5. P1-002: Update Material to v15
6. P1-003: Update TypeScript to v4.9
7. P1-004: Migrate Polyfills
8. P1-005: Update RxJS
9. P1-006: Build and Test v15
10. P1-007: Commit v15

Phase 2 (v15→v16):
11. P2-001: Update Core to v16
12. P2-002: Update Material to v16
13. P2-003: Update TypeScript to v5.0
14. P2-004: Enable ESBuild (Optional)
15. P2-005: Update ESLint
16. P2-006: Build and Test v16
17. P2-007: Commit v16

Phase 3 (v16→v17):
18. P3-001: Update Core to v17
19. P3-002: Update Material to v17
20. P3-003: Update TypeScript to v5.2
21. P3-004: New Application Builder (Optional)
22. P3-005: Update zone.js
23. P3-006: Update Web Worker Config
24. P3-007: Build and Test v17
25. P3-008: Commit v17

Phase 4 (v17→v18):
26. P4-001: Update Core to v18
27. P4-002: Update Material to v18
28. P4-003: Update TypeScript to v5.4
29. P4-004: Build and Test v18
30. P4-005: Commit v18

Phase 5 (v18→v19→v20→v21):
31. P5-001: Update Core to v19
32. P5-002: Update Material to v19
33. P5-003: Update Core to v20
34. P5-004: Update Material to v20
35. P5-005: Update Core to v21
36. P5-006: Update Material to v21
37. P5-007: Update TypeScript to v5.6
38. P5-008: Update Remaining Dependencies
39. P5-009: Final Build and Test
40. P5-010: Update Documentation
41. P5-011: Final Commit

Post-Upgrade:
42. POST-001: Create Pull Request
43. POST-002: Monitor Production
44. POST-003: Optimization (Optional)
```

---

## Emergency Rollback Procedure

If at any point the upgrade fails critically:

1. **Immediate Rollback**:
   ```bash
   git checkout main
   git branch -D upgrade/angular-v21
   git checkout -b upgrade/angular-v21-retry
   git checkout v14.2.8-pre-upgrade
   ```

2. **Restore Dependencies**:
   ```bash
   npm ci
   npm run build.prod
   ```

3. **Verify Rollback**:
   - [ ] Build succeeds
   - [ ] Tests pass
   - [ ] App runs correctly

4. **Document Issues**:
   - Create GitHub issues for blockers
   - Document which task failed
   - Note error messages and symptoms
   - Review and adjust upgrade plan

5. **Retry**:
   - Start from last successful tag
   - Apply fixes for known issues
   - Continue from failed task

---

## Success Criteria

The upgrade is considered successful when:

- ✅ Angular v21.x installed and verified
- ✅ All dependencies updated to compatible versions
- ✅ Production build succeeds without errors
- ✅ All tests pass (or failures documented and acceptable)
- ✅ Lint passes without critical errors
- ✅ Dev server runs without errors
- ✅ All manual tests pass
- ✅ Web workers function correctly
- ✅ Charts render properly
- ✅ Theme switching works
- ✅ Lazy loading works
- ✅ Routing works correctly
- ✅ No console errors in browser
- ✅ Performance improved or maintained
- ✅ Cross-browser compatibility verified
- ✅ Documentation updated

---

## Notes for AI Agents

1. **Execute tasks sequentially** - Do not skip tasks
2. **Verify after each task** - Check verification criteria
3. **Commit frequently** - After each phase at minimum
4. **Document issues** - Note any problems encountered
5. **Test thoroughly** - Manual testing is critical
6. **Don't force** - If `ng update` fails without `--force`, investigate why
7. **Read migration output** - Angular CLI provides helpful migration information
8. **Check console** - Browser console errors indicate problems
9. **Performance metrics** - Track build times and bundle sizes
10. **Rollback quickly** - If stuck on a task, rollback and document

---

## Estimated Total Time

- **Conservative approach**: 2-3 weeks (with thorough testing)
- **Aggressive approach**: 1 week (higher risk)
- **Per-task execution**: 6-8 hours of active work
- **Testing and validation**: 4-6 hours per phase
- **Total hands-on time**: 15-20 hours

---

## Additional Resources

- Angular Update Guide: https://update.angular.io/
- Angular CLI Update: `ng update` documentation
- Material Migration: https://material.angular.io/guide/mdc-migration
- TypeScript Release Notes: https://devblogs.microsoft.com/typescript/
