# AI Agent Tasks: Angular v17-21 Modernization

## Question 3: AI Agent for Rewriting Codebase with Modern Angular Features

This document provides detailed tasks for an AI agent to modernize the ng-task-monitor codebase after upgrading to Angular v21, applying features from Angular v17-21:
- TypeScript 5.6 integration
- Declarative control flow (@if, @for, @switch)
- Deferrable loading (@defer)
- Signals for reactive state
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

## Modernization Strategy

**Approach**: Incremental, module-by-module migration  
**Duration**: 4-6 weeks  
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
       // Chart library imports (ng2-charts or ngx-charts)
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

### Task MOD-005: Migrate Templates to @if/@for/@switch

**Dependencies**: MOD-004  
**Objective**: Replace *ngIf/*ngFor/*ngSwitch with modern syntax  
**Estimated Time**: 8-10 hours

**Instructions**:

1. **Use Angular CLI migration** (if available):
   ```bash
   ng generate @angular/core:control-flow
   ```
   
   If this doesn't work or isn't available, do manual migration.

2. **Find all templates with old syntax**:
   ```bash
   grep -r "\*ngIf" src/app/ --include="*.html" | wc -l
   grep -r "\*ngFor" src/app/ --include="*.html" | wc -l
   grep -r "\*ngSwitch" src/app/ --include="*.html" | wc -l
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

5. **Migrate *ngSwitch to @switch**:
   ```html
   <!-- BEFORE -->
   <div [ngSwitch]="taskStatus">
     <p *ngSwitchCase="'pending'">Pending</p>
     <p *ngSwitchCase="'active'">Active</p>
     <p *ngSwitchCase="'completed'">Completed</p>
     <p *ngSwitchDefault>Unknown</p>
   </div>
   
   <!-- AFTER -->
   @switch (taskStatus) {
     @case ('pending') {
       <p>Pending</p>
     }
     @case ('active') {
       <p>Active</p>
     }
     @case ('completed') {
       <p>Completed</p>
     }
     @default {
       <p>Unknown</p>
     }
   }
   ```

6. **Remove unused ng-template references**:
   - Clean up ng-template tags that were only used for *ngIf else
   - Keep ng-template that are used for other purposes (like Material components)

7. **Update component TypeScript if needed**:
   - Remove trackBy functions that are no longer needed (since @for has inline track)
   - Or keep them if you want reusable track functions

8. **Test each component after migration**:
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
- [ ] No *ngSwitch in codebase
- [ ] All conditional rendering works
- [ ] All loops work
- [ ] Build succeeds
- [ ] No runtime errors

**Rollback**:
```bash
git checkout src/app/**/*.html
```

---

## Phase 3: Implement Deferrable Views

### Task MOD-006: Add @defer for Chart Components

**Dependencies**: MOD-005  
**Objective**: Lazy load charts for better initial page load  
**Estimated Time**: 3-4 hours

**Instructions**:

1. **Identify defer candidates**:
   - Chart components in statistic module
   - Heavy components below the fold
   - Components not immediately visible

2. **Add @defer to chart components**:
   ```html
   <!-- statistic.component.html -->
   
   <!-- BEFORE -->
   <app-task-count-chart [data]="chartData"></app-task-count-chart>
   
   <!-- AFTER -->
   @defer (on viewport) {
     <app-task-count-chart [data]="chartData"></app-task-count-chart>
   } @placeholder {
     <div class="chart-skeleton">
       <p>Loading chart...</p>
     </div>
   } @loading (minimum 500ms) {
     <div class="chart-loading">
       <mat-spinner></mat-spinner>
     </div>
   }
   ```

3. **Defer triggers available**:
   - `on viewport` - When element enters viewport
   - `on idle` - When browser is idle
   - `on immediate` - Defer but load immediately
   - `on timer(2s)` - After 2 seconds
   - `on interaction` - On user interaction
   - `on hover` - On hover
   
   For charts, use `on viewport` or `on idle`.

4. **Add placeholder styling**:
   ```css
   /* statistic.component.css */
   .chart-skeleton {
     height: 300px;
     background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
     background-size: 200% 100%;
     animation: loading 1.5s ease-in-out infinite;
   }
   
   @keyframes loading {
     0% { background-position: 200% 0; }
     100% { background-position: -200% 0; }
   }
   ```

5. **Test defer behavior**:
   ```bash
   npm run build.prod
   npm start
   # Navigate to /statistic
   # Open DevTools Network tab
   # Verify chart chunks load lazily
   # Scroll to test viewport trigger
   ```

**Verification**:
- [ ] Charts load lazily
- [ ] Placeholder shows
- [ ] Loading state shows
- [ ] Charts render after defer trigger
- [ ] Network shows separate chunk loads
- [ ] Initial page load faster

**Rollback**:
```bash
git checkout src/app/modules/statistic/
```

---

### Task MOD-007: Add @defer for Other Heavy Components

**Dependencies**: MOD-006  
**Objective**: Optimize other deferred loading opportunities  
**Estimated Time**: 2-3 hours

**Instructions**:

1. **Identify other defer candidates**:
   - Task card components (if many tasks)
   - Alert window (not immediately visible)
   - Style theme selector (settings)

2. **Add conditional defer for task lists**:
   ```html
   <!-- task.component.html -->
   @for (task of tasks; track task.id) {
     @defer (on viewport; prefetch on idle) {
       <app-task-card [task]="task"></app-task-card>
     } @placeholder {
       <div class="task-card-placeholder">...</div>
     }
   }
   ```

3. **Add defer for modals/dialogs**:
   ```html
   <!-- app.component.html -->
   @defer (on interaction) {
     <app-alert-window></app-alert-window>
   }
   ```

4. **Measure impact**:
   - Before: Initial bundle size
   - After: Initial bundle size
   - Expected: 10-20% reduction

**Verification**:
- [ ] Initial bundle smaller
- [ ] Components load on demand
- [ ] No user-visible delays
- [ ] Prefetch works correctly

---

## Phase 4: Introduce Signals

### Task MOD-008: Convert Simple State to Signals

**Dependencies**: MOD-007  
**Objective**: Replace simple RxJS state with Signals  
**Estimated Time**: 6-8 hours

**Instructions**:

1. **Identify Signal candidates**:
   - Simple component state (isLoading, selectedFilter, etc.)
   - Form state
   - UI state (theme, visibility flags)
   - NOT: HTTP responses, complex async operations

2. **Convert isLoading pattern**:
   ```typescript
   // BEFORE
   export class TaskComponent {
     isLoading = false;
     
     loadTasks() {
       this.isLoading = true;
       this.taskService.getTasks().subscribe(tasks => {
         this.tasks = tasks;
         this.isLoading = false;
       });
     }
   }
   
   // AFTER
   export class TaskComponent {
     isLoading = signal(false);
     
     loadTasks() {
       this.isLoading.set(true);
       this.taskService.getTasks().subscribe(tasks => {
         this.tasks.set(tasks);
         this.isLoading.set(false);
       });
     }
   }
   
   // Template
   @if (isLoading()) {
     <p>Loading...</p>
   }
   ```

3. **Convert filter/selection state**:
   ```typescript
   // BEFORE
   export class StatisticComponent {
     selectedChart: string = 'bar';
     
     selectChart(type: string) {
       this.selectedChart = type;
     }
   }
   
   // AFTER
   export class StatisticComponent {
     selectedChart = signal<string>('bar');
     
     selectChart(type: string) {
       this.selectedChart.set(type);
     }
   }
   
   // Template
   @if (selectedChart() === 'bar') {
     <app-bar-chart />
   }
   ```

4. **Create computed values**:
   ```typescript
   export class TaskComponent {
     tasks = signal<Task[]>([]);
     
     // Derived state with computed
     completedTasks = computed(() => 
       this.tasks().filter(t => t.completed)
     );
     
     pendingTasks = computed(() =>
       this.tasks().filter(t => !t.completed)
     );
     
     taskCount = computed(() => this.tasks().length);
     completedCount = computed(() => this.completedTasks().length);
     completionRate = computed(() => 
       this.taskCount() > 0 
         ? (this.completedCount() / this.taskCount()) * 100 
         : 0
     );
   }
   
   // Template
   <p>Completed: {{ completedCount() }} / {{ taskCount() }}</p>
   <p>Rate: {{ completionRate() }}%</p>
   ```

5. **Use effect() for side effects**:
   ```typescript
   export class TaskComponent {
     tasks = signal<Task[]>([]);
     
     constructor() {
       effect(() => {
         // Runs whenever tasks changes
         const tasks = this.tasks();
         console.log('Tasks updated:', tasks.length);
         this.saveToLocalStorage(tasks);
       });
     }
   }
   ```

6. **Keep RxJS for HTTP**:
   ```typescript
   // Good hybrid approach
   export class TaskService {
     private http = inject(HttpClient);
     private tasksSignal = signal<Task[]>([]);
     
     // Public readonly signal
     tasks = this.tasksSignal.asReadonly();
     
     // RxJS for HTTP
     loadTasks() {
       return this.http.get<Task[]>('/api/tasks').pipe(
         tap(tasks => this.tasksSignal.set(tasks))
       );
     }
     
     // Computed derived state
     completedTasks = computed(() =>
       this.tasks().filter(t => t.completed)
     );
   }
   ```

7. **Update templates**:
   - Add `()` to signal reads
   - Remove `.subscribe()` from components
   - Use signals directly in templates

8. **Test thoroughly**:
   - State updates correctly
   - Computed values recalculate
   - No memory leaks
   - Performance is good

**Verification**:
- [ ] Simple state converted to signals
- [ ] Computed values work
- [ ] Templates updated
- [ ] No subscription leaks
- [ ] Performance improved

**Rollback**:
```bash
git checkout src/app/
```

---

### Task MOD-009: Convert StyleManager Service to Signals

**Dependencies**: MOD-008  
**Objective**: Modernize theme management with Signals  
**Estimated Time**: 3-4 hours

**Instructions**:

1. **Current StyleManagerService** likely uses:
   - BehaviorSubject for current theme
   - Observables for theme changes

2. **Convert to Signals**:
   ```typescript
   // BEFORE
   export class StyleManagerService {
     private currentThemeSubject = new BehaviorSubject<string>('light');
     currentTheme$ = this.currentThemeSubject.asObservable();
     
     setTheme(theme: string) {
       this.currentThemeSubject.next(theme);
       // Apply theme logic
     }
   }
   
   // AFTER
   export class StyleManagerService {
     currentTheme = signal<string>('light');
     
     setTheme(theme: string) {
       this.currentTheme.set(theme);
       // Apply theme logic
     }
     
     // Computed helper
     isDark = computed(() => this.currentTheme() === 'dark');
     isLight = computed(() => this.currentTheme() === 'light');
   }
   ```

3. **Update components using StyleManager**:
   ```typescript
   // Component
   export class HeaderComponent {
     styleManager = inject(StyleManagerService);
     currentTheme = this.styleManager.currentTheme;
     
     // Template can directly use signal
   }
   
   // Template
   <div class="theme-{{ currentTheme() }}">
     ...
   </div>
   ```

4. **Use effect() for DOM updates**:
   ```typescript
   export class StyleManagerService {
     currentTheme = signal<string>('light');
     
     constructor() {
       effect(() => {
         const theme = this.currentTheme();
         this.applyThemeToDOM(theme);
       });
     }
     
     private applyThemeToDOM(theme: string) {
       document.body.className = `theme-${theme}`;
     }
   }
   ```

**Verification**:
- [ ] Theme switching works
- [ ] No subscriptions in components
- [ ] Effect applies theme
- [ ] Performance good

---

## Phase 5: TypeScript 5.6 Enhancements

### Task MOD-010: Update TypeScript Configuration

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

### Task MOD-011: Add View Transition API (Experimental)

**Dependencies**: MOD-010  
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

### Task MOD-012: Setup for SSR (Optional)

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

### Task MOD-013: Final Modernization Testing

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
- Better type safety

✅ **Phase 6**: Optional Enhancements (2 tasks, ~6-10 hours)
- View transitions
- SSR ready

**Total Time**: 54-72 hours over 4-6 weeks

### Expected Results

**Performance**:
- 85-90% faster builds
- 30% smaller bundles
- 30-50% faster change detection
- Better initial load time

**Code Quality**:
- Modern, maintainable code
- Less boilerplate (40% reduction)
- Better TypeScript support
- Future-proof architecture

**Developer Experience**:
- Cleaner code
- Easier testing
- Better debugging
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
2. **Train team** on new patterns
3. **Update documentation**
4. **Consider Jest migration** (replace Karma)
5. **Consider chart library migration** (to ngx-charts or ng-apexcharts)
6. **Implement SSR** if needed
7. **Add more Signal-based features**

---

## Resources

- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [Angular Signals](https://angular.io/guide/signals)
- [Control Flow Syntax](https://angular.io/guide/control-flow)
- [Deferrable Views](https://angular.io/guide/defer)
- [View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/)
- [TypeScript 5.6](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/)
