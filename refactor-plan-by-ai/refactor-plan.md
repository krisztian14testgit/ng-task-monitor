# ng-task-monitor Refactoring Plan — AI Agent Strategy

**Generated:** 2026-05-18T00:14:30+02:00 (CEST)  
**LLM:** Claude Sonnet 4.6 (`claude-sonnet-4.6`)  
**Angular Version:** 21.2.x (target: latest Angular 21.x practices)

---

## 1. Context & Scope

This document is an instruction set for an AI coding agent performing a progressive modernization refactoring of the **ng-task-monitor** Angular application. The agent must follow the priorities and rules in this plan exactly.

### What is Already Done ✅

| Feature | Status |
|---|---|
| All components are standalone (no NgModules for components) | ✅ Done |
| Lazy-loaded routes (`loadComponent`, `loadChildren`) | ✅ Done |
| `input()` signal in `MenuItemComponent`, `AlertWindowComponent`, `TaskTimerComponent` | ✅ Done |
| `model()` two-way binding in `AlertWindowComponent` | ✅ Done |
| `signal()` / `effect()` in `AlertWindowComponent`, `MenuItemComponent`, `TaskTimerComponent`, `StatisticComponent` (partial) | ✅ Done |
| `inject()` function in `TaskService` | ✅ Done (partial) |
| New control-flow syntax (`@if`, `@for`) in most templates | ✅ Done (partial) |
| RxJS upgraded to 7.8.x | ✅ Done |
| Angular 21.2.x dependency upgrade | ✅ Done |

### What Is Still Needed ❌

Detailed in sections below.

---

## 2. Agent Rules

> The agent **MUST** follow these rules at all times.

1. **Never break existing application logic.** Refactor = same behavior, different code structure.
2. **Skip all test files** (`*.spec.ts`). Tests are in Jasmine/Karma and will be migrated separately to Vitest later (Angular 21 schematic: `ng g @schematics/angular:refactor-jasmine-vitest`).
3. **Preserve RxJS logic.** Never remove or break an RxJS stream. See Section 8 for operator analysis.
4. **One concern per PR/commit.** Each section below is a separate atomic change.
5. **Run `ng lint` after each section** to verify no linting regression.
6. **Do not introduce Signal Forms yet.** They are in experimental stage in Angular 21 and the API may change.
7. **Do not add `@angular/aria`** unless explicitly requested. It is in developer preview.
8. **Comments**: only add/keep comments that clarify non-obvious logic. Remove auto-generated boilerplate comments.

---

## 3. Section 1 — Zoneless Migration

**Priority:** High  
**Breaking risk:** Medium (requires thorough smoke-testing)  
**Angular feature:** `provideZonelessChangeDetection` (stable in Angular 20.2+, default in Angular 21 new apps)

### Tasks

1. **Remove `zone.js` from `polyfills.ts`** (or from angular.json `polyfills` array):
   ```typescript
   // src/polyfills.ts — remove this line:
   import 'zone.js';
   ```

2. **Update `app.config.ts`:** Replace `provideZoneChangeDetection` with `provideZonelessChangeDetection`:
   ```typescript
   // BEFORE:
   import { provideZoneChangeDetection } from '@angular/core';
   provideZoneChangeDetection({ eventCoalescing: true })

   // AFTER:
   import { provideZonelessChangeDetection } from '@angular/core';
   provideZonelessChangeDetection()
   ```

3. **Remove `zone.js` from `package.json`** dependencies (or keep at a minimum if Karma tests still need it for now; check karma.conf.js first).

4. **Fix `StatisticComponent`:** It uses `ChangeDetectorRef.markForCheck()`. With zoneless + `ChangeDetectionStrategy.OnPush`, signals trigger detection automatically. Replace the `changeDetectorRef.markForCheck()` call by converting the task subscription to a signal via `toSignal()`:
   ```typescript
   // BEFORE (statistic.component.ts):
   private getAllTasks(): void {
     this._taskService$ = this.taskService.getAll()
       .subscribe((tasks: Task[]) => {
         this.taskList = tasks;
         this.changeDetectorRef.markForCheck();
       });
   }

   // AFTER: use toSignal (Angular 20+ stable)
   import { toSignal } from '@angular/core/rxjs-interop';
   readonly taskList = toSignal(this.taskService.getAll(), { initialValue: [] as Task[] });
   // Remove: Subscription, ChangeDetectorRef injection, ngOnDestroy task$ unsubscription
   ```

5. **Verify** all `ChangeDetectorRef` injections are removed after the `toSignal` migration.

### Files Affected
- `src/polyfills.ts`
- `src/app/app.config.ts`
- `src/app/modules/statistic/statistic.component.ts`
- `package.json` (remove `zone.js` from dependencies)

---

## 4. Section 2 — Signal Inputs and Outputs

**Priority:** High  
**Angular feature:** `input()`, `output()`, `model()` (stable in Angular 17+, fully standard in Angular 20+)

Migrate all remaining `@Input()` / `@Output()` / `EventEmitter` decorators to the signal-based equivalents.

### Components to Migrate

#### `TaskCardComponent` (`task-card.component.ts`)
```typescript
// BEFORE:
@Input() public task: Task = new Task();
@Input() public isReadonly = false;
@Input() public isTimePeriodToday = true;
@Output() public readonly newTaskCreationFailed: EventEmitter<string> = new EventEmitter();

// AFTER:
public readonly task = input<Task>(new Task());
public readonly isReadonly = input(false);
public readonly isTimePeriodToday = input(true);
public readonly newTaskCreationFailed = output<string>();
```

> **Note:** After migrating `@Input` to `input()`, usages of `this.task` that were direct properties
> become `this.task()` calls. Update all internal references accordingly.
> The `newTaskCreationFailed.next(...)` call becomes `newTaskCreationFailed.emit(...)`.

#### `LineChartComponent` (`line-chart.component.ts`)
```typescript
// BEFORE:
@Input() taskList: Task[] = [];
@Input() lineType: LineChartReport = LineChartReport.CompletedTask;

// AFTER:
public readonly taskList = input<Task[]>([]);
public readonly lineType = input<LineChartReport>(LineChartReport.CompletedTask);
```

> **Note:** `ngOnChanges()` can be replaced with `effect()` that watches the signals, OR use `computed()` to derive chart data reactively. Prefer `computed()` for pure data derivation.

#### `TaskCountChartComponent` (`task-count-chart.component.ts`)
```typescript
// BEFORE:
@Input() taskList: Task[] = [];
@Input() isShowedTodayDate = false;

// AFTER:
public readonly taskList = input<Task[]>([]);
public readonly isShowedTodayDate = input(false);
```

> Same guidance: replace `ngOnChanges()` with `effect()` or `computed()`.

#### `TaskTimerComponent` (`task-timer.component.ts`)
- Already uses `input()` for all inputs ✅
- `@Output() timerStatusEmitter: EventEmitter` → migrate to `output<[string, Date]>()`

#### Template bindings update
After migrating to `input()` signals, update parent templates:
- `task-card.component.html`: `[taskId]`, `[timerInMinutes]`, `[statusLabel]`, `[isTimePeriodToday]` — no template changes needed (Angular handles both).
- `(timerStatusEmitter)="..."` → `(timerStatusEmitter)="..."` — output event binding stays the same.

### Files Affected
- `src/app/modules/task/task-card/task-card.component.ts`
- `src/app/modules/statistic/line-chart/line-chart.component.ts`
- `src/app/modules/statistic/task-count-chart/task-count-chart.component.ts`
- `src/app/modules/task/task-timer/task-timer.component.ts`

---

## 5. Section 3 — Replace `CommonModule` with Specific Imports

**Priority:** Medium  
**Angular feature:** Native control flow (`@if`, `@for`, `@switch`) replaces `NgIf`, `NgFor`, `NgSwitch` from `CommonModule`.

### Components Still Importing `CommonModule`

| Component | `CommonModule` purpose | Replace With |
|---|---|---|
| `HeaderComponent` | `NgIf` / `NgFor` usage in template | Migrate template to `@if` / `@for`, remove `CommonModule` |
| `TaskComponent` | `NgIf` / `NgFor` | Migrate template, remove `CommonModule` |
| `TaskCardComponent` | `NgIf` / `NgFor` | Already uses `@if` in template ✅ → remove `CommonModule` |
| `ChangeLocationComponent` | `NgIf` | Migrate template, remove |
| `StyleThemeComponent` | `NgFor` | Migrate template, remove |
| `AlertWindowComponent` | `NgClass` | Migrate `[ngClass]` → `[class]` (see Section 4), remove |
| `MenuItemComponent` | `NgIf`, `NgFor` | Migrate template `*ngIf`/`*ngFor` → `@if`/`@for`, remove |

### Template Migration Steps

Run Angular 21 schematics first for automated help:
```bash
ng generate @angular/core:ngclass-to-class
ng generate @angular/core:ngstyle-to-style
```

Then manually migrate remaining `*ngIf` / `*ngFor` in:
- `src/app/components/menu-item/menu-item.component.html`
- `src/app/modules/change-location/change-location.component.html`

After template migration, remove `CommonModule` from each component's `imports[]` array.

### Files Affected
- `src/app/components/header/header.component.ts` + `.html`
- `src/app/modules/task/task.component.ts` + `.html`
- `src/app/modules/task/task-card/task-card.component.ts`
- `src/app/modules/change-location/change-location.component.ts` + `.html`
- `src/app/components/style-theme/style-theme.component.ts` + `.html`
- `src/app/components/alert-window/alert-window.component.ts` + `.html`
- `src/app/components/menu-item/menu-item.component.ts` + `.html`

---

## 6. Section 4 — Migrate to `inject()` Function

**Priority:** Medium  
**Angular feature:** `inject()` function (replaces constructor parameter injection, stable since Angular 14+)

Constructor injection is legacy. Migrate all `constructor(private readonly ...)` patterns to `inject()`.

### Pattern
```typescript
// BEFORE:
constructor(private readonly taskService: TaskService,
            private readonly alertMessageService: AlertMessageService) {}

// AFTER: (properties declared in class body)
private readonly taskService = inject(TaskService);
private readonly alertMessageService = inject(AlertMessageService);
// Remove constructor if nothing else is done in it
```

### Components to Migrate

| File | Services to inject |
|---|---|
| `HeaderComponent` | `Router` |
| `TaskComponent` | `TaskService`, `TaskTimerService`, `AlertMessageService`, `CountdownTimerService`, `Router` |
| `TaskCardComponent` | `TaskService`, `AlertMessageService` |
| `ChangeLocationComponent` | `LocationService`, `AlertMessageService` |
| `StatisticComponent` | `TaskService`, `Router` (remove `ChangeDetectorRef` after Section 1) |
| `StyleThemeComponent` | `StyleManagerService` |
| `AlertWindowComponent` | `AlertMessageService` |
| `CardHighlightDirective` | `ElementRef` |
| `TaskTimerComponent` | `TaskTimerService` |

> **Note for `HeaderComponent`:** Constructor currently initializes `appMenus` and `optionMenus`. Move initialization logic to property declarations or `ngOnInit`.

### Files Affected
All component/directive `.ts` files listed above.

---

## 7. Section 5 — Subscription Management with `takeUntilDestroyed`

**Priority:** High  
**Angular feature:** `takeUntilDestroyed()` from `@angular/core/rxjs-interop` (stable in Angular 20+)

Replace manual `Subscription` + `ngOnDestroy` / `unsubscribe()` pattern with `takeUntilDestroyed`.

### Pattern
```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// BEFORE:
private _taskSubscription!: Subscription;

ngOnInit(): void {
  this._taskSubscription = this.service.getData().subscribe(...);
}

ngOnDestroy(): void {
  this._taskSubscription.unsubscribe();
}

// AFTER:
ngOnInit(): void {
  this.service.getData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(...);
}
// Inject DestroyRef if used outside constructor context:
private readonly destroyRef = inject(DestroyRef);
// Remove: Subscription field, ngOnDestroy
```

> **Tip:** If the subscription is started in the constructor, `takeUntilDestroyed()` can be called without a `DestroyRef` argument (it is inferred automatically from the injection context).

### Components to Migrate

| File | Subscription(s) |
|---|---|
| `TaskComponent` | `_taskSubscription` (task stream) |
| `StatisticComponent` | `_taskService$` |
| `ChangeLocationComponent` | `_locationService$` |
| `HeaderComponent` | `router.events.subscribe(...)` in `ngOnInit` |
| `TaskTimerComponent` | `taskTimerService.onChangeState().subscribe(...)` in `ngOnInit` |
| `AlertWindowComponent` | `alertMessageService.getMessage().subscribe(...)` in `ngOnInit` |

> **Note for `AlertWindowComponent`:** The `ngOnInit` subscription can be moved to the constructor  
> (after `inject()` migration) so `takeUntilDestroyed()` works without explicit `DestroyRef`.

### Files Affected
All `.ts` files listed above.

---

## 8. Section 6 — Angular 21: Remove Redundant `provideHttpClient`

**Priority:** Low  
**Angular feature:** `HttpClient` is provided by default in Angular 21 (no need to call `provideHttpClient()`).

In `app.config.ts`, `provideHttpClient(withInterceptorsFromDi())` can be removed — unless interceptors registered via `HTTP_INTERCEPTORS` multi-token are actively used.

### Check
1. Grep the codebase for `HTTP_INTERCEPTORS`:
   ```bash
   grep -r "HTTP_INTERCEPTORS" src/
   ```
2. If no results, remove `provideHttpClient(withInterceptorsFromDi())` from `app.config.ts`.
3. If interceptors exist, keep `provideHttpClient(withInterceptors([...]))` with the new functional interceptor API.

### Files Affected
- `src/app/app.config.ts`

---

## 9. Section 7 — Angular 21: `SimpleChanges` Generic Typing

**Priority:** Low  
**Angular feature:** `SimpleChanges<T>` (Angular 21, improves type safety in `ngOnChanges`)

After completing Section 2 (signal inputs), `ngOnChanges` may be fully replaced by `effect()`. If any `ngOnChanges` remain, add generic typing.

```typescript
// BEFORE:
ngOnChanges(changes: SimpleChanges): void { ... }

// AFTER:
ngOnChanges(changes: SimpleChanges<TaskCardComponent>): void { ... }
```

### Files to Check (only if ngOnChanges still remains after Section 2)
- `task-card.component.ts`
- `line-chart.component.ts`
- `task-count-chart.component.ts`

---

## 10. Section 8 — Angular 20: Template Modernization

**Priority:** Low  
**Angular feature:** Template literals, `in` operator, `**` exponentiation in templates (Angular 20+)

These are optional readability improvements. Only apply where they genuinely reduce complexity.

### Candidates

1. **Template literals** in `AppComponent` for the `noApiLinkedText` property — it is a static string, no change needed.

2. **`in` operator** — currently no templates use type narrowing that would benefit from `in`. Mark as **no change needed** for now.

3. **`toUpperCaseFirstChar()`** — used in `AlertWindowComponent` and `TaskComponent`. This is a custom `String.prototype` extension defined in `typeExtensions`. Verify the extension is properly typed and does not conflict with TypeScript strict mode.

4. **Template string literals** — in `header.component.ts`, the menu title string `'Tasks'`, `'Charts'`, etc., are set in the TypeScript code and passed to templates. No template-literal change needed.

---

## 11. Section 9 — Angular 20: `toSignal()` for RxJS-to-Signal Bridges

**Priority:** Medium  
**Angular feature:** `toSignal()` / `toObservable()` (stable in Angular 20)

Where a component subscribes to an Observable only to assign the result to a class property, replace with `toSignal()`.

### Candidates

| Component | Observable | Signal conversion |
|---|---|---|
| `StatisticComponent` | `taskService.getAll()` → `taskList` | `toSignal(this.taskService.getAll(), { initialValue: [] })` |
| `HeaderComponent` | `router.events` filter pipeline | Keep as RxJS + `takeUntilDestroyed` (complex multicast, see Section 8) |

### Template Consequence
After `toSignal`, `taskList` becomes a signal:
```html
<!-- BEFORE -->
@for (task of taskList; track task.id) { ... }

<!-- AFTER -->
@for (task of taskList(); track task.id) { ... }
```

---

## 12. Section 10 — `InputBorderDirective` Signal Migration

**Priority:** Low

The `InputBorderDirective` (`src/app/directives/input-border/`) was not examined in detail. The agent should:
1. Read the directive source.
2. If it uses `@Input()`, migrate to `input()` following Section 2 rules.
3. If it uses constructor injection, migrate to `inject()`.

---

## 13. RxJS Operators — Preservation & Improvement Guide

> **RULE: Do not remove any RxJS logic. Preserve the observable structure.**  
> Only suggest improvements if they preserve identical semantics.

### RxJS Inventory by File

#### `alert-message.service.ts`
```typescript
private _message$ = new Subject<[string, AlertType | undefined]>();
public getMessage(): Observable<[string, AlertType | undefined]>
```
- **Pattern:** Multicast message bus (Subject → Observable).
- **Preserve:** Yes. The `Subject` is the correct tool here; `signal` would not multicast across unrelated components.
- **Improvement opportunity:** Add `takeUntilDestroyed` in all subscribers instead of managing subscriptions manually.

#### `task-timer.service.ts`
```typescript
private _timerState$: BehaviorSubject<[number, string[]]>
public onChangeState(): Observable<[number, string[]]>
```
- **Pattern:** State bus with initial value (`BehaviorSubject`).
- **Preserve:** Yes. Emitting timer state to multiple components requires a Subject.
- **Note:** The `pipe(tuple => tuple)` in `onChangeState()` is a no-op (identity map). **Remove it** — it is dead code:
  ```typescript
  // BEFORE:
  return this._timerState$.pipe(tuple => tuple);
  // AFTER:
  return this._timerState$.asObservable();
  ```

#### `task.service.ts`
```typescript
public readonly taskList$ = new BehaviorSubject<Task[]>([]);
```
- **Pattern:** State store — broadcasts task list changes to any subscriber.
- **Preserve:** Yes. The `taskList$` serves as the single source of truth for the task list.
- **Improvement opportunity:** Expose a read-only signal via `toSignal()` alongside the existing `taskList$` for consumers that prefer signals. Keep both until all consumers are migrated:
  ```typescript
  public readonly taskListSignal = toSignal(this.taskList$, { initialValue: [] as Task[] });
  ```

#### `task-card.component.ts`
```typescript
saving$.pipe(exhaustMap(task => this.taskService[serviceMethod](task))).subscribe(...)
```
- **Pattern:** `exhaustMap` to prevent duplicate save requests when user clicks multiple times.
- **Preserve:** Yes — `exhaustMap` is the semantically correct operator here. Replacing it with a simple `switchMap` or direct call would allow concurrent requests. **Do not change.**
- **Improvement:** Add error handling via `catchError` instead of the deprecated second argument to `subscribe`:
  ```typescript
  // BEFORE:
  .subscribe(
    savedTask => { /* success */ },
    () => { /* error */ },
    () => { /* complete */ }
  );

  // AFTER (RxJS 7 best practice):
  import { catchError, finalize, EMPTY } from 'rxjs';
  .pipe(
    catchError(() => {
      this.alertMessageService.sendMessage('Updating/saving has been failed, server error!');
      return EMPTY;
    }),
    finalize(() => { this.isEditable = false; })
  )
  .subscribe(savedTask => {
    this.task = savedTask;
    this.savingInitialFormValues(savedTask);
    this.alertMessageService.sendMessage('Saving has been success!');
  });
  ```

#### `change-location.component.ts`
```typescript
this.locationService.saveLocation(keyLocation, formControlRef.value)
  .pipe(debounceTime(waitSeconds))
  .subscribe(...)
```
- **Pattern:** `debounceTime` to delay save requests.
- **Preserve:** Yes. **However**, `debounceTime` after a `subscribe` is incorrectly placed — `debounceTime` belongs on the source stream, not after the HTTP call. The intended behavior (debounce user keystrokes before saving) should be on the `FormControl.valueChanges` stream instead:
  ```typescript
  // IMPROVEMENT (fix misplaced debounceTime):
  this.taskDataControl.valueChanges.pipe(
    debounceTime(2000),
    filter(() => this.taskDataControl.valid),
    switchMap(value => this.locationService.saveLocation(LocationPath.TaskPath, value)),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe({
    next: () => this.alertMessageService.sendMessage('Path is saved!', AlertType.Success),
    error: () => this.alertMessageService.sendMessage('Path saving is failed!', AlertType.Error)
  });
  ```

#### `alert-message.service.ts` — `getMessage()` map
```typescript
return this._message$.pipe(map(tuple => tuple));
```
- **No-op identity map.** Remove it:
  ```typescript
  return this._message$.asObservable();
  ```

#### `task.component.ts` — `saveAllTask`
```typescript
.subscribe((isSaved: boolean) => { ... },
           ((error: Error) => { ... }));
```
- **Improvement:** Migrate to `subscribe({ next, error })` object syntax (RxJS 7 best practice, avoids deprecated positional callbacks).

#### `header.component.ts` — router events
```typescript
this.router.events.subscribe((event: Event) => {
  if (event instanceof NavigationStart) { ... }
  if (event instanceof NavigationEnd) { ... }
});
```
- **Preserve structure.** Add `takeUntilDestroyed` and use `filter` operator for cleaner code:
  ```typescript
  this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(event => {
    const urlKey = event.url.substring(1);
    if (urlKey) {
      this.titleOfRoute = this._routerDict[urlKey];
    }
  });
  // Remove the NavigationStart block — it only has a console.log
  ```

---

## 14. Execution Order (Recommended)

The agent should execute sections in this order to minimize merge conflicts and risk:

| Step | Section | Rationale |
|---|---|---|
| 1 | Section 5 — `takeUntilDestroyed` | Safest, purely additive change |
| 2 | Section 4 — `inject()` migration | Required before some signal changes |
| 3 | Section 2 — Signal inputs/outputs | Core modernization |
| 4 | Section 3 — Remove `CommonModule` | Clean up after signals migration |
| 5 | Section 9 — `toSignal()` bridges | Depends on signal inputs being in place |
| 6 | Section 1 — Zoneless | Requires signals+subscriptions already clean |
| 7 | Section 6 — Remove `provideHttpClient` | Low risk, standalone change |
| 8 | Section 7 — `SimpleChanges` generic | Mop-up after `ngOnChanges` decisions |
| 9 | Section 8 — Template modernization | Cosmetic, last |
| 10 | Section 10 — InputBorderDirective | Investigate and apply |

---

## 15. Skipped / Out-of-Scope

| Item | Reason |
|---|---|
| Test files (`*.spec.ts`) | Will be migrated to Vitest separately via `ng g @schematics/angular:refactor-jasmine-vitest` |
| Signal Forms | Experimental in Angular 21; API not stable |
| `@angular/aria` | Developer preview; not integrated in this project |
| HTTP API integration | `task.service.ts`, `location.service.ts` use `localStorage` and commented-out HTTP code — no change to that architecture |
| Electron / build config | Out of scope for this refactor |

---

## 16. Verification Checklist (After Each Section)

- [ ] `ng lint` passes with zero errors
- [ ] `ng build --configuration production` succeeds
- [ ] Application runs (`ng serve`): navigation, task CRUD, timer, statistics, theme switch all work
- [ ] No `zone.js` errors in console (after Section 1)
- [ ] No `NG0` (Angular runtime errors) in browser console
- [ ] No broken signal subscriptions (no `undefined()` calls in templates)
