# ElectronJS Upgrade Task Template for AI Agents

## Purpose
This document provides step-by-step instructions for AI agents to upgrade the ng-task-monitor project from Electron 21.2.2 to Electron 39.2.7. Each task is atomic, testable, and includes validation steps.

---

## Prerequisites

### Required Information
- **Source Branch**: `inElectronJs`
- **Target Electron Version**: 39.2.7
- **Target Node.js Version**: 22.20.0 (bundled with Electron 39)
- **Current Working Directory**: `/home/runner/work/ng-task-monitor/ng-task-monitor`

### Pre-Upgrade Checklist
- [ ] Backup current codebase
- [ ] Verify current application works correctly
- [ ] Document baseline performance metrics
- [ ] Set up test environment
- [ ] Review ELECTRON_UPGRADE_ANALYSIS.md

---

## Task Group 1: Environment Preparation

### Task 1.1: Branch Setup and Baseline Testing

**Objective**: Create a new upgrade branch and verify current functionality

**Steps**:
```bash
# 1. Checkout the inElectronJs branch
git checkout inElectronJs

# 2. Create a new upgrade branch
git checkout -b upgrade/electron-39-incremental

# 3. Verify Node.js and npm versions
node --version  # Should show system Node version
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

### Task 1.2: Document Current Dependencies

**Objective**: Create a snapshot of current dependencies for comparison

**Steps**:
```bash
# 1. List current versions
npm list electron @electron-forge/cli --depth=0 > current-versions.txt

# 2. Save full dependency tree
npm list > current-dependency-tree.txt

# 3. Check for outdated packages
npm outdated > outdated-packages.txt

# 4. Add to git (for tracking, not committing)
git add current-*.txt outdated-packages.txt
```

**Validation**:
- [ ] current-versions.txt created with Electron 21.2.2
- [ ] Dependency tree captured
- [ ] Outdated packages identified

**Output Files**:
- `current-versions.txt`
- `current-dependency-tree.txt`
- `outdated-packages.txt`

---

## Task Group 2: Incremental Electron Upgrades

### Task 2.1: Upgrade to Electron 25.x

**Objective**: First incremental upgrade from 21 to 25

**Steps**:
```bash
# 1. Update Electron to version 25.x
npm install --save-dev electron@^25.9.8

# 2. Update Electron Forge packages
npm install --save-dev @electron-forge/cli@^6.4.2
npm install --save-dev @electron-forge/maker-deb@^6.4.2
npm install --save-dev @electron-forge/maker-rpm@^6.4.2
npm install --save-dev @electron-forge/maker-squirrel@^6.4.2
npm install --save-dev @electron-forge/maker-zip@^6.4.2

# 3. Clear npm cache
npm cache clean --force

# 4. Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 5. Test the application
npm run build.prod
npm run start.electron
```

**Code Changes Required**:

File: `electronJs/app.js`
```javascript
// Update webPreferences for better security
webPreferences: {
    nodeIntegration: false,        // CHANGED from true
    contextIsolation: true,        // EXPLICITLY added
    sandbox: true,
    preload: path.join(__dirname, 'preload.js'),
}
```

**Validation**:
- [ ] Electron 25.x installed successfully
- [ ] No dependency conflicts
- [ ] Application builds without errors
- [ ] Application launches successfully
- [ ] All IPC communications work (test location save/load, task operations)
- [ ] File operations work correctly
- [ ] No console errors or warnings

**Testing Checklist**:
- [ ] Launch application
- [ ] Create a new task
- [ ] Save task list
- [ ] Load task list
- [ ] Change location settings
- [ ] Test all UI interactions
- [ ] Close and reopen application

**Rollback**:
```bash
git checkout package.json package-lock.json electronJs/app.js
npm install
```

---

### Task 2.2: Upgrade to Electron 28.x

**Objective**: Second incremental upgrade from 25 to 28

**Steps**:
```bash
# 1. Update Electron to version 28.x
npm install --save-dev electron@^28.3.3

# 2. Update @types/node for Node.js 18 (bundled with Electron 28)
npm install --save-dev @types/node@^18.19.0

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Test the application
npm run build.prod
npm run start.electron
```

**Code Review Required**:
- Review all IPC handlers for security best practices
- Ensure input validation in all handlers

**Validation**:
- [ ] Electron 28.x installed successfully
- [ ] Application builds without errors
- [ ] All functionality works as expected
- [ ] No new security warnings
- [ ] IPC communications work correctly

**Testing**: Same as Task 2.1

**Rollback**:
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task 2.3: Upgrade to Electron 31.x

**Objective**: Third incremental upgrade from 28 to 31

**Steps**:
```bash
# 1. Update Electron to version 31.x
npm install --save-dev electron@^31.7.5

# 2. Update @types/node for Node.js 20
npm install --save-dev @types/node@^20.16.0

# 3. Update Electron Forge to v7.x (major upgrade)
npm install --save-dev @electron-forge/cli@^7.5.0
npm install --save-dev @electron-forge/maker-deb@^7.5.0
npm install --save-dev @electron-forge/maker-rpm@^7.5.0
npm install --save-dev @electron-forge/maker-squirrel@^7.5.0
npm install --save-dev @electron-forge/maker-zip@^7.5.0

# 4. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 5. Test the application
npm run build.prod
npm run start.electron
```

**Electron Forge Configuration Update**:

The Electron Forge v7 may require configuration updates. Check if `config.forge` in package.json needs migration.

Current structure should work, but verify:
```json
"config": {
  "forge": {
    "packagerConfig": { ... },
    "makers": [ ... ]
  }
}
```

**Validation**:
- [ ] Electron 31.x installed successfully
- [ ] Electron Forge 7.x working
- [ ] Application builds without errors
- [ ] Packaging works: `npm run package`
- [ ] All functionality works as expected

**Testing**: Same as Task 2.1 + packaging test

**Rollback**:
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task 2.4: Upgrade to Electron 35.x

**Objective**: Fourth incremental upgrade from 31 to 35

**Steps**:
```bash
# 1. Update Electron to version 35.x
npm install --save-dev electron@^35.2.0

# 2. Update @types/node for Node.js 20
npm install --save-dev @types/node@^20.17.0

# 3. Update Electron Forge
npm install --save-dev @electron-forge/cli@^7.6.0
npm install --save-dev @electron-forge/maker-deb@^7.6.0
npm install --save-dev @electron-forge/maker-rpm@^7.6.0
npm install --save-dev @electron-forge/maker-squirrel@^7.6.0
npm install --save-dev @electron-forge/maker-zip@^7.6.0

# 4. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 5. Test the application
npm run build.prod
npm run start.electron
```

**Validation**:
- [ ] Electron 35.x installed successfully
- [ ] Application builds without errors
- [ ] All functionality works as expected
- [ ] No deprecated API warnings

**Testing**: Same as Task 2.1

**Rollback**:
```bash
git checkout package.json package-lock.json
npm install
```

---

### Task 2.5: Final Upgrade to Electron 39.x

**Objective**: Final upgrade to target version Electron 39.2.7

**Steps**:
```bash
# 1. Update Electron to version 39.x
npm install --save-dev electron@^39.2.7

# 2. Update @types/node for Node.js 22
npm install --save-dev @types/node@^22.10.0

# 3. Update Electron Forge to latest
npm install --save-dev @electron-forge/cli@^7.10.2
npm install --save-dev @electron-forge/maker-deb@^7.10.2
npm install --save-dev @electron-forge/maker-rpm@^7.10.2
npm install --save-dev @electron-forge/maker-squirrel@^7.10.2
npm install --save-dev @electron-forge/maker-zip@^7.10.2

# 4. Update electron-squirrel-startup if needed
npm install --save electron-squirrel-startup@latest

# 5. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 6. Test the application
npm run build.prod
npm run start.electron
```

**Validation**:
- [ ] Electron 39.2.7 installed successfully
- [ ] Node.js 22.20.0 types available
- [ ] Application builds without errors
- [ ] All functionality works as expected
- [ ] No deprecated API warnings

**Testing**: Same as Task 2.1

**Rollback**:
```bash
git checkout package.json package-lock.json
npm install
```

---

## Task Group 3: Code Modernization

### Task 3.1: Update Node.js File Handler for Node 22

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

### Task 3.2: Enhance Security Configuration

**Objective**: Implement security best practices for Electron 39

**File**: `electronJs/app.js`

**Required Changes**:

1. **Add Content Security Policy**:
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
            // ADD: Content Security Policy
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

2. **Add IPC Input Validation** (example):

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

**Validation**:
- [ ] CSP header set correctly
- [ ] No inline scripts allowed (if any exist, refactor them)
- [ ] Input validation added to all IPC handlers
- [ ] Path sanitization prevents directory traversal
- [ ] Application still works correctly

---

### Task 3.3: Add TypeScript Compatibility (Optional)

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

**Files to Check**:
- All `.ts` files in `src/` directory
- Look for Node.js type usage

**Validation**:
- [ ] TypeScript compiles without errors
- [ ] No type errors related to Node.js APIs
- [ ] Angular build still works

---

## Task Group 4: Testing and Validation

### Task 4.1: Comprehensive Functional Testing

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
   - [ ] Single instance lock works (can't open multiple)
   - [ ] Window close/minimize/maximize works
   - [ ] Application quits correctly

8. **Platform-Specific (if applicable)**
   - [ ] Mac: App stays in dock when closed
   - [ ] Windows/Linux: App quits when closed

**Test on Multiple Platforms**:
- [ ] Windows 10/11
- [ ] macOS (if available)
- [ ] Linux (Ubuntu/Debian)

---

### Task 4.2: Build and Packaging Testing

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

### Task 4.3: Performance Testing

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

# 2. Monitor memory usage (manual - use Task Manager/Activity Monitor)
# Check memory usage after 5 minutes of idle

# 3. Test task operations performance
# Create 100 tasks, measure save time
# Load 100 tasks, measure load time

# 4. Profile with DevTools
# Open DevTools -> Performance tab -> Record
```

**Baseline** (Electron 21):
- Document current metrics before upgrade

**Target** (Electron 39):
- Startup time: Within 10% of baseline
- Memory usage: Within 15% of baseline
- Task operations: Within 10% of baseline

**Validation**:
- [ ] Startup time acceptable
- [ ] Memory usage acceptable
- [ ] No memory leaks detected
- [ ] Task operations responsive

---

### Task 4.4: Security Audit

**Objective**: Verify security best practices are implemented

**Checklist**:
- [ ] `nodeIntegration: false` in all BrowserWindow configurations
- [ ] `contextIsolation: true` explicitly set
- [ ] `sandbox: true` enabled
- [ ] No direct IPC exposure (all through contextBridge)
- [ ] All IPC inputs validated
- [ ] No directory traversal vulnerabilities
- [ ] No arbitrary code execution vulnerabilities
- [ ] CSP header set correctly
- [ ] No inline scripts in HTML (check Angular output)
- [ ] No eval() or similar dangerous functions
- [ ] Secure file operations (no arbitrary file access)

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

## Task Group 5: Documentation and Finalization

### Task 5.1: Update Documentation

**Objective**: Update all documentation to reflect Electron 39

**Files to Update**:

1. **README.md**:
   - Update Electron version references
   - Update Node.js version requirements
   - Update installation instructions if changed
   - Update build instructions if changed

2. **package.json**:
   - Update description
   - Update version number (bump to 3.0.0 for major upgrade?)
   - Verify all scripts still work

3. **Create UPGRADE_NOTES.md**:
   - Document what changed
   - Document breaking changes
   - Document migration steps
   - Known issues

**Template for UPGRADE_NOTES.md**:
```markdown
# Electron 39 Upgrade Notes

## Version Changes
- Electron: 21.2.2 → 39.2.7
- Node.js: ~16.x → 22.20.0
- Electron Forge: 6.0.0 → 7.10.2

## Breaking Changes
- nodeIntegration now explicitly set to false
- contextIsolation now explicitly set to true
- [Add any other breaking changes encountered]

## Migration Steps
- [Document steps taken]

## Testing Results
- All tests passed: ✓/✗
- Performance: [within/outside] acceptable range
- Security audit: ✓/✗

## Known Issues
- [List any known issues]

## Rollback Procedure
- [Document how to rollback if needed]
```

**Validation**:
- [ ] All documentation updated
- [ ] Version numbers correct everywhere
- [ ] Instructions tested and verified
- [ ] UPGRADE_NOTES.md created

---

### Task 5.2: Create Git Commit and Tags

**Objective**: Properly version and commit the upgrade

**Steps**:
```bash
# 1. Stage all changes
git add .

# 2. Commit with descriptive message
git commit -m "Upgrade Electron from 21.2.2 to 39.2.7

- Updated Electron to 39.2.7 (Node.js 22.20.0)
- Updated Electron Forge to 7.10.2
- Set nodeIntegration: false for security
- Added explicit contextIsolation: true
- Updated @types/node to 22.x
- Enhanced IPC input validation
- Added CSP headers
- All tests passing
- All functionality verified

Breaking changes:
- nodeIntegration now false (was true)
- Explicit security configuration required

Refs: #[issue-number]"

# 3. Create a tag for this version
git tag -a v3.0.0 -m "Electron 39 upgrade - v3.0.0"

# 4. Push branch and tags
git push origin upgrade/electron-39-incremental
git push origin v3.0.0
```

**Validation**:
- [ ] All changes committed
- [ ] Commit message is descriptive
- [ ] Tag created
- [ ] Pushed to remote

---

### Task 5.3: Cleanup

**Objective**: Remove temporary files and clean up

**Steps**:
```bash
# 1. Remove temporary files created during analysis
rm -f current-versions.txt current-dependency-tree.txt outdated-packages.txt

# 2. Clean build artifacts
rm -rf dist out

# 3. Clean npm cache
npm cache clean --force

# 4. Commit cleanup
git add .
git commit -m "Clean up temporary files from upgrade process"
git push
```

**Validation**:
- [ ] Temporary files removed
- [ ] Build artifacts cleaned
- [ ] Repository clean

---

## Success Criteria

### All Tasks Completed
- [ ] All Task Groups 1-5 completed
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
git branch -D upgrade/electron-39-incremental

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

## Support and Resources

### Getting Help
- Review ELECTRON_UPGRADE_ANALYSIS.md for detailed analysis
- Check Electron documentation: https://www.electronjs.org/docs
- Check breaking changes: https://github.com/electron/electron/blob/main/docs/breaking-changes.md
- Search Electron issues: https://github.com/electron/electron/issues

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

This task template provides a comprehensive, step-by-step approach to upgrading Electron from 21.2.2 to 39.2.7. By following these tasks incrementally and validating at each step, the upgrade can be completed safely and effectively.

**Estimated Total Time**: 7-12 days
**Risk Level**: Medium (mitigated by incremental approach)
**Success Rate**: High (with proper testing)

Good luck with the upgrade! 🚀
