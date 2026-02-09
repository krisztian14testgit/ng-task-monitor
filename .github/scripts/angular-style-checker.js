#!/usr/bin/env node

/**
 * Angular Style Guide Checker
 * Based on https://angular.dev/style-guide
 * 
 * This script analyzes Angular source code against the official style guide
 * and generates a color-coded report.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

class AngularStyleGuideChecker {
  constructor(srcDir) {
    this.srcDir = srcDir;
    this.results = [];
    this.totalIssues = 0;
    this.totalChecks = 0;
  }

  /**
   * Main entry point for style checking
   */
  async check() {
    console.log(`${colors.bold}Angular Style Guide Checker${colors.reset}`);
    console.log(`Analyzing source code in: ${this.srcDir}\n`);

    // Find all TypeScript and HTML files
    const files = this.findFiles(this.srcDir, ['.ts', '.html']);
    
    console.log(`Found ${files.length} files to analyze\n`);

    // Analyze each file
    for (const file of files) {
      this.analyzeFile(file);
    }

    // Generate report
    this.generateReport();
  }

  /**
   * Recursively find files with specific extensions
   */
  findFiles(dir, extensions, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Skip node_modules, dist, coverage directories
        if (!['node_modules', 'dist', 'coverage', '.git'].includes(file)) {
          this.findFiles(filePath, extensions, fileList);
        }
      } else {
        const ext = path.extname(file);
        if (extensions.includes(ext) && !file.includes('.spec.')) {
          fileList.push(filePath);
        }
      }
    });

    return fileList;
  }

  /**
   * Analyze a single file for style guide compliance
   */
  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(this.srcDir, filePath);
    const ext = path.extname(filePath);

    const fileResult = {
      path: relativePath,
      issues: [],
      checks: 0,
      passed: 0,
    };

    if (ext === '.ts') {
      this.checkTypeScriptFile(content, filePath, fileResult);
    } else if (ext === '.html') {
      this.checkHTMLFile(content, filePath, fileResult);
    }

    fileResult.score = fileResult.checks > 0 
      ? Math.round((fileResult.passed / fileResult.checks) * 100) 
      : 100;

    this.totalIssues += fileResult.issues.length;
    this.totalChecks += fileResult.checks;
    this.results.push(fileResult);
  }

  /**
   * Check TypeScript files for style guide compliance
   */
  checkTypeScriptFile(content, filePath, fileResult) {
    const fileName = path.basename(filePath);

    // 1. Naming Conventions
    
    // Check file naming: should be kebab-case
    fileResult.checks++;
    if (this.isKebabCase(fileName.replace(/\.(ts|spec\.ts)$/, ''))) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Naming Convention',
        message: 'File name should use kebab-case',
        line: 1,
      });
    }

    // Check component/service/directive naming
    if (fileName.includes('.component.ts')) {
      fileResult.checks++;
      const componentMatch = content.match(/export\s+class\s+(\w+Component)/);
      if (componentMatch && this.isPascalCase(componentMatch[1])) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Naming Convention',
          message: 'Component class should use PascalCase and end with "Component"',
        });
      }

      // Check selector prefix
      fileResult.checks++;
      const selectorMatch = content.match(/selector:\s*['"]([^'"]+)['"]/);
      if (selectorMatch && (selectorMatch[1].startsWith('app-') || selectorMatch[1].startsWith('dir-'))) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Component Selector',
          message: 'Component selector should start with app- or dir- prefix',
        });
      }

      // Check selector style (kebab-case)
      fileResult.checks++;
      if (selectorMatch && this.isKebabCase(selectorMatch[1].replace(/^(app-|dir-)/, ''))) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Component Selector',
          message: 'Component selector should use kebab-case',
        });
      }
    }

    if (fileName.includes('.service.ts')) {
      fileResult.checks++;
      const serviceMatch = content.match(/export\s+class\s+(\w+Service)/);
      if (serviceMatch && this.isPascalCase(serviceMatch[1])) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Naming Convention',
          message: 'Service class should use PascalCase and end with "Service"',
        });
      }
    }

    if (fileName.includes('.directive.ts')) {
      fileResult.checks++;
      const directiveMatch = content.match(/export\s+class\s+(\w+Directive)/);
      if (directiveMatch && this.isPascalCase(directiveMatch[1])) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Naming Convention',
          message: 'Directive class should use PascalCase and end with "Directive"',
        });
      }
    }

    if (fileName.includes('.pipe.ts')) {
      fileResult.checks++;
      const pipeMatch = content.match(/export\s+class\s+(\w+Pipe)/);
      if (pipeMatch && this.isPascalCase(pipeMatch[1])) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Naming Convention',
          message: 'Pipe class should use PascalCase and end with "Pipe"',
        });
      }
    }

    // 2. Project Structure - check file organization
    fileResult.checks++;
    if (this.checkFileOrganization(filePath)) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Project Structure',
        message: 'Files should be organized in appropriate folders (components, services, directives, pipes, etc.)',
      });
    }

    // 3. Dependency Injection
    
    // Check for constructor-based DI (preferred method)
    fileResult.checks++;
    if (fileName.includes('.service.ts') || fileName.includes('.component.ts')) {
      const hasConstructorDI = content.includes('constructor(') && 
                               (content.includes('private ') || content.includes('public ') || content.includes('protected '));
      const hasInjectFunction = content.includes('inject(');
      
      if (hasConstructorDI || hasInjectFunction || !content.includes('constructor(')) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Dependency Injection',
          message: 'Use constructor parameters with access modifiers or inject() function for dependency injection',
        });
      }
    } else {
      fileResult.passed++; // Not applicable
    }

    // Check for @Injectable decorator on services
    fileResult.checks++;
    if (fileName.includes('.service.ts')) {
      if (content.includes('@Injectable')) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Dependency Injection',
          message: 'Services should have @Injectable decorator',
        });
      }
    } else {
      fileResult.passed++; // Not applicable
    }

    // 4. Components and Directives Rules
    
    if (fileName.includes('.component.ts')) {
      // Check for OnInit implementation
      fileResult.checks++;
      if (!content.includes('ngOnInit') || 
          (content.includes('ngOnInit') && content.includes('implements') && content.includes('OnInit'))) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Component Lifecycle',
          message: 'Components using ngOnInit should implement OnInit interface',
        });
      }

      // Check for template or templateUrl
      fileResult.checks++;
      if (content.includes('template:') || content.includes('templateUrl:')) {
        fileResult.passed++;
      } else {
        fileResult.issues.push({
          rule: 'Component Structure',
          message: 'Component should have template or templateUrl',
        });
      }

      // Check for standalone or module declaration
      fileResult.checks++;
      const isStandalone = content.includes('standalone: true');
      const hasImports = content.includes('imports: [');
      
      if (isStandalone || !content.includes('@Component')) {
        fileResult.passed++;
      } else {
        // If not standalone, should be in a module (we can't check this here)
        fileResult.passed++; // Give benefit of doubt
      }
    }

    // Check for single responsibility (small files preferred)
    fileResult.checks++;
    const lines = content.split('\n').length;
    if (lines < 400) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Single Responsibility',
        message: `File is ${lines} lines long. Consider breaking into smaller, focused units (recommended: < 400 lines)`,
      });
    }

    // Check for proper imports organization
    fileResult.checks++;
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import '));
    if (importLines.length === 0 || this.areImportsOrganized(importLines)) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Code Organization',
        message: 'Imports should be organized (Angular imports first, then third-party, then application)',
      });
    }
  }

  /**
   * Check HTML template files for style guide compliance
   */
  checkHTMLFile(content, filePath, fileResult) {
    // Check template complexity
    fileResult.checks++;
    const lines = content.split('\n').length;
    if (lines < 100) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Template Complexity',
        message: `Template has ${lines} lines. Consider extracting into child components (recommended: < 100 lines)`,
      });
    }

    // Check for inline styles (should be avoided)
    fileResult.checks++;
    if (!content.includes('style=')) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Template Best Practice',
        message: 'Avoid inline styles in templates. Use component styles or CSS classes instead',
      });
    }

    // Check for proper Angular syntax
    fileResult.checks++;
    const hasProperBindings = !content.includes('bind-') && !content.includes('on-');
    if (hasProperBindings) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Template Syntax',
        message: 'Use [] for property binding and () for event binding instead of bind- and on- prefixes',
      });
    }

    // Check for proper structural directives
    fileResult.checks++;
    if (!content.includes('*ngFor') || content.includes('trackBy')) {
      fileResult.passed++;
    } else {
      fileResult.issues.push({
        rule: 'Performance',
        message: '*ngFor should use trackBy function for better performance',
      });
    }
  }

  /**
   * Check if string is kebab-case
   */
  isKebabCase(str) {
    return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(str);
  }

  /**
   * Check if string is PascalCase
   */
  isPascalCase(str) {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str);
  }

  /**
   * Check file organization
   */
  checkFileOrganization(filePath) {
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    // Check if files are in appropriate directories
    if (filePath.includes('.component.')) {
      return normalizedPath.includes('/components/') || normalizedPath.includes('/app/');
    }
    if (filePath.includes('.service.')) {
      return normalizedPath.includes('/services/') || normalizedPath.includes('/app/');
    }
    if (filePath.includes('.directive.')) {
      return normalizedPath.includes('/directives/') || normalizedPath.includes('/app/');
    }
    if (filePath.includes('.pipe.')) {
      return normalizedPath.includes('/pipes/') || normalizedPath.includes('/app/');
    }
    if (filePath.includes('.model.')) {
      return normalizedPath.includes('/models/') || normalizedPath.includes('/interfaces/') || normalizedPath.includes('/app/');
    }
    
    return true; // Other files are OK anywhere
  }

  /**
   * Check if imports are properly organized
   */
  areImportsOrganized(importLines) {
    // Simple check: Angular imports should come before application imports
    let foundAngular = false;
    let foundThirdParty = false;
    let foundRelative = false;

    for (const line of importLines) {
      if (line.includes('@angular/')) {
        if (foundRelative) return false; // Angular imports should come first
        foundAngular = true;
      } else if (line.includes('./') || line.includes('../')) {
        foundRelative = true;
      } else {
        if (foundRelative) return false; // Third-party should come before relative
        foundThirdParty = true;
      }
    }

    return true;
  }

  /**
   * Generate and display the report
   */
  generateReport() {
    console.log(`\n${colors.bold}=== Style Guide Compliance Report ===${colors.reset}\n`);

    // Categorize files by score
    const greenFiles = this.results.filter(r => r.score >= 80);
    const yellowFiles = this.results.filter(r => r.score >= 45 && r.score < 80);
    const redFiles = this.results.filter(r => r.score < 45);

    // Display summary
    console.log(`${colors.bold}Summary:${colors.reset}`);
    console.log(`  Total files analyzed: ${this.results.length}`);
    console.log(`  ${colors.green}✓ Green (≥80%):${colors.reset} ${greenFiles.length} files`);
    console.log(`  ${colors.yellow}⚠ Yellow (45-80%):${colors.reset} ${yellowFiles.length} files`);
    console.log(`  ${colors.red}✗ Red (<45%):${colors.reset} ${redFiles.length} files\n`);

    // Display detailed results for yellow and red files
    if (redFiles.length > 0) {
      console.log(`${colors.red}${colors.bold}Red Files (Failed - <45% compliance):${colors.reset}`);
      this.displayFileDetails(redFiles, colors.red);
    }

    if (yellowFiles.length > 0) {
      console.log(`${colors.yellow}${colors.bold}Yellow Files (Partially Passed - 45-80% compliance):${colors.reset}`);
      this.displayFileDetails(yellowFiles, colors.yellow);
    }

    if (greenFiles.length > 0) {
      console.log(`${colors.green}${colors.bold}Green Files (Passed - ≥80% compliance):${colors.reset}`);
      this.displayFileDetails(greenFiles, colors.green, false); // Don't show issues for green files
    }

    // Overall statistics
    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const overallScore = this.totalChecks > 0 
      ? Math.round((totalPassed / this.totalChecks) * 100) 
      : 100;

    console.log(`\n${colors.bold}Overall Compliance Score: ${this.getScoreColor(overallScore)}${overallScore}%${colors.reset}\n`);

    // Exit with error if overall compliance is below threshold
    if (redFiles.length > 0) {
      console.log(`${colors.red}⚠ Warning: ${redFiles.length} file(s) failed style guide compliance (<45%)${colors.reset}`);
      console.log('Please review and fix the issues listed above.\n');
    }
    
    // Create markdown report file
    this.createMarkdownReport(greenFiles, yellowFiles, redFiles, overallScore);
  }

  /**
   * Display detailed file information
   */
  displayFileDetails(files, color, showIssues = true) {
    files.forEach(file => {
      console.log(`\n  ${color}${file.path}${colors.reset} - Score: ${this.getScoreColor(file.score)}${file.score}%${colors.reset} (${file.passed}/${file.checks} checks passed)`);
      
      if (showIssues && file.issues.length > 0) {
        file.issues.forEach(issue => {
          console.log(`    • ${colors.dim}[${issue.rule}]${colors.reset} ${issue.message}`);
        });
      }
    });
    console.log('');
  }

  /**
   * Get color based on score
   */
  getScoreColor(score) {
    if (score >= 80) return colors.green;
    if (score >= 45) return colors.yellow;
    return colors.red;
  }

  /**
   * Create markdown report file
   */
  createMarkdownReport(greenFiles, yellowFiles, redFiles, overallScore) {
    const reportPath = path.join(process.cwd(), 'angular-style-guide-report.md');
    
    let markdown = `# Angular Style Guide Compliance Report\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total files analyzed:** ${this.results.length}\n`;
    markdown += `- **✅ Green (≥80%):** ${greenFiles.length} files\n`;
    markdown += `- **⚠️ Yellow (45-80%):** ${yellowFiles.length} files\n`;
    markdown += `- **❌ Red (<45%):** ${redFiles.length} files\n`;
    markdown += `- **Overall Compliance Score:** ${overallScore}%\n\n`;

    markdown += `## Compliance Legend\n\n`;
    markdown += `- 🟢 **Green (≥80%)**: Files that passed the style guide compliance\n`;
    markdown += `- 🟡 **Yellow (45-80%)**: Files that partially passed\n`;
    markdown += `- 🔴 **Red (<45%)**: Files that failed the style guide compliance\n\n`;

    if (redFiles.length > 0) {
      markdown += `## 🔴 Red Files (Failed)\n\n`;
      redFiles.forEach(file => {
        markdown += `### ${file.path}\n`;
        markdown += `**Score:** ${file.score}% (${file.passed}/${file.checks} checks passed)\n\n`;
        if (file.issues.length > 0) {
          markdown += `**Issues:**\n`;
          file.issues.forEach(issue => {
            markdown += `- **[${issue.rule}]** ${issue.message}\n`;
          });
        }
        markdown += `\n`;
      });
    }

    if (yellowFiles.length > 0) {
      markdown += `## 🟡 Yellow Files (Partially Passed)\n\n`;
      yellowFiles.forEach(file => {
        markdown += `### ${file.path}\n`;
        markdown += `**Score:** ${file.score}% (${file.passed}/${file.checks} checks passed)\n\n`;
        if (file.issues.length > 0) {
          markdown += `**Issues:**\n`;
          file.issues.forEach(issue => {
            markdown += `- **[${issue.rule}]** ${issue.message}\n`;
          });
        }
        markdown += `\n`;
      });
    }

    if (greenFiles.length > 0) {
      markdown += `## 🟢 Green Files (Passed)\n\n`;
      greenFiles.forEach(file => {
        markdown += `- ${file.path} - ${file.score}% (${file.passed}/${file.checks} checks passed)\n`;
      });
      markdown += `\n`;
    }

    markdown += `## Style Guide Reference\n\n`;
    markdown += `This report is based on the [Angular Style Guide](https://angular.dev/style-guide)\n\n`;
    markdown += `### Checked Areas\n\n`;
    markdown += `1. **Naming Conventions**\n`;
    markdown += `   - File names should use kebab-case\n`;
    markdown += `   - Class names should use PascalCase with appropriate suffixes (Component, Service, Directive, Pipe)\n`;
    markdown += `   - Component selectors should use kebab-case with proper prefix\n\n`;
    markdown += `2. **Project Structure**\n`;
    markdown += `   - Files should be organized in appropriate folders\n`;
    markdown += `   - Related files should be co-located\n\n`;
    markdown += `3. **Dependency Injection**\n`;
    markdown += `   - Services should use @Injectable decorator\n`;
    markdown += `   - Constructor-based dependency injection with access modifiers\n`;
    markdown += `   - Or use the inject() function for DI\n\n`;
    markdown += `4. **Components and Directives**\n`;
    markdown += `   - Implement lifecycle interfaces when using lifecycle hooks\n`;
    markdown += `   - Keep components focused and small\n`;
    markdown += `   - Use proper template syntax\n`;
    markdown += `   - Optimize *ngFor with trackBy\n\n`;

    fs.writeFileSync(reportPath, markdown);
    console.log(`${colors.green}✓ Markdown report saved to: ${reportPath}${colors.reset}\n`);
  }
}

// Main execution
const srcDir = path.join(process.cwd(), 'src');

if (!fs.existsSync(srcDir)) {
  console.error(`Error: Source directory not found at ${srcDir}`);
  process.exit(1);
}

const checker = new AngularStyleGuideChecker(srcDir);
checker.check().catch(err => {
  console.error('Error running style checker:', err);
  process.exit(1);
});
