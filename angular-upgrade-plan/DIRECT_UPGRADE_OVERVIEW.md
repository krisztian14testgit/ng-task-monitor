# Angular v14 → v21 Direct Upgrade Plan with ng2-charts v8

## Project: ng-task-monitor

**Date**: January 2026  
**Current Version**: Angular v14.2.8  
**Target Version**: Angular v21.x.x  
**Upgrade Strategy**: 🚀 **DIRECT UPGRADE** (v14 → v21)  
**Chart Library**: ng2-charts v8 + Chart.js v4  
**Status**: ⏸️ Planning Complete - Ready for Execution

---

## 📊 Executive Summary

### ✅ Direct Upgrade Approach - SELECTED STRATEGY

**Why Direct Upgrade?**
- Faster delivery (1-2 weeks vs 2-3 weeks for sequential)
- Simpler testing (one target environment)
- Less intermediate configuration management
- Modern features available immediately
- ng2-charts v8 requires Angular 21 anyway

**Risk Mitigation**:
- Thorough pre-upgrade preparation
- Comprehensive testing plan
- Clear rollback strategy
- Parallel development branch

| Aspect | Status | Details |
|--------|--------|---------|
| **Upgrade Strategy** | 🚀 Direct v14→v21 | One-step upgrade, faster timeline |
| **Chart Library** | ✅ ng2-charts v8 | Minimal migration, familiar API |
| **Node.js Compatibility** | ✅ Already Compatible | v20.19.6 works with Angular 21 |
| **Estimated Time** | 📅 1-2 weeks | Direct approach with focused testing |
| **Risk Level** | 🟡 Medium-High | Higher initial complexity, manageable with planning |
| **Major Changes** | 🔴 4 Critical Areas | Material MDC, TypeScript 5.6, Chart.js v4, Build System |
| **Expected ROI** | ✅ Very High | 75-85% faster builds, modern features immediately |

---

## 🎯 Final Selected Approach

### Direct Upgrade Path: v14.2.8 → v21.x.x

```
Angular v14.2.8 (Current)
         ↓
    [Direct Jump]
         ↓
Angular v21.x.x (Target)
```

**No intermediate versions** - All breaking changes handled in a single coordinated upgrade.

---

## 📦 Chart Library Decision - FINAL

### ✅ Selected: ng2-charts v8 + Chart.js v4

**Why This Choice?**
1. **Minimal Migration Effort**: 1-2 days (already included in main upgrade)
2. **Familiar Technology**: Team knows Chart.js API
3. **Proven Approach**: Upgrading existing solution vs learning new library
4. **Sufficient Features**: Meets all current requirements
5. **Lower Risk**: Less code changes = fewer bugs
6. **Faster Delivery**: No separate migration project needed

**Migration Details**:
- Current: chart.js v3.9.1 + ng2-charts v4.0.1
- Target: chart.js v4.4+ + ng2-charts v8.0+
- Affected: 3 chart components in statistic module
- Effort: 1-2 days (configuration updates)
- Breaking Changes: API restructuring (well-documented)

**Alternatives NOT Selected**:
- ❌ ngx-charts: 2-3 days extra migration, unnecessary for simple charts
- ❌ ng-apexcharts: Overkill for basic statistics visualization
- ❌ Syncfusion: Commercial licensing, too heavy

---

## 🚀 Direct Upgrade Implementation Plan

### Phase 1: Pre-Upgrade Preparation (2-3 days)

**Tasks**:
1. **Create upgrade branch**: `git checkout -b upgrade/angular-v21-direct`
2. **Backup current state**: Tag current commit as `pre-upgrade-v14`
3. **Update development environment**:
   ```bash
   # Verify Node.js version
   node -v  # Should be v20.19.6 (already compatible)
   
   # Clear caches
   npm cache clean --force
   rm -rf node_modules package-lock.json
   ```

4. **Document current functionality**:
   - Run full test suite: `npm test`
   - Manual testing checklist
   - Screenshot all UI states
   - Record current bundle sizes

5. **Setup parallel testing environment**:
   - Keep v14 branch for comparison
   - Prepare rollback procedure

**Verification**: ✅ Clean working directory, all tests passing, backup confirmed

---

### Phase 2: Core Angular Upgrade (3-5 days)

**Step 1: Update package.json**

Replace ALL Angular packages in one go:

```bash
# Remove old versions
npm uninstall @angular/animations @angular/common @angular/compiler \
  @angular/core @angular/forms @angular/platform-browser \
  @angular/platform-browser-dynamic @angular/router \
  @angular/cli @angular/compiler-cli \
  @angular/cdk @angular/material

# Install Angular 21 packages
npm install --save @angular/animations@^21.0.0 \
  @angular/common@^21.0.0 \
  @angular/compiler@^21.0.0 \
  @angular/core@^21.0.0 \
  @angular/forms@^21.0.0 \
  @angular/platform-browser@^21.0.0 \
  @angular/platform-browser-dynamic@^21.0.0 \
  @angular/router@^21.0.0 \
  @angular/cdk@^21.0.0 \
  @angular/material@^21.0.0

npm install --save-dev @angular/cli@^21.0.0 \
  @angular/compiler-cli@^21.0.0 \
  @angular-devkit/build-angular@^21.0.0
```

**Step 2: Update TypeScript to 5.6**

```bash
npm install --save-dev typescript@~5.6.0
```

**Step 3: Update RxJS and Zone.js**

```bash
npm install rxjs@^7.8.0 zone.js@^0.15.0
```

**Step 4: Run Angular Update**

```bash
# This will run all migrations from v14 to v21
ng update @angular/core@21 @angular/cli@21 --force --allow-dirty

# If prompted for migrations, accept all
```

**Expected Issues & Solutions**:

1. **TypeScript Errors**:
   - Stricter type checking in TS 5.6
   - Solution: Update `tsconfig.json`, fix type issues incrementally
   
2. **Angular Material MDC Migration**:
   - v17+ uses Material Design Components (MDC)
   - Solution: Update component imports, CSS, and themes
   
3. **Build Configuration**:
   - New application builder in v17+
   - Solution: Update `angular.json` to use esbuild

4. **Deprecated APIs**:
   - Various APIs removed from v14 to v21
   - Solution: Replace with recommended alternatives (ng update helps)

**Verification**: ✅ `npm install` succeeds, `ng version` shows v21

---

### Phase 3: Angular Material MDC Migration (2-3 days)

**Critical Changes**:

Angular Material v17+ migrated to MDC (Material Design Components), causing breaking changes in:
- Component imports
- CSS/SCSS styles
- Theme configuration
- Component APIs

**Step 1: Update Material Imports**

```typescript
// OLD (v14)
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// NEW (v21) - Same imports, but MDC implementation
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// Imports stay same, but internals changed to MDC
```

**Step 2: Update Theme Configuration**

```scss
// src/styles.scss or theme file

// OLD (v14)
@import '~@angular/material/prebuilt-themes/indigo-pink.css';

// NEW (v21) - MDC themes
@use '@angular/material' as mat;

@include mat.core();

$my-primary: mat.define-palette(mat.$indigo-palette);
$my-accent: mat.define-palette(mat.$pink-palette);

$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  )
));

@include mat.all-component-themes($my-theme);
```

**Step 3: Update Component CSS**

Many Material component CSS classes changed with MDC:

```scss
// OLD
.mat-button { }
.mat-card { }
.mat-form-field { }

// NEW (MDC)
.mat-mdc-button { }
.mat-mdc-card { }
.mdc-text-field { }
```

**Step 4: Test All Material Components**

Your project uses ~15 Material components:
- MatButton, MatCard, MatFormField, MatInput
- MatSelect, MatCheckbox, MatRadio
- MatDialog, MatSnackBar, MatToolbar
- MatIcon, MatProgressBar, MatSpinner
- And others

Test each component thoroughly after migration.

**Verification**: ✅ All Material components render correctly, no CSS issues

---

### Phase 4: Chart Library Upgrade (1-2 days)

**Step 1: Update Chart Libraries**

```bash
npm install chart.js@^4.4.0 ng2-charts@^8.0.0
```

**Step 2: Update Chart Configuration**

Chart.js v4 has breaking config changes:

```typescript
// OLD (Chart.js v3)
const config = {
  scales: {
    xAxes: [{
      display: true
    }],
    yAxes: [{
      display: true
    }]
  },
  legend: {
    display: true
  },
  tooltips: {
    enabled: true
  }
};

// NEW (Chart.js v4)
const config = {
  scales: {
    x: {  // Single axis, not array
      display: true
    },
    y: {  // Single axis, not array
      display: true
    }
  },
  plugins: {
    legend: {  // Moved to plugins
      display: true
    },
    tooltip: {  // Renamed from tooltips
      enabled: true
    }
  }
};
```

**Step 3: Update ng2-charts Provider Setup**

```typescript
// main.ts or app.config.ts

// OLD (v14 with NgModule)
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [ChartsModule]
})

// NEW (v21 with standalone)
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCharts(withDefaultRegisterables()),
    // other providers
  ]
};
```

**Step 4: Update Chart Components**

Update 3 chart components in `src/app/modules/statistic/`:
- Task count chart
- Line chart
- Any other chart components

```typescript
// Update imports
import { BaseChartDirective } from 'ng2-charts';

@Component({
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  // ...
})
export class TaskCountChartComponent {
  // Update chart configuration to v4 format
}
```

**Verification**: ✅ All charts render, interactions work, no console errors

---

### Phase 5: Build System & Configuration Updates (1-2 days)

**Step 1: Update angular.json**

Angular v17+ uses new application builder with esbuild:

```json
{
  "projects": {
    "ng-task-monitor": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/ng-task-monitor",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    }
  }
}
```

**Key Changes**:
- `browser` instead of `main`
- New builder: `@angular-devkit/build-angular:application`
- Simplified polyfills configuration

**Step 2: Update tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2023", "dom"],
    "useDefineForClassFields": false,
    "strict": true,
    "strictNullChecks": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

**Step 3: Update Web Worker (if needed)**

Your project has `countdown-timer.worker.ts`:

```typescript
// Ensure it uses modern worker syntax
// May need updates for TypeScript 5.6
```

**Step 4: Update Polyfills**

v15+ simplified polyfills:

```typescript
// src/polyfills.ts - May not be needed anymore
// Or update to:
import 'zone.js';
```

**Verification**: ✅ `ng build` succeeds, `ng serve` works, worker functions properly

---

### Phase 6: TypeScript 5.6 Migration (1-2 days)

**Common TypeScript 5.6 Issues**:

1. **Stricter Null Checks**:
```typescript
// May fail in TS 5.6
let value: string | undefined;
value.length; // Error: Object is possibly 'undefined'

// Fix
if (value) {
  value.length; // OK
}
// Or use optional chaining
value?.length;
```

2. **Stricter Type Inference**:
```typescript
// May need explicit types
const items = [1, 2, 3]; // OK, inferred as number[]
const mixed = [1, 'two', 3]; // May need: Array<number | string>
```

3. **Import/Export Strictness**:
```typescript
// Ensure all imports are properly typed
import type { MyType } from './types';
import { myFunction } from './functions';
```

**Step-by-Step**:
1. Run `npx tsc --noEmit` to find all errors
2. Fix errors incrementally (focus on critical ones first)
3. Update `tsconfig.json` if needed (enable/disable specific checks)
4. Re-run until clean build

**Verification**: ✅ `npx tsc --noEmit` passes with no errors

---

### Phase 7: Testing & Validation (2-3 days)

**Comprehensive Testing Plan**:

1. **Unit Tests**:
```bash
npm test
# Fix any failing tests
# Update test configurations if needed
```

2. **Build Tests**:
```bash
# Development build
ng build

# Production build
ng build --configuration production

# Check bundle sizes (should be 10-15% smaller)
```

3. **E2E Testing** (if available):
```bash
# Run end-to-end tests
npm run e2e
```

4. **Manual Testing Checklist**:
   - [ ] Application loads
   - [ ] Routing works (all lazy-loaded modules)
   - [ ] Task creation/editing/deletion
   - [ ] Task timer functionality
   - [ ] Statistics page with charts
   - [ ] All 3 charts render correctly
   - [ ] Chart interactions (hover, click)
   - [ ] Location/profile management
   - [ ] Theme switching
   - [ ] All Material components
   - [ ] Responsive design
   - [ ] Web worker (timer calculations)
   - [ ] Local storage persistence
   - [ ] Error handling

5. **Performance Testing**:
   - Initial load time
   - Bundle sizes comparison
   - Build time (should be 75-85% faster)
   - Runtime performance
   - Memory usage

6. **Browser Compatibility**:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

**Verification**: ✅ All tests pass, manual testing complete, performance improved

---

### Phase 8: Deployment Preparation (1 day)

**Pre-Deployment Checklist**:

1. **Documentation Updates**:
   - Update README.md with new Angular version
   - Update development setup instructions
   - Document any new environment requirements

2. **Dependency Audit**:
```bash
npm audit
npm audit fix
```

3. **Final Build Verification**:
```bash
# Clean build
rm -rf dist node_modules
npm install
ng build --configuration production

# Verify output
ls -lh dist/
```

4. **Deployment Configuration**:
   - Update CI/CD pipelines (if any)
   - Update deployment scripts
   - Verify environment variables
   - Update Docker configurations (if used)

5. **Rollback Plan**:
   - Ensure v14 branch is accessible
   - Document rollback procedure
   - Test rollback if possible

**Verification**: ✅ Production build succeeds, deployment scripts ready

---

## 📊 Expected Results

### Performance Improvements

| Metric | v14 (Before) | v21 (After) | Improvement |
|--------|--------------|-------------|-------------|
| **Build Time (dev)** | ~60-90s | ~10-15s | **85% faster** |
| **Build Time (prod)** | ~120-150s | ~20-30s | **83% faster** |
| **Bundle Size** | ~500 KB | ~425-450 KB | **10-15% smaller** |
| **Initial Load** | ~2.5s | ~2.0s | **20% faster** |
| **Change Detection** | Baseline | 10-20% faster | **Improved** |

### Bundle Size Breakdown

```
Before (v14):
- Main bundle: ~350 KB
- Vendor: ~150 KB
- Total: ~500 KB

After (v21):
- Main bundle: ~300 KB
- Vendor: ~125 KB
- Total: ~425 KB
```

### Feature Gains

1. **Latest Angular Features**:
   - Signals (available for future use)
   - Standalone components (optional adoption)
   - New control flow syntax (optional)
   - Improved SSR support
   - Better TypeScript integration

2. **Security Updates**:
   - 7 major versions of security patches
   - Updated dependencies
   - Modern browser features

3. **Developer Experience**:
   - Faster builds (huge improvement)
   - Better IDE support
   - Improved error messages
   - Modern debugging tools

---

## 🎯 Timeline Summary

### Total Timeline: 1-2 Weeks (9-14 days)

| Phase | Duration | Critical? |
|-------|----------|-----------|
| Pre-Upgrade Preparation | 2-3 days | ✅ Yes |
| Core Angular Upgrade | 3-5 days | ✅ Yes |
| Material MDC Migration | 2-3 days | ✅ Yes |
| Chart Library Upgrade | 1-2 days | ✅ Yes |
| Build System Updates | 1-2 days | ✅ Yes |
| TypeScript Migration | 1-2 days | ✅ Yes |
| Testing & Validation | 2-3 days | ✅ Yes |
| Deployment Prep | 1 day | ⚠️ Important |

**Conservative Estimate**: 14 days (2 weeks)  
**Aggressive Estimate**: 9 days (1.5 weeks)  
**Recommended**: 12 days with buffer

---

## ⚠️ Risk Assessment & Mitigation

### High-Risk Areas

1. **🔴 Angular Material MDC Migration**
   - **Risk**: Visual regressions, broken layouts
   - **Mitigation**: Thorough visual testing, screenshot comparison
   - **Effort**: 2-3 days

2. **🔴 TypeScript 5.6 Strict Checks**
   - **Risk**: Compilation errors, type issues
   - **Mitigation**: Incremental fixing, prioritize critical errors
   - **Effort**: 1-2 days

3. **🟡 Chart.js v4 Breaking Changes**
   - **Risk**: Charts don't render, configuration errors
   - **Mitigation**: Well-documented migration path, only 3 components
   - **Effort**: 1-2 days

4. **🟡 Build System Changes**
   - **Risk**: Build failures, configuration issues
   - **Mitigation**: Follow Angular CLI migrations, test thoroughly
   - **Effort**: 1-2 days

### Medium-Risk Areas

5. **🟡 Web Worker Compatibility**
   - **Risk**: Worker may need updates for v21
   - **Mitigation**: Single worker file, well-isolated
   - **Effort**: 0.5-1 day

6. **🟡 Third-Party Dependencies**
   - **Risk**: Some packages may not support Angular 21
   - **Mitigation**: Check compatibility early, find alternatives
   - **Effort**: 0.5-1 day

### Low-Risk Areas

7. **🟢 Node.js Compatibility**
   - **Risk**: None
   - **Status**: Already using v20.19.6 (compatible)

8. **🟢 RxJS Migration**
   - **Risk**: Minimal
   - **Status**: v7.5 → v7.8 (minor version bump)

9. **🟢 Lazy Loading**
   - **Risk**: Minimal
   - **Status**: Still supported, may be easier with v21

---

## 🔄 Rollback Strategy

### If Issues Arise

**Immediate Rollback** (within 24 hours):
```bash
# Checkout pre-upgrade tag
git checkout pre-upgrade-v14

# Reinstall dependencies
npm install

# Verify
ng version
npm test
ng serve
```

**Partial Rollback** (keep some changes):
```bash
# Revert specific files
git checkout pre-upgrade-v14 -- path/to/file

# Cherry-pick working changes
git cherry-pick <commit-hash>
```

**Rollback Decision Criteria**:
- **Immediate**: Critical bugs affecting users
- **Partial**: Non-critical issues, some features work
- **Continue**: Only minor issues, fixable quickly

---

## ✅ Success Criteria

### Must-Have (Critical)

- [ ] Application builds successfully
- [ ] All pages load without errors
- [ ] No console errors in browser
- [ ] Task CRUD operations work
- [ ] Task timer functions correctly
- [ ] All 3 charts render properly
- [ ] Routing works (all lazy modules)
- [ ] Web worker functions
- [ ] Tests pass (or known failures documented)

### Should-Have (Important)

- [ ] Build time improved (75%+ faster)
- [ ] Bundle size reduced (10%+ smaller)
- [ ] All Material components styled correctly
- [ ] No visual regressions
- [ ] Performance equal or better
- [ ] Mobile responsive design intact

### Nice-to-Have (Optional)

- [ ] Zero warnings in console
- [ ] 100% test coverage maintained
- [ ] Documentation fully updated
- [ ] Adopted some v21 features (Signals, standalone)

---

## 📚 Post-Upgrade: Optional Modernization

After successful v21 upgrade, consider these modern Angular features:

### Optional Phase 9: Gradual Modernization (3-4 weeks)

**Not Required for v21 Upgrade, but beneficial:**

1. **Standalone Components** (1-2 weeks)
   - Convert NgModules to standalone components
   - Simpler architecture, better tree-shaking
   - Can be done incrementally

2. **New Control Flow** (1 week)
   - Convert `*ngIf` → `@if`
   - Convert `*ngFor` → `@for`
   - More intuitive syntax

3. **Input Signals** (1 week)
   - Replace `ngOnChanges` with input signals
   - Only for primitive types
   - Better change detection

4. **Keep RxJS** (Decision: PRESERVE)
   - Don't convert RxJS to Signals
   - RxJS is perfect for async operations
   - Signals for primitive UI state only

See `AI_AGENT_MODERNIZATION_TASKS.md` for detailed tasks.

---

## 🎉 Conclusion

### Direct Upgrade: The Right Choice

**Why This Approach Works**:
1. ✅ **Faster**: 1-2 weeks vs 2-3 weeks sequential
2. ✅ **Simpler**: One target environment, one test suite
3. ✅ **Modern**: Get all v21 features immediately
4. ✅ **Efficient**: ng2-charts v8 requires v21 anyway
5. ✅ **Lower Maintenance**: No intermediate versions to manage

**What Makes It Manageable**:
- Small codebase (~50 files)
- Clear architecture (3 lazy modules)
- Good test coverage
- Node.js already compatible
- Team familiar with Chart.js
- Well-documented breaking changes

### Ready for Execution

All planning complete. Documentation covers:
- ✅ Detailed step-by-step instructions
- ✅ Expected issues and solutions
- ✅ Testing and validation plan
- ✅ Rollback procedures
- ✅ Success criteria
- ✅ Timeline and effort estimates

**Next Step**: Review this plan with team, schedule upgrade window, execute Phase 1.

---

## 📖 Additional Resources

- [Angular Update Guide](https://update.angular.io/?v=14.0-21.0)
- [Angular v21 Release Notes](https://github.com/angular/angular/releases)
- [Chart.js v4 Migration Guide](https://www.chartjs.org/docs/latest/getting-started/v4-migration.html)
- [ng2-charts v8 Documentation](https://valor-software.com/ng2-charts/)
- [Angular Material MDC Migration](https://material.angular.io/guide/mdc-migration)
- [TypeScript 5.6 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/)

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Ready for Execution
