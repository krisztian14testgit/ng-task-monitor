# Angular Style Guide Checker

## Overview

This GitHub Action automatically checks Angular source code against the official [Angular Style Guide](https://angular.dev/style-guide) and generates a comprehensive compliance report.

## Features

The action analyzes your Angular codebase and checks for:

### 1. Naming Conventions
- File names should use kebab-case (e.g., `user-profile.component.ts`)
- Class names should use PascalCase with appropriate suffixes:
  - Components: `UserProfileComponent`
  - Services: `UserService`
  - Directives: `HighlightDirective`
  - Pipes: `DateFormatPipe`
- Component selectors should use kebab-case with proper prefix (e.g., `app-user-profile`)

### 2. Project Structure
- Files should be organized in appropriate folders:
  - Components in `/components/` or feature modules
  - Services in `/services/`
  - Directives in `/directives/`
  - Pipes in `/pipes/`
  - Models/Interfaces in `/models/` or `/interfaces/`

### 3. Dependency Injection
- Services must have `@Injectable` decorator
- Use constructor-based dependency injection with access modifiers:
  ```typescript
  constructor(private userService: UserService) {}
  ```
- Or use the modern `inject()` function:
  ```typescript
  private userService = inject(UserService);
  ```

### 4. Components and Directives Rules
- Components using lifecycle hooks should implement corresponding interfaces (e.g., `OnInit`, `OnDestroy`)
- Components should have `template` or `templateUrl`
- Keep components focused and small (< 400 lines recommended)
- Template files should be concise (< 100 lines recommended)
- Avoid inline styles in templates
- Use proper Angular syntax (`[]` for binding, `()` for events)
- Use `trackBy` with `*ngFor` for better performance

## Compliance Scoring

The checker generates a color-coded report based on compliance percentage:

- 🟢 **Green (≥80%)**: Files that passed - Well-structured and following Angular best practices
- 🟡 **Yellow (45-80%)**: Files that partially passed - Some improvements needed
- 🔴 **Red (<45%)**: Files that failed - Significant style guide violations

## Workflow Trigger

The action runs automatically on:
- Pull requests targeting the `main` branch

## Output

The action provides:

1. **Console Output**: Detailed analysis results in the workflow logs
2. **Markdown Report**: Downloadable artifact with complete compliance details
3. **PR Comment**: Automatic comment on the pull request with a summary

## Files

- `.github/workflows/angular-style-guide-checker.yml` - GitHub Actions workflow configuration
- `.github/scripts/angular-style-checker.js` - Style guide checker implementation

## How to Use

Simply create a pull request targeting the `main` branch. The action will:

1. Automatically analyze your Angular code
2. Generate a compliance report
3. Post a summary comment on your PR
4. Upload the full report as a workflow artifact

## Reviewing Results

### In PR Comments
Check the automated comment on your PR for a quick summary of compliance results.

### In Workflow Logs
View detailed analysis results in the GitHub Actions workflow run logs.

### Download Full Report
1. Go to the workflow run in GitHub Actions
2. Scroll to the "Artifacts" section
3. Download the `angular-style-guide-report` artifact
4. Open the `angular-style-guide-report.md` file

## Local Testing

You can run the checker locally:

```bash
node .github/scripts/angular-style-checker.js
```

This will:
- Analyze all TypeScript and HTML files in the `src/` directory
- Display results in the console
- Generate `angular-style-guide-report.md` in the project root

## Best Practices

To maintain high compliance scores:

1. **Follow Naming Conventions**: Use kebab-case for files, PascalCase for classes
2. **Organize Code**: Keep files in appropriate directories
3. **Keep It Small**: Split large components and templates
4. **Use TypeScript Features**: Leverage interfaces, types, and access modifiers
5. **Implement Lifecycle Interfaces**: When using hooks like `ngOnInit`, implement the corresponding interface
6. **Optimize Performance**: Use `trackBy` with `*ngFor` loops
7. **Clean Templates**: Avoid inline styles and prefer component CSS

## References

- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Documentation](https://angular.dev)
