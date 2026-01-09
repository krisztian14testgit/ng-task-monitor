# ElectronJS Direct Upgrade Task Template for AI Agents

## Purpose
This document provides step-by-step instructions for AI agents to upgrade the ng-task-monitor project from Electron 21.2.2 to Electron 39.2.7 using a **direct upgrade approach** with Node.js 22 LTS as the first priority.

---

## Upgrade Strategy

**Approach**: Direct upgrade with Node.js priority
**Rationale**: Well-architected codebase supports direct upgrade, faster delivery
**Timeline**: 5-7 days (optimistic) to 7-9 days (with buffer)

### Upgrade Sequence
```
Phase 1: Node.js 22.20.0 LTS Upgrade
   ↓
Phase 2: Electron 39.2.7 Direct Upgrade
   ↓
Phase 3: Electron Forge 7.10.2 Upgrade
   ↓
Phase 4: Code Modernization & Security
   ↓
Phase 5: Comprehensive Testing & Validation
```

---

## Prerequisites

### Required Information
- **Source Branch**: `inElectronJs`
- **Target Electron Version**: 39.2.7
- **Target Node.js Version**: 22.20.0 (LTS, bundled with Electron 39)
- **Node.js 22 LTS Status**: Active LTS until October 2025, Maintenance until April 2027
- **Current Working Directory**: `/home/runner/work/ng-task-monitor/ng-task-monitor`

### Pre-Upgrade Checklist
- [ ] Backup current codebase
- [ ] Verify current application works correctly
- [ ] Document baseline performance metrics
- [ ] Set up test environment
- [ ] Review ELECTRON_UPGRADE_ANALYSIS.md

---

## Phase 1: Node.js 22 LTS Upgrade & Compatibility Check

### Task 1.1: Branch Setup and Baseline Testing

**Objective**: Create upgrade branch and establish baseline

**Steps**:
```bash
# 1. Checkout the inElectronJs branch
git checkout inElectronJs

# 2. Create a new upgrade branch
git checkout -b upgrade/electron-39-direct

# 3. Verify current Node.js and npm versions
node --version  # System Node version
npm --version

# 4. Install current dependencies
npm install

# 5. Run linting
npm run lint

# 6. Run tests (if available)
npm run test

# 7. Build the Angular app
npm run build.prod

# 8. Test Electron app (manual verification needed)
npm run start.electron
```

**Validation**:
- [ ] Branch created successfully
- [ ] Dependencies installed without errors
- [ ] Linting passes
- [ ] Tests pass (if any)
- [ ] Build completes successfully
- [ ] Electron app launches and functions correctly

**Rollback**: `git checkout inElectronJs`

---

### Task 1.2: Node.js 22 LTS Investigation & Compatibility Analysis

**Objective**: Verify Node.js 22 LTS compatibility and features

**Investigation Steps**:
```bash
# 1. Check Node.js 22 LTS information
npm view node@22 version
npm view node@22 dist-tags

# 2. Review Node.js 22 release notes
# Visit: https://nodejs.org/en/blog/release/v22.11.0

# 3. Document Node.js 22 features relevant to project
# - fs module changes
# - crypto updates
# - stream improvements
# - performance enhancements

# 4. Check current Node.js API usage in project
grep -r "require('fs')" electronJs/
grep -r "require('os')" electronJs/
grep -r "require('path')" electronJs/
```

**Key Findings to Document**:
- [ ] Node.js 22 LTS end-of-life date: April 30, 2027
- [ ] Current LTS phase: Active LTS (production-ready)
- [ ] Breaking changes from Node 16 to 22
- [ ] File system API compatibility
- [ ] Crypto API compatibility
- [ ] No blocking issues identified

**Output**: Create `NODE_22_COMPATIBILITY.md` with findings

---

### Task 1.3: Update Node.js Type Definitions

**Objective**: Prepare for Node.js 22 by updating type definitions

**Steps**:
```bash
# 1. Update @types/node to Node 22 types
npm install --save-dev @types/node@^22.10.0

# 2. Check for type errors
npx tsc --noEmit

# 3. Review any TypeScript errors related to Node.js types
```

**Files to Review**:
- `electronJs/file-handler/nodejs-file-handler.js`
- `electronJs/ipc/ipc-location.js`
- `electronJs/ipc/ipc-task-list.js`
- Any TypeScript files using Node.js APIs

**Validation**:
- [ ] @types/node@22.x installed
- [ ] No new TypeScript errors
- [ ] Type definitions compatible

**Rollback**:
```bash
git checkout package.json package-lock.json
npm install
```

---

## Phase 2: Electron 39.2.7 Direct Upgrade

### Task 2.1: Direct Electron Upgrade to 39.2.7

**Objective**: Upgrade Electron from 21.2.2 to 39.2.7 in one step

**Steps**:
```bash
# 1. Update Electron to version 39.2.7
npm install --save-dev electron@^39.2.7

# 2. Clear npm cache
npm cache clean --force

# 3. Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Verify Electron and Node versions
npm list electron
node -p "process.versions"  # Should show Node 22 when run in Electron
```

**Critical Code Change Required**:

File: `electronJs/app.js`
```javascript
// BEFORE (INSECURE)
webPreferences: {
    nodeIntegration: true,
    sandbox: true,
    preload: path.join(__dirname, 'preload.js'),
}

// AFTER (SECURE)
webPreferences: {
    nodeIntegration: false,        // CHANGED from true
    contextIsolation: true,        // EXPLICITLY added
    sandbox: true,
    preload: path.join(__dirname, 'preload.js'),
    webSecurity: true,             // ADDED
    allowRunningInsecureContent: false,  // ADDED
}
```

**Validation**:
- [ ] Electron 39.2.7 installed successfully
- [ ] Node.js 22.20.0 bundled (check with Electron DevTools)
- [ ] No dependency conflicts
- [ ] Security configuration updated
- [ ] Application builds without errors

**Testing**:
```bash
# 1. Build the application
npm run build.prod

# 2. Launch Electron
npm run start.electron

# 3. Check DevTools console for errors
# Press F12 to open DevTools

# 4. Verify Node.js version in Electron
# In DevTools Console: console.log(process.versions)
```

**Testing Checklist**:
- [ ] Application launches successfully
- [ ] No console errors or warnings
- [ ] Window displays correctly
- [ ] DevTools accessible via F12

**Rollback**:
```bash
git checkout package.json package-lock.json electronJs/app.js
npm install
```

---

### Task 2.2: Verify IPC Communication Still Works

**Objective**: Ensure contextBridge and IPC work with new security settings

**Testing Steps**:
```bash
# 1. Launch application
npm run start.electron

# 2. Test IPC communications manually
```

**Manual Testing**:
1. **Location Management**:
   - [ ] Open location settings
   - [ ] Change app settings path
   - [ ] Change task path
   - [ ] Verify paths save correctly
   - [ ] Restart app and verify paths persist

2. **Task Management**:
   - [ ] Create a new task
   - [ ] Edit existing task
   - [ ] Delete a task
   - [ ] Verify task list persists

3. **File Operations**:
   - [ ] Tasks save to file
   - [ ] Tasks load from file
   - [ ] Settings save to file
   - [ ] Settings load from file

**Check Files**:
- `electronJs/preload.js` - Verify contextBridge exposeInMainWorld
- `electronJs/ipc/ipc-location.js` - Verify IPC handlers
- `electronJs/ipc/ipc-task-list.js` - Verify IPC handlers

**Validation**:
- [ ] All IPC communications work
- [ ] No errors in DevTools console
- [ ] File operations succeed
- [ ] contextBridge properly isolates APIs

**If Issues Found**:
- Check that preload.js is loaded correctly
- Verify contextBridge.exposeInMainWorld is called
- Check that Angular services use window.electronAPI
- Review console for security policy violations

---

## Phase 3: Electron Forge 7.10.2 Upgrade

### Task 3.1: Upgrade Electron Forge to 7.x

**Objective**: Update Electron Forge from 6.0.0 to 7.10.2

**Steps**:
```bash
# 1. Update all Electron Forge packages
npm install --save-dev @electron-forge/cli@^7.10.2
npm install --save-dev @electron-forge/maker-deb@^7.10.2
npm install --save-dev @electron-forge/maker-rpm@^7.10.2
npm install --save-dev @electron-forge/maker-squirrel@^7.10.2
npm install --save-dev @electron-forge/maker-zip@^7.10.2

# 2. Update electron-squirrel-startup if needed
npm install --save electron-squirrel-startup@latest

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Configuration Check**:

The Electron Forge v7 configuration in package.json should still work. Verify:
```json
"config": {
  "forge": {
    "packagerConfig": { ... },
    "makers": [ ... ]
  }
}
```

**If configuration migration needed**, consult:
- https://www.electronforge.io/configuration

**Validation**:
- [ ] Electron Forge 7.10.2 installed
- [ ] All maker packages updated
- [ ] Configuration compatible
- [ ] No dependency conflicts

**Testing**:
```bash
# 1. Test Electron Forge start
npm run start.forge

# 2. Test packaging
npm run package

# 3. Verify output
ls -la out/
```

**Validation**:
- [ ] Forge start works
- [ ] Package command succeeds
- [ ] Output directory created
- [ ] Packaged app launches correctly

**Rollback**:
```bash
git checkout package.json package-lock.json
npm install
```

---

## Phase 4: Code Modernization & Security Enhancements

### Task 4.1: Update Node.js File Handler for Node 22

**Objective**: Ensure file handler is compatible with Node.js 22 APIs

**File**: `electronJs/file-handler/nodejs-file-handler.js`

**Steps**:
1. Review Node.js 22 breaking changes in fs module
2. Test all file operations
3. Update deprecated APIs if any

**Specific Areas to Check**:
```javascript
// Check fs.writeFile callback signature
// Check fs.readFileSync error handling
// Check fs.unlink callback signature
// Verify fs.existsSync still works
// Verify os.homedir() still works
```

**Testing**:
```javascript
// Test writeFile
// Test readFile
// Test removeFile
// Test isExistedPath
// Test changeFilePath
```

**Validation**:
- [ ] All file operations work correctly
- [ ] No deprecation warnings
- [ ] Error handling works properly
- [ ] Path operations work cross-platform

---

### Task 4.2: Add Security Enhancements

**Objective**: Implement security best practices for Electron 39

**1. Add Content Security Policy**:

File: `electronJs/app.js`
```javascript
function createBrowserWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true,
            allowRunningInsecureContent: false,
        }
    });
    
    // ADD: Set CSP header
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["default-src 'self'; script-src 'self'"]
            }
        });
    });
    
    return mainWindow;
}
```

**2. Add IPC Input Validation**:

File: `electronJs/ipc/ipc-location.js`
```javascript
static subscribeOnSaving() {
    ipcMain.on('save-location', (event, pathType = 0, locationSetting = {}) => {
        // ADD: Input validation
        if (typeof pathType !== 'number' || pathType < 0 || pathType > 1) {
            console.error('Invalid pathType');
            return;
        }
        
        if (!locationSetting || typeof locationSetting !== 'object') {
            console.error('Invalid locationSetting');
            return;
        }
        
        // ADD: Path sanitization
        const appSettingPath = locationSetting.appSettingPath?.toString() || '';
        const taskPath = locationSetting.taskPath?.toString() || '';
        
        // Prevent directory traversal
        if (appSettingPath.includes('..') || taskPath.includes('..')) {
            console.error('Invalid path: directory traversal detected');
            return;
        }
        
        // Continue with existing logic...
    });
}
```

Apply similar validation to `electronJs/ipc/ipc-task-list.js`

**Validation**:
- [ ] CSP header set correctly
- [ ] Input validation added to all IPC handlers
- [ ] Path sanitization prevents directory traversal
- [ ] Application still works correctly

---

### Task 4.3: TypeScript Compatibility (Optional)

**Objective**: Upgrade TypeScript if needed for Node 22 types

**Steps**:
```bash
# 1. Check if TypeScript needs upgrade
npm list typescript

# 2. If using TypeScript 4.x, consider upgrading to 5.x
npm install --save-dev typescript@~5.3.0

# 3. Check for type errors
npx tsc --noEmit

# 4. Fix any type errors that arise
```

**Validation**:
- [ ] TypeScript compiles without errors
- [ ] No type errors related to Node.js APIs
- [ ] Angular build still works

---

## Phase 5: Comprehensive Testing & Validation

### Task 5.1: Functional Testing

**Objective**: Verify all application features work correctly

**Test Cases**:

1. **Application Launch**
   - [ ] Application launches without errors
   - [ ] Window displays correctly
   - [ ] No console errors

2. **Task Management**
   - [ ] Create new task
   - [ ] Edit existing task
   - [ ] Delete task
   - [ ] Task list persists after restart
   - [ ] Task countdown works
   - [ ] Task statistics display correctly

3. **Location Management**
   - [ ] Change app settings path
   - [ ] Change task path
   - [ ] Paths persist after restart
   - [ ] Invalid paths are rejected

4. **File Operations**
   - [ ] Task list saves to file
   - [ ] Task list loads from file
   - [ ] Settings save to file
   - [ ] Settings load from file
   - [ ] Old tasks (>7 days) are removed

5. **UI Features**
   - [ ] Theme switching works (light, dark, blueDragon)
   - [ ] Responsive layout works
   - [ ] Charts render correctly
   - [ ] All buttons and interactions work

6. **Developer Tools**
   - [ ] F12 toggles DevTools
   - [ ] No errors in DevTools console

7. **Window Management**
   - [ ] Single instance lock works
   - [ ] Window close/minimize/maximize works
   - [ ] Application quits correctly

8. **Platform-Specific** (if applicable)
   - [ ] Mac: App stays in dock when closed
   - [ ] Windows/Linux: App quits when closed

**Test on Multiple Platforms** (if available):
- [ ] Windows 10/11
- [ ] macOS (if available)
- [ ] Linux (Ubuntu/Debian)

---

### Task 5.2: Build and Packaging Testing

**Objective**: Verify build and packaging works correctly

**Steps**:
```bash
# 1. Clean build
rm -rf dist out
npm run build.prod

# 2. Test development Electron
npm run start.electron

# 3. Test Electron Forge start
npm run start.forge

# 4. Package the application
npm run package

# 5. Make installers (platform-dependent)
npm run make

# 6. Verify output
ls -la out/
```

**Validation**:
- [ ] Angular build completes successfully
- [ ] Electron dev mode works
- [ ] Electron Forge start works
- [ ] Package command succeeds
- [ ] Installers created successfully
- [ ] Packaged app runs correctly
- [ ] No missing dependencies in packaged app

---

### Task 5.3: Performance Testing

**Objective**: Ensure no performance regression

**Metrics to Measure**:
1. **Startup Time**: Time from launch to window visible
2. **Memory Usage**: RAM consumption at idle
3. **Task Operations**: Time to save/load task list
4. **UI Responsiveness**: Time to switch themes, render charts

**Steps**:
```bash
# 1. Measure startup time
time npm run start.electron

# 2. Monitor memory usage
# Use Task Manager (Windows) / Activity Monitor (Mac) / top (Linux)

# 3. Test task operations performance
# Create 100 tasks, measure save time
# Load 100 tasks, measure load time
```

**Target** (Electron 39 vs Electron 21):
- Startup time: Within 10% of baseline
- Memory usage: Within 15% of baseline
- Task operations: Within 10% of baseline

**Validation**:
- [ ] Startup time acceptable
- [ ] Memory usage acceptable
- [ ] No memory leaks detected
- [ ] Task operations responsive

---

### Task 5.4: Security Audit

**Objective**: Verify security best practices are implemented

**Checklist**:
- [ ] `nodeIntegration: false` in all BrowserWindow configurations
- [ ] `contextIsolation: true` explicitly set
- [ ] `sandbox: true` enabled
- [ ] No direct IPC exposure (all through contextBridge)
- [ ] All IPC inputs validated
- [ ] No directory traversal vulnerabilities
- [ ] CSP header set correctly
- [ ] No inline scripts in HTML
- [ ] No eval() or similar dangerous functions
- [ ] Secure file operations

**Tools**:
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for known Electron vulnerabilities
npm outdated electron
```

**Validation**:
- [ ] No high/critical npm audit vulnerabilities
- [ ] All security best practices implemented
- [ ] No security warnings in DevTools

---

## Phase 6: Documentation and Finalization

### Task 6.1: Update Documentation

**Objective**: Update all documentation to reflect Electron 39

**Files to Update**:

1. **README.md**:
   - Update Electron version references
   - Update Node.js version requirements
   - Update installation instructions if changed

2. **package.json**:
   - Update version number (bump to 3.0.0 for major upgrade)
   - Verify all scripts still work

3. **Create UPGRADE_NOTES.md**:
```markdown
# Electron 39 Direct Upgrade Notes

## Version Changes
- Electron: 21.2.2 → 39.2.7
- Node.js: ~16.x → 22.20.0 (LTS until April 2027)
- Electron Forge: 6.0.0 → 7.10.2

## Upgrade Approach
Direct upgrade with Node.js priority

## Breaking Changes
- nodeIntegration now explicitly set to false
- contextIsolation now explicitly set to true
- Security enhancements: CSP, input validation

## Testing Results
- All tests passed: ✓
- Performance: within acceptable range
- Security audit: ✓

## Node.js 22 LTS Status
- Active LTS until October 2025
- Maintenance LTS until April 2027
- Production-ready and stable

## Known Issues
- [List any known issues]

## Rollback Procedure
- [Document how to rollback if needed]
```

**Validation**:
- [ ] All documentation updated
- [ ] Version numbers correct
- [ ] Instructions tested and verified
- [ ] UPGRADE_NOTES.md created

---

### Task 6.2: Create Git Commit

**Objective**: Properly version and commit the upgrade

**Steps**:
```bash
# 1. Review all changes
git status
git diff

# 2. Stage all changes
git add .

# 3. Commit with descriptive message
git commit -m "Direct upgrade: Electron 21.2.2 → 39.2.7 with Node.js 22 LTS

- Upgraded Node.js to 22.20.0 (LTS, EOL: April 2027)
- Upgraded Electron to 39.2.7 in direct upgrade
- Updated Electron Forge to 7.10.2
- Set nodeIntegration: false for security
- Added explicit contextIsolation: true
- Updated @types/node to 22.x
- Enhanced IPC input validation
- Added CSP headers
- All tests passing
- All functionality verified

Upgrade approach: Direct (Node.js first)
Timeline: 5-7 days
Risk: Low (well-architected codebase)

Breaking changes:
- nodeIntegration now false (was true)
- Explicit security configuration required

Refs: #[issue-number]"

# 4. Create a tag for this version
git tag -a v3.0.0 -m "Electron 39 direct upgrade - v3.0.0"

# 5. Push branch and tags
git push origin upgrade/electron-39-direct
git push origin v3.0.0
```

**Validation**:
- [ ] All changes committed
- [ ] Commit message is descriptive
- [ ] Tag created
- [ ] Pushed to remote

---

### Task 6.3: Cleanup

**Objective**: Remove temporary files

**Steps**:
```bash
# 1. Remove temporary files
rm -f current-versions.txt current-dependency-tree.txt outdated-packages.txt
rm -f NODE_22_COMPATIBILITY.md  # If you want to keep this, don't delete

# 2. Clean build artifacts
rm -rf dist out

# 3. Clean npm cache
npm cache clean --force

# 4. Final commit
git add .
git commit -m "Clean up temporary files from direct upgrade"
git push
```

---

## Success Criteria

### All Tasks Completed
- [ ] Phase 1-6 completed
- [ ] All validation checks passed
- [ ] All tests passed
- [ ] Documentation updated
- [ ] Code committed and pushed

### Application Functional
- [ ] Application builds successfully
- [ ] Application runs on all target platforms
- [ ] All features work as expected
- [ ] No errors or warnings
- [ ] Performance acceptable

### Security Verified
- [ ] Security audit passed
- [ ] Best practices implemented
- [ ] No known vulnerabilities

### Documentation Complete
- [ ] README updated
- [ ] UPGRADE_NOTES created
- [ ] All changes documented
- [ ] Version tagged

---

## Rollback Procedure

If critical issues are encountered:

```bash
# 1. Checkout original branch
git checkout inElectronJs

# 2. Delete upgrade branch (optional)
git branch -D upgrade/electron-39-direct

# 3. Remove any tags created
git tag -d v3.0.0
git push origin :refs/tags/v3.0.0

# 4. Clean install
rm -rf node_modules package-lock.json
npm install

# 5. Verify original version works
npm run build.prod
npm run start.electron
```

---

## Fallback to Incremental Upgrade

If the direct upgrade encounters blocking issues that cannot be resolved quickly:

**Option**: Switch to incremental upgrade approach
**Documentation**: See original ELECTRON_UPGRADE_ANALYSIS.md for incremental stages
**Timeline**: Add 2-5 additional days for incremental approach

**Incremental Path**:
```
21.2.2 → 25.x → 28.x → 31.x → 35.x → 39.2.7
```

This should only be used if direct upgrade fails due to:
- Critical breaking changes not caught in analysis
- Incompatible native modules
- Unresolvable build issues

---

## Support and Resources

### Getting Help
- Review ELECTRON_UPGRADE_ANALYSIS.md for detailed analysis
- Check Electron documentation: https://www.electronjs.org/docs
- Check breaking changes: https://github.com/electron/electron/blob/main/docs/breaking-changes.md
- Check Node.js 22 release notes: https://nodejs.org/en/blog/release/v22.11.0

### Common Issues and Solutions

**Issue**: npm install fails with dependency conflicts
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue**: Application doesn't start after upgrade
**Solution**: 
- Check console for errors
- Verify nodeIntegration: false doesn't break renderer code
- Check that all Node.js operations go through preload script

**Issue**: IPC communication broken
**Solution**:
- Verify contextBridge.exposeInMainWorld in preload.js
- Check that Angular code uses window.electronAPI
- Verify IPC handlers are registered before window loads

**Issue**: Build fails with TypeScript errors
**Solution**:
- Update TypeScript: `npm install --save-dev typescript@~5.3.0`
- Update @types/node: `npm install --save-dev @types/node@^22.10.0`
- Fix type errors in code

---

## Conclusion

This direct upgrade approach with Node.js 22 LTS priority provides:
- ✅ Faster delivery (5-7 days)
- ✅ Modern, stable foundation (LTS until 2027)
- ✅ Security improvements
- ✅ Performance enhancements
- ✅ Simplified upgrade path

**Estimated Total Time**: 5-7 days (optimistic) to 7-9 days (with buffer)
**Risk Level**: Low-Medium (well-architected codebase supports direct upgrade)
**Success Rate**: High (with proper testing)

Good luck with the direct upgrade! 🚀
