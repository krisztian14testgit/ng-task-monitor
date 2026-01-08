# AI Agent Tasks: Angular v17-21 Modernization

## Question 3: AI Agent for Rewriting Codebase with Modern Angular Features

This document provides detailed tasks for an AI agent to modernize the ng-task-monitor codebase after upgrading to Angular v21, applying features from Angular v17-21:
- TypeScript 5.6 integration
- Declarative control flow (@if, @for) - **@switch is excluded per user request**
- **Deferrable loading (@defer) is excluded per user request**
- Signals for reactive state (restricted usage - see guidelines)
- Standalone components
- View Transition API (experimental)
- Improved SSR support
- Router refactoring

---

## Prerequisites

Before starting these tasks, ensure:
- [ ] Angular v21 upgrade is complete (use AI_AGENT_UPGRADE_TASKS.md)
- [ ] All tests pass in Angular v21
- [ ] Application is stable and deployed
- [ ] Backup created
- [ ] Team trained on modern Angular features

---

## Important Constraints

### RxJS Preservation
- **Keep all RxJS functions and solutions**
- Do NOT convert RxJS patterns to Signals
- Only update obsolete RxJS operators to their recommended replacements
- HTTP requests remain with RxJS Observables
- Event streams and complex async operations stay with RxJS

### Signal Usage Restrictions
**Use Signals ONLY for**:
- Primitive types: `string`, `number`, `boolean`
- Simple values, not complex objects or unknown types
- Replacing `ngOnChanges` lifecycle hooks with input signals

**DO NOT use Signals for**:
- Complex references like `this.ref.properties.value`
- Objects with nested properties
- Arrays of complex objects
- Unknown or any types

**Example of allowed Signal usage**:
```typescript
// ✅ ALLOWED - Primitive types
selectedTab = signal<string>('tasks');
count = signal<number>(0);
isLoading = signal<boolean>(false);

// ✅ ALLOWED - Replacing ngOnChanges with input signals
@Input() timerInMinutes = input<number>(0);

// ❌ NOT ALLOWED - Complex objects
task = signal<Task>({ id: 1, name: 'test', status: 'pending' });

// ❌ NOT ALLOWED - Complex nested references
this.mySignal().property.value
```

---

## Modernization Strategy

**Approach**: Incremental, module-by-module migration  
**Duration**: 3-4 weeks (reduced without @defer tasks)  
**Risk**: Low (can rollback at any step)

---

## Phase 1: Convert to Standalone Components

### Task MOD-001: Convert Change-Location Module to Standalone

**Dependencies**: Angular v21 upgrade complete  
**Objective**: Convert simplest module first to establish pattern  
**Estimated Time**: 4-6 hours

**Instructions**:

1. **Analyze current module structure**:
   ```bash
   cd /home/runner/work/ng-task-monitor/ng-task-monitor
   cat src/app/modules/change-location/change-location.module.ts
   ```

2. **Convert module components to standalone**:
   - Open each component in change-location module
   - Add `standalone: true` to @Component decorator
   - Move imports from module to component `imports` array
   - Update component decorator:
   
   ```typescript
   // BEFORE
   @Component({
     selector: 'app-change-location',
     templateUrl: './change-location.component.html',
   })
   
   // AFTER
   @Component({
     selector: 'app-change-location',
     standalone: true,
     imports: [
       CommonModule,
       FormsModule,
       // Add other necessary imports
     ],
     templateUrl: './change-location.component.html',
   })
   ```

3. **Update routing**:
   - Convert module routing to functional routes
   - Remove RouterModule.forChild()
   - Use direct component import:
   
   ```typescript
   // BEFORE (change-location-routing.module.ts)
   const routes: Routes = [
     { path: '', component: ChangeLocationComponent }
   ];
   @NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
   })
   
   // AFTER (change-location.routes.ts)
   import { Routes } from '@angular/router';
   import { ChangeLocationComponent } from './change-location.component';
   
   export const CHANGE_LOCATION_ROUTES: Routes = [
     { path: '', component: ChangeLocationComponent }
   ];
   ```

4. **Update lazy loading in app routes**:
   ```typescript
   // BEFORE (app-routing.module.ts)
   {
     path: 'location',
     loadChildren: () => import('./modules/change-location/change-location.module')
       .then(m => m.ChangeLocationModule)
   }
   
   // AFTER (app.routes.ts)
   {
     path: 'location',
     loadComponent: () => import('./modules/change-location/change-location.component')
       .then(m => m.ChangeLocationComponent)
   }
   ```

5. **Delete module files**:
   ```bash
   rm src/app/modules/change-location/change-location.module.ts
   rm src/app/modules/change-location/change-location-routing.module.ts
   ```

6. **Test**:
   ```bash
   npm run build.prod
   npm run lint
   npm start
   # Navigate to /location and verify it works
   ```

**Verification**:
- [ ] change-location.module.ts deleted
- [ ] Component is standalone
- [ ] Route works in browser
- [ ] Build succeeds
- [ ] No console errors

**Rollback**: 
```bash
git checkout src/app/modules/change-location/
```

---

### Task MOD-002: Convert Statistic Module to Standalone

**Dependencies**: MOD-001  
**Objective**: Convert statistic module with chart components  
**Estimated Time**: 6-8 hours

**Instructions**:

1. **Convert main statistic component**:
   ```typescript
   // src/app/modules/statistic/statistic.component.ts
   @Component({
     selector: 'app-statistic',
     standalone: true,
     imports: [
       CommonModule,
       FormsModule,
       MatCardModule,
       MatSelectModule,
       TaskCountChartComponent, // Child components
       LineChartComponent,
       // Chart library imports (ng2-charts v8)
     ],
     templateUrl: './statistic.component.html',
   })
   ```

2. **Convert chart components to standalone**:
   - TaskCountChartComponent
   - LineChartComponent
   
   For each:
   ```typescript
   @Component({
     selector: 'app-task-count-chart',
     standalone: true,
     imports: [
       CommonModule,
       // Chart library imports
     ],
     templateUrl: './task-count-chart.component.html',
   })
   ```

3. **Update routing**:
   ```typescript
   // statistic.routes.ts
   export const STATISTIC_ROUTES: Routes = [
     { path: '', component: StatisticComponent }
   ];
   ```

4. **Update app routes**:
   ```typescript
   {
     path: 'statistic',
     loadComponent: () => import('./modules/statistic/statistic.component')
       .then(m => m.StatisticComponent)
   }
   ```

5. **Handle shared services**:
   - TaskService is used by statistic module
   - Provide at root level in main.ts or use providedIn: 'root'
   
   ```typescript
   // task.service.ts
   @Injectable({
     providedIn: 'root' // Ensure this is set
   })
   export class TaskService { }
   ```

6. **Delete module files**:
   ```bash
   rm src/app/modules/statistic/statistic.module.ts
   rm src/app/modules/statistic/statistic-routing.module.ts
   ```

7. **Test charts thoroughly**:
   ```bash
   npm run build.prod
   npm start
   # Navigate to /statistic
   # Verify all charts render
   # Test chart interactions
   ```

**Verification**:
- [ ] All components standalone
- [ ] Charts render correctly
- [ ] No module files remain
- [ ] Route works
- [ ] Build succeeds

**Rollback**:
```bash
git checkout src/app/modules/statistic/
```

---

### Task MOD-003: Convert Task Module to Standalone

**Dependencies**: MOD-002  
**Objective**: Convert largest module with multiple components  
**Estimated Time**: 8-10 hours

**Instructions**:

1. **List all components in task module**:
   - TaskComponent (main)
   - TaskCardComponent
   - TaskTimerComponent
   - CardHighlightDirective
   - InputBorderDirective

2. **Convert each component to standalone** (one at a time):
   
   **TaskComponent**:
   ```typescript
   @Component({
     selector: 'app-task',
     standalone: true,
     imports: [
       CommonModule,
       FormsModule,
       ReactiveFormsModule,
       MatButtonModule,
       MatSelectModule,
       MatCardModule,
       MatDividerModule,
       MatProgressBarModule,
       TaskCardComponent,
       TaskTimerComponent,
       CardHighlightDirective,
       InputBorderDirective,
     ],
     templateUrl: './task.component.html',
   })
   ```
   
   **TaskCardComponent**:
   ```typescript
   @Component({
     selector: 'app-task-card',
     standalone: true,
     imports: [
       CommonModule,
       MatCardModule,
       MatButtonModule,
       CardHighlightDirective,
     ],
     templateUrl: './task-card.component.html',
   })
   ```
   
   **TaskTimerComponent**:
   ```typescript
   @Component({
     selector: 'app-task-timer',
     standalone: true,
     imports: [
       CommonModule,
       MatProgressBarModule,
     ],
     templateUrl: './task-timer.component.html',
   })
   ```

3. **Convert directives to standalone**:
   ```typescript
   // card-highlight.directive.ts
   @Directive({
     selector: '[appCardHighlight]',
     standalone: true
   })
   export class CardHighlightDirective { }
   
   // input-border.directive.ts
   @Directive({
     selector: '[appInputBorder]',
     standalone: true
   })
   export class InputBorderDirective { }
   ```

4. **Update routing**:
   ```typescript
   // task.routes.ts
   export const TASK_ROUTES: Routes = [
     { 
       path: '', 
       component: TaskComponent,
       children: [
         { path: 'all', component: TaskComponent },
         { path: 'active', component: TaskComponent },
         { path: 'completed', component: TaskComponent },
       ]
     }
   ];
   ```

5. **Update app routes**:
   ```typescript
   {
     path: 'tasks',
     loadChildren: () => import('./modules/task/task.routes')
       .then(m => m.TASK_ROUTES)
   }
   ```

6. **Handle services**:
   ```typescript
   // Ensure services use providedIn: 'root'
   @Injectable({
     providedIn: 'root'
   })
   export class TaskService { }
   
   @Injectable({
     providedIn: 'root'
   })
   export class TaskTimerService { }
   
   @Injectable({
     providedIn: 'root'
   })
   export class CountdownTimerService { }
   ```

7. **Delete module files**:
   ```bash
   rm src/app/modules/task/task.module.ts
   rm src/app/modules/task/task-routing.module.ts
   ```

8. **Test thoroughly**:
   - All task views (all, active, completed)
   - Task creation
   - Task editing
   - Task deletion
   - Task timer countdown
   - Directives working

**Verification**:
- [ ] All components standalone
- [ ] All directives standalone
- [ ] Task CRUD operations work
- [ ] Timer countdown works
- [ ] Web worker still functions
- [ ] Build succeeds

**Rollback**:
```bash
git checkout src/app/modules/task/
```

---

### Task MOD-004: Convert App Module to Standalone

**Dependencies**: MOD-003  
**Objective**: Remove root NgModule, complete standalone migration  
**Estimated Time**: 6-8 hours

**Instructions**:

1. **Convert app component**:
   ```typescript
   // app.component.ts
   @Component({
     selector: 'app-root',
     standalone: true,
     imports: [
       CommonModule,
       RouterOutlet,
       HeaderComponent,
       AlertWindowComponent,
     ],
     templateUrl: './app.component.html',
   })
   export class AppComponent { }
   ```

2. **Convert child components**:
   - HeaderComponent
   - MenuItemComponent
   - PageNotFoundComponent
   - AlertWindowComponent
   - StyleThemeComponent
   
   Each becomes standalone with own imports.

3. **Convert pipes**:
   ```typescript
   // safe-html.pipe.ts
   @Pipe({
     name: 'safeHtml',
     standalone: true
   })
   export class SafeHtmlPipe { }
   ```

4. **Create app routes**:
   ```typescript
   // app.routes.ts
   import { Routes } from '@angular/router';
   
   export const routes: Routes = [
     {
       path: 'location',
       loadComponent: () => import('./modules/change-location/change-location.component')
         .then(m => m.ChangeLocationComponent)
     },
     {
       path: 'tasks',
       loadChildren: () => import('./modules/task/task.routes')
         .then(m => m.TASK_ROUTES)
     },
     {
       path: 'statistic',
       loadComponent: () => import('./modules/statistic/statistic.component')
         .then(m => m.StatisticComponent)
     },
     { path: '', redirectTo: '/tasks/all', pathMatch: 'full' },
     { path: '**', component: PageNotFoundComponent }
   ];
   ```

5. **Update main.ts**:
   ```typescript
   // main.ts
   import { bootstrapApplication } from '@angular/platform-browser';
   import { provideAnimations } from '@angular/platform-browser/animations';
   import { provideHttpClient } from '@angular/common/http';
   import { provideRouter, withHashLocation } from '@angular/router';
   import { AppComponent } from './app/app.component';
   import { routes } from './app/app.routes';
   import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // If using ng2-charts
   
   bootstrapApplication(AppComponent, {
     providers: [
       provideAnimations(),
       provideHttpClient(),
       provideRouter(routes, withHashLocation()),
       // Chart providers if needed
       provideCharts(withDefaultRegisterables()),
     ]
   }).catch(err => console.error(err));
   ```

6. **Delete app.module.ts**:
   ```bash
   rm src/app/app.module.ts
   rm src/app/app-routing.module.ts
   ```

7. **Update angular.json**:
   - Ensure main points to main.ts
   - Remove any polyfills references if not already done

8. **Test entire application**:
   ```bash
   npm run build.prod
   npm run lint
   npm run test
   npm start
   # Full manual testing of all features
   ```

**Verification**:
- [ ] No NgModules remain
- [ ] App boots from main.ts
- [ ] All routes work
- [ ] All features functional
- [ ] Build succeeds
- [ ] Tests pass

**Rollback**:
```bash
git checkout src/app/app.module.ts src/app/app-routing.module.ts src/app/app.component.ts src/main.ts
```

---

## Phase 2: Adopt Declarative Control Flow

### Task MOD-005: Migrate Templates to @if/@for (NOT @switch)

**Dependencies**: MOD-004  
**Objective**: Replace *ngIf/*ngFor with modern syntax (**@switch excluded per user request**)  
**Estimated Time**: 6-8 hours

**Important**: Do NOT migrate *ngSwitch to @switch. Keep *ngSwitch as is.

**Instructions**:

1. **Use Angular CLI migration** (if available):
   ```bash
   ng generate @angular/core:control-flow
   ```
   
   If this doesn't work or isn't available, do manual migration.
   
   **Note**: If CLI migration converts @switch, revert those changes and keep *ngSwitch.

2. **Find all templates with old syntax**:
   ```bash
   grep -r "\*ngIf" src/app/ --include="*.html" | wc -l
   grep -r "\*ngFor" src/app/ --include="*.html" | wc -l
   # Note: *ngSwitch will remain unchanged
   ```

3. **Migrate *ngIf to @if**:
   
   **Pattern 1: Simple if**:
   ```html
   <!-- BEFORE -->
   <div *ngIf="isLoading">Loading...</div>
   
   <!-- AFTER -->
   @if (isLoading) {
     <div>Loading...</div>
   }
   ```
   
   **Pattern 2: If-else**:
   ```html
   <!-- BEFORE -->
   <div *ngIf="tasks.length > 0; else noTasks">
     <p>Tasks available</p>
   </div>
   <ng-template #noTasks>
     <p>No tasks</p>
   </ng-template>
   
   <!-- AFTER -->
   @if (tasks.length > 0) {
     <div><p>Tasks available</p></div>
   } @else {
     <p>No tasks</p>
   }
   ```
   
   **Pattern 3: If-else-if**:
   ```html
   <!-- BEFORE -->
   <div *ngIf="status === 'loading'">Loading...</div>
   <div *ngIf="status === 'error'">Error!</div>
   <div *ngIf="status === 'success'">Success!</div>
   
   <!-- AFTER -->
   @if (status === 'loading') {
     <div>Loading...</div>
   } @else if (status === 'error') {
     <div>Error!</div>
   } @else if (status === 'success') {
     <div>Success!</div>
   }
   ```

4. **Migrate *ngFor to @for**:
   ```html
   <!-- BEFORE -->
   <div *ngFor="let task of tasks; trackBy: trackByFn; let i = index">
     {{ i + 1 }}. {{ task.name }}
   </div>
   
   <!-- AFTER -->
   @for (task of tasks; track task.id; let i = $index) {
     <div>{{ i + 1 }}. {{ task.name }}</div>
   }
   ```
   
   **With empty state**:
   ```html
   <!-- AFTER with @empty -->
   @for (task of tasks; track task.id) {
     <div>{{ task.name }}</div>
   } @empty {
     <p>No tasks available</p>
   }
   ```

5. **DO NOT migrate *ngSwitch**:
   ```html
   <!-- KEEP AS IS - Do not change *ngSwitch -->
   <div [ngSwitch]="taskStatus">
     <p *ngSwitchCase="'pending'">Pending</p>
     <p *ngSwitchCase="'active'">Active</p>
     <p *ngSwitchCase="'completed'">Completed</p>
     <p *ngSwitchDefault>Unknown</p>
   </div>
   
   <!-- Alternative: Use @if / @else if instead if preferred -->
   @if (taskStatus === 'pending') {
     <p>Pending</p>
   } @else if (taskStatus === 'active') {
     <p>Active</p>
   } @else if (taskStatus === 'completed') {
     <p>Completed</p>
   } @else {
     <p>Unknown</p>
   }
   ```

6. **Remove unused ng-template references**:
   - Clean up ng-template tags that were only used for *ngIf else
   - Keep ng-template that are used for other purposes (like Material components)

7. **Update component TypeScript if needed**:
   - Remove trackBy functions that are no longer needed (since @for has inline track)
   - Or keep them if you want reusable track functions

7. **Test each component after migration**:
   ```bash
   npm run build.prod
   npm start
   # Test all views, all conditions, all loops
   ```

**Files to Migrate** (in order of complexity):
1. Simple components first (change-location, page-not-found)
2. Chart components (task-count-chart, line-chart)
3. Complex components (task, statistic)
4. Header and navigation components

**Verification**:
- [ ] No *ngIf in codebase
- [ ] No *ngFor in codebase
- [ ] *ngSwitch remains unchanged (or converted to @if/@else if)
- [ ] All conditional rendering works
- [ ] All loops work
- [ ] Build succeeds
- [ ] No runtime errors

**Rollback**:
```bash
git checkout src/app/**/*.html
```

---

## Phase 3: Introduce Signals (Restricted Usage)

### Task MOD-006: Replace ngOnChanges with Input Signals

**Dependencies**: MOD-005  
**Objective**: Convert components using ngOnChanges to input signals (primitive types only)  
**Estimated Time**: 4-6 hours

**Important Restrictions**:
- Only use signals for **primitive types** (string, number, boolean)
- Do NOT use signals for objects, arrays of objects, or complex types
- Do NOT create complex signal references like `this.signal().property.value`
- Primary use case: Replace `ngOnChanges` lifecycle hooks

**Instructions**:

1. **Identify components with ngOnChanges**:
   ```bash
   grep -r "ngOnChanges" src/app/ --include="*.ts"
   ```
   
   Focus on components that:
   - Use ngOnChanges to react to @Input changes
   - Have @Input properties with primitive types
   - Example: task-timer.component.ts

2. **Convert task-timer.component.ts as example**:
   
   **BEFORE (with ngOnChanges)**:
   ```typescript
   import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
   
   export class TaskTimerComponent implements OnChanges {
     @Input() public timerInMinutes = 0;
     @Input() public statusLabel = '';
     
     public timerInMillisec = 0;
     private _preTimerInMillisec = 0;
     
     ngOnChanges(changes: SimpleChanges): void {
       if (changes.timerInMinutes?.currentValue === this.timerInMinutes && this.timerInMinutes > 0) {
         this.timerInMillisec = TaskTimer.convertsToMilliSec(this.timerInMinutes);
         this._preTimerInMillisec = this.timerInMillisec;
         
         // If timer is interrupted, it was inprogress, start timer again.
         if (this.statusLabel == TaskStatus[TaskStatus.Inprogress]) {
           this.startTimer();
         }
       }
     }
   }
   ```
   
   **AFTER (with input signals)**:
   ```typescript
   import { Component, input, effect } from '@angular/core';
   
   export class TaskTimerComponent {
     // Convert @Input to input signals (primitive types only)
     public timerInMinutes = input<number>(0);
     public statusLabel = input<string>('');
     
     public timerInMillisec = 0;
     private _preTimerInMillisec = 0;
     
     constructor() {
       // Use effect() to react to signal changes (replaces ngOnChanges)
       effect(() => {
         const minutes = this.timerInMinutes();
         const status = this.statusLabel();
         
         if (minutes > 0) {
           this.timerInMillisec = TaskTimer.convertsToMilliSec(minutes);
           this._preTimerInMillisec = this.timerInMillisec;
           
           // If timer is interrupted, it was inprogress, start timer again.
           if (status === TaskStatus[TaskStatus.Inprogress]) {
             this.startTimer();
           }
         }
       });
     }
   }
   ```

3. **Key changes explained**:
   - Replace `@Input()` with `input<type>(defaultValue)` for primitive types
   - Remove `implements OnChanges` from class
   - Remove `ngOnChanges` method
   - Add `effect()` in constructor to react to signal changes
   - Read signal values with `this.signalName()` (parentheses)
   - Keep complex logic as-is, just wrap input access

4. **Pattern for other components**:
   
   **For simple inputs (string, number, boolean)**:
   ```typescript
   // BEFORE
   @Input() count: number = 0;
   @Input() isActive: boolean = false;
   @Input() label: string = '';
   
   // AFTER
   count = input<number>(0);
   isActive = input<boolean>(false);
   label = input<string>('');
   ```
   
   **For inputs that need reaction**:
   ```typescript
   constructor() {
     effect(() => {
       const value = this.inputSignal();
       // React to changes
       this.doSomething(value);
     });
   }
   ```

5. **What NOT to convert to signals**:
   ```typescript
   // ❌ DO NOT convert - complex object
   @Input() task: Task = {...};
   
   // ❌ DO NOT convert - array of objects  
   @Input() tasks: Task[] = [];
   
   // ❌ DO NOT convert - EventEmitters stay as is
   @Output() taskChanged = new EventEmitter<Task>();
   
   // ✅ KEEP RxJS - HTTP and complex async
   taskService.getTasks().subscribe(...);
   ```

6. **Components to update** (if they use primitive @Input with ngOnChanges):
   - task-timer.component.ts (primary example)
   - Any component with ngOnChanges on primitive inputs
   - Skip components with complex object inputs

7. **Test after each conversion**:
   ```bash
   npm run build.prod
   npm start
   # Test the specific component functionality
   # Verify input changes still trigger correct behavior
   ```

**Verification**:
- [ ] ngOnChanges removed from components with primitive inputs
- [ ] input() signals replace @Input() for primitives
- [ ] effect() handles input change reactions
- [ ] Component functionality unchanged
- [ ] Build succeeds
- [ ] Tests pass

**Rollback**:
```bash
git checkout src/app/modules/task/task-timer/
```

---

## Phase 4: Convert Simple UI State to Signals (Optional)

### Task MOD-007: Convert Primitive UI State to Signals

**Dependencies**: MOD-006  
**Objective**: Convert simple boolean/string/number state to signals  
**Estimated Time**: 3-4 hours

**Important**: This is OPTIONAL. Only do if beneficial. Keep RxJS for everything else.

**Restrictions (same as before)**:
- Only primitive types (boolean, number, string)
- No complex objects
- No arrays of objects  
- Keep all RxJS patterns intact

**Instructions**:

1. **Identify simple UI state** (optional candidates):
   ```typescript
   // ✅ Good candidates for signals (primitive types)
   isLoading: boolean = false;
   selectedTab: string = 'all';
   count: number = 0;
   isVisible: boolean = true;
   ```

2. **Convert simple boolean flags**:
   ```typescript
   // BEFORE
   export class TaskComponent {
     isLoading = false;
     
     loadTasks() {
       this.isLoading = true;
       // ... async operation
       this.isLoading = false;
     }
   }
   
   // AFTER (Optional)
   export class TaskComponent {
     isLoading = signal(false);
     
     loadTasks() {
       this.isLoading.set(true);
       // ... async operation
       this.isLoading.set(false);
     }
   }
   
   // Template - add ()
   @if (isLoading()) {
     <p>Loading...</p>
   }
   ```

3. **Convert simple selection state**:
   ```typescript
   // BEFORE
   selectedFilter: string = 'all';
   
   setFilter(filter: string) {
     this.selectedFilter = filter;
   }
   
   // AFTER (Optional)
   selectedFilter = signal<string>('all');
   
   setFilter(filter: string) {
     this.selectedFilter.set(filter);
   }
   ```

4. **What to KEEP with RxJS** (do NOT convert):
   ```typescript
   // ❌ DO NOT convert - keep RxJS for HTTP
   tasks$: Observable<Task[]>;
   
   // ❌ DO NOT convert - keep RxJS for complex async
   taskService.getTasks().subscribe(...);
   
   // ❌ DO NOT convert - complex objects stay as properties
   currentTask: Task = {...};
   
   // ❌ DO NOT convert - arrays of objects
   tasks: Task[] = [];
   
   // ❌ DO NOT convert - event streams
   clicks$: Subject<void> = new Subject();
   ```

5. **StyleManager service example** (optional):
   ```typescript
   // This is OPTIONAL - only if it provides clear benefit
   
   // BEFORE
   export class StyleManagerService {
     private currentTheme = 'light';
     
     setTheme(theme: string) {
       this.currentTheme = theme;
       this.applyTheme(theme);
     }
     
     getTheme(): string {
       return this.currentTheme;
     }
   }
   
   // AFTER (Optional - only primitive string)
   export class StyleManagerService {
     currentTheme = signal<string>('light');
     
     setTheme(theme: string) {
       this.currentTheme.set(theme);
       this.applyTheme(theme);
     }
   }
   ```

6. **Test if converting**:
   ```bash
   npm run build.prod
   npm start
   # Test affected components
   ```

**Verification**:
- [ ] Only primitive types converted (if any)
- [ ] All RxJS patterns preserved
- [ ] HTTP requests still use RxJS
- [ ] Complex objects not converted
- [ ] Build succeeds
- [ ] No functionality broken

**Rollback**:
```bash
git checkout src/app/
```

---

## Phase 5: TypeScript 5.6 Enhancements

---

## Phase 5: TypeScript 5.6 Enhancements

### Task MOD-008: Update TypeScript Configuration

**Dependencies**: MOD-007  
**Objective**: Enable TypeScript 5.6 features  
**Estimated Time**: 2-3 hours

**Dependencies**: MOD-009  
**Objective**: Enable TypeScript 5.6 features  
**Estimated Time**: 2-3 hours

**Instructions**:

1. **Update tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ES2022",
       "lib": ["ES2023", "dom"],
       "strict": true,
       "strictNullChecks": true,
       "noUncheckedIndexedAccess": true,
       "exactOptionalPropertyTypes": true,
       // TypeScript 5.6 features
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": false,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "verbatimModuleSyntax": false
     }
   }
   ```

2. **Fix type errors**:
   ```bash
   npx tsc --noEmit
   # Fix any new type errors
   ```

3. **Use const type parameters** (TS 5.0+):
   ```typescript
   // Better type inference
   function createArray<const T>(items: T[]): T[] {
     return items;
   }
   
   const arr = createArray([1, 2, 3]); // Type: (1 | 2 | 3)[] not number[]
   ```

4. **Use satisfies operator** (TS 4.9+):
   ```typescript
   const config = {
     theme: 'light',
     timeout: 5000
   } satisfies AppConfig;
   
   // Ensures config matches AppConfig but keeps literal types
   ```

**Verification**:
- [ ] TypeScript compilation succeeds
- [ ] Better type inference
- [ ] No type errors

---

## Phase 6: Optional Enhancements

### Task MOD-009: Add View Transition API (Experimental)

**Dependencies**: MOD-008  
**Objective**: Add smooth route transitions  
**Estimated Time**: 2-4 hours

**Instructions**:

1. **Enable in router config**:
   ```typescript
   // main.ts
   import { withViewTransitions } from '@angular/router';
   
   bootstrapApplication(AppComponent, {
     providers: [
       provideRouter(
         routes,
         withHashLocation(),
         withViewTransitions() // Add this
       ),
     ]
   });
   ```

2. **Add CSS for transitions**:
   ```css
   /* styles.css */
   @keyframes fade-in {
     from { opacity: 0; }
   }
   
   @keyframes fade-out {
     to { opacity: 0; }
   }
   
   @keyframes slide-from-right {
     from { transform: translateX(30px); }
   }
   
   @keyframes slide-to-left {
     to { transform: translateX(-30px); }
   }
   
   ::view-transition-old(root) {
     animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
                300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
   }
   
   ::view-transition-new(root) {
     animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
                300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
   }
   ```

3. **Test route transitions**:
   - Navigate between routes
   - Verify smooth animations
   - Check browser support

**Verification**:
- [ ] Route transitions animate
- [ ] No performance issues
- [ ] Works in supported browsers

---

### Task MOD-010: Setup for SSR (Optional)

**Dependencies**: MOD-011  
**Objective**: Prepare for Server-Side Rendering  
**Estimated Time**: 4-6 hours

**Instructions**:

1. **Add SSR support**:
   ```bash
   ng add @angular/ssr
   ```

2. **Update for SSR compatibility**:
   - Check for `window` usage
   - Check for `document` usage
   - Check for `localStorage` usage
   
   Wrap in platform checks:
   ```typescript
   import { isPlatformBrowser } from '@angular/common';
   import { PLATFORM_ID, inject } from '@angular/core';
   
   export class MyComponent {
     private platformId = inject(PLATFORM_ID);
     
     ngOnInit() {
       if (isPlatformBrowser(this.platformId)) {
         // Browser-only code
         localStorage.setItem('key', 'value');
       }
     }
   }
   ```

3. **Test SSR build**:
   ```bash
   npm run build:ssr
   npm run serve:ssr
   ```

**Verification**:
- [ ] SSR build succeeds
- [ ] App renders server-side
- [ ] No browser API errors
- [ ] Hydration works

---

## Testing & Validation

### Task MOD-011: Final Modernization Testing

**Dependencies**: All MOD tasks  
**Objective**: Comprehensive testing of modernized app  
**Estimated Time**: 8-10 hours

**Instructions**:

1. **Run all builds**:
   ```bash
   npm run build.prod
   npm run lint
   npm run test
   ```

2. **Performance testing**:
   - Lighthouse audit
   - Bundle size analysis
   - Runtime performance profiling

3. **Manual testing checklist**:
   - [ ] All routes work
   - [ ] Theme switching
   - [ ] Task CRUD operations
   - [ ] Timer countdown
   - [ ] Charts render
   - [ ] Lazy loading works
   - [ ] No console errors
   - [ ] Mobile responsive
   - [ ] Cross-browser testing

4. **Compare metrics**:
   | Metric | Before (v14 modules) | After (v21 standalone + signals) |
   |--------|---------------------|----------------------------------|
   | Build time | 120s | ~15-20s |
   | Bundle size | 100% | ~70% |
   | Initial load | X ms | Y ms |
   | Change detection | Baseline | +30-50% faster |

**Verification**:
- [ ] All tests pass
- [ ] Performance improved
- [ ] No regressions
- [ ] Code quality high
- [ ] Documentation updated

---

## Summary

### Modernization Phases Completed

✅ **Phase 1**: Standalone Components (4 tasks, ~24-30 hours)
- All modules converted
- No NgModules remain
- Cleaner architecture

✅ **Phase 2**: Control Flow (1 task, ~8-10 hours)
- All *ngIf → @if
- All *ngFor → @for
- All *ngSwitch → @switch

✅ **Phase 3**: Deferrable Views (2 tasks, ~5-7 hours)
- Charts lazy loaded
- Better initial load

✅ **Phase 4**: Signals (2 tasks, ~9-12 hours)
- Simple state in signals
- Computed values
- Better performance

✅ **Phase 5**: TypeScript 5.6 (1 task, ~2-3 hours)
- Latest TS features
## Summary

### Modernization Phases Completed

✅ **Phase 1**: Standalone Components (4 tasks, ~24-30 hours)
- All modules converted
- No NgModules remain
- Cleaner architecture

✅ **Phase 2**: Control Flow (1 task, ~6-8 hours)
- All *ngIf → @if
- All *ngFor → @for
- **@switch excluded per user request** - keep *ngSwitch or use @if/@else if

✅ **Phase 3**: Signals - Restricted Usage (2 tasks, ~7-10 hours)
- Replace ngOnChanges with input signals (MOD-006)
- Optional primitive UI state conversion (MOD-007)
- **RxJS preserved** - no conversion to Signals
- **Only primitive types** - no complex objects

✅ **Phase 4**: TypeScript 5.6 (1 task, ~2-3 hours)
- Latest TS features
- Better type safety

✅ **Phase 5**: Optional Enhancements (2 tasks, ~6-10 hours)
- View transitions
- SSR ready

**Total Time**: 45-61 hours over 3-4 weeks (reduced from 54-72 hours)

### Key Constraints Applied

**RxJS Preservation**:
- ✅ All RxJS patterns kept intact
- ✅ HTTP requests remain with RxJS
- ✅ Event streams stay with RxJS
- ✅ Only obsolete operators updated

**Signal Restrictions**:
- ✅ Only primitive types (string, number, boolean)
- ✅ No complex objects or nested references
- ✅ Primary use: Replace ngOnChanges
- ❌ No `this.signal().property.value` patterns

**Control Flow**:
- ✅ *ngIf → @if (allowed)
- ✅ *ngFor → @for (allowed)
- ❌ *ngSwitch stays or converts to @if/@else if (NOT @switch)

**Deferrable Views**:
- ❌ @defer excluded completely per user request

### Expected Results

**Performance**:
- 85-90% faster builds (same as before)
- 15-20% smaller bundles (slightly less without @defer)
- Improved change detection with input signals
- Better initial load (standalone + lazy routes)

**Code Quality**:
- Modern, maintainable code
- Less boilerplate (30% reduction)
- Better TypeScript support
- RxJS patterns preserved (no learning curve for existing patterns)

**Developer Experience**:
- Cleaner code with @if/@for
- Easier component input handling (signals instead of ngOnChanges)
- Familiar RxJS patterns maintained
- More intuitive APIs

---

## Rollback Strategy

At any phase, can rollback with:
```bash
git checkout <previous-commit> -- src/app/
```

Or rollback individual modules/components.

---

## Next Steps After Modernization

1. **Monitor performance** in production
2. **Train team** on input signals and effect()
3. **Update documentation**
4. **Consider Jest migration** (replace Karma)
5. **Consider chart library migration** (to ngx-charts or ng-apexcharts)
6. **Implement SSR** if needed
7. **Keep RxJS knowledge** - it's still the primary async pattern

---

## Resources

- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [Angular Signals](https://angular.io/guide/signals) - **Use with restrictions noted above**
- [Control Flow Syntax](https://angular.io/guide/control-flow) - **@if and @for only**
- [View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/)
- [TypeScript 5.6](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/)
- [RxJS Documentation](https://rxjs.dev/) - **Primary async pattern**
