# Angular Coding Guidelines

> **Angular version:** 21  
> **Reference:** [Angular Style Guide](https://angular.dev/style-guide)

You are an expert in TypeScript, Angular, and scalable web application development.
Write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

---

## Table of Contents

1. [TypeScript Best Practices](#typescript-best-practices)
2. [Angular Best Practices](#angular-best-practices)
3. [Accessibility Requirements](#accessibility-requirements)
4. [Components](#components)
5. [State Management](#state-management)
6. [Signals](#signals)
7. [Templates](#templates)
8. [Services](#services)

---

## TypeScript Best Practices

- Use **strict type checking** (enable `strict` in `tsconfig.json`).
- Prefer **type inference** when the type is obvious from the assignment.
- Avoid the `any` type; use `unknown` when the type is uncertain.

---

## Angular Best Practices

- Always use **standalone components** over NgModules.
- Must **NOT** set `standalone: true` inside Angular decorators — it is the default in Angular v19+.
- Use **signals** for state management.
- Implement **lazy loading** for feature routes.
- Do **NOT** use the `@HostBinding` and `@HostListener` decorators.  
  Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead.
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does **not** work for inline base64 images.

---

## Accessibility Requirements

- It **MUST** pass all AXE checks.
- It **MUST** follow all WCAG AA minimums, including:
  - Focus management
  - Color contrast
  - ARIA attributes

---

## Components

- Keep components **small** and focused on a **single responsibility**.
- Use `input()` and `output()` functions instead of decorators.
- Use `computed()` for derived state.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in the `@Component` decorator.
- Prefer **inline templates** for small components.
- Prefer **Reactive forms** instead of Template-driven ones.
- Do **NOT** use `ngClass` — use `class` bindings instead.
- Do **NOT** use `ngStyle` — use `style` bindings instead.
- When using external templates/styles, use **paths relative to the component TS file**.

---

## State Management

- Use **signals** for local component state.
- Use `computed()` for derived state.
- Keep state transformations **pure** and **predictable**.

---

## Signals

> **Source:** [Angular Signals: Complete Guide — Angular University](https://blog.angular-university.io/angular-signals/)

Angular Signals are a reactive primitive introduced in Angular 17 that enable fine-grained, synchronous reactivity with automatic change detection — without relying on Zone.js.

### Core API

| API | Purpose |
|---|---|
| `signal(value)` | Create a writable signal with an initial value |
| `computed(() => ...)` | Derive a read-only signal from other signals |
| `effect(() => ...)` | Run a side effect whenever tracked signals change |
| `signal.set(v)` | Replace the signal value |
| `signal.update(fn)` | Update the value based on the current one |
| `signal.asReadonly()` | Expose a read-only view of a writable signal |

### Best Practices

- **Use signals for local UI state.** Signals are ideal for component-level state such as toggling visibility, button state, or form-driven UI changes.
- **Use `computed()` for derived state.** Derive values from other signals instead of duplicating logic. Keep `computed()` functions **pure** — no side effects, no mutations, no API calls.
- **Use `effect()` only for side effects.** Reach for `effect()` when you need to react to signal changes with outgoing interactions (logging, updating non-Angular code, etc.). Do **not** mutate signals inside an `effect()`.
- **Keep signals writable privately, expose them as readonly.** Follow the private-writable / public-readonly pattern to encapsulate state and prevent accidental mutations from the outside.

  ```ts
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();
  ```

- **Never mutate objects or arrays in-place.** Always create a new reference when updating signal values to ensure change detection triggers correctly.

  ```ts
  // ✅ Correct
  items.update(list => [...list, newItem]);

  // ❌ Wrong — mutates in-place, no change detected
  items().push(newItem);
  ```

- **Use signals in templates directly.** Call the signal as a function in the template (`{{ count() }}`). This is more efficient than observables with the async pipe because signals are synchronous and always hold a value.
- **Provide a custom equality function for complex types.** For object or array signals, pass an `equal` option to avoid unnecessary re-renders when the content has not logically changed.

  ```ts
  const user = signal<User>({ name: 'Alice' }, { equal: (a, b) => a.name === b.name });
  ```

- **Avoid signals for async / event-based logic.** Signals are synchronous. Use **RxJS observables** for HTTP requests, timers, or other async streams. You can then write results into a signal with `set()` or `update()` to bridge the two models.
- **Use `input()` and `output()` for component communication.** Signal-based `input()` / `output()` functions replace `@Input` / `@Output` decorators and integrate naturally with the signals reactivity model.

### Common Pitfalls

- Do **not** read a signal inside a `computed()` conditionally — every signal read inside `computed()` must always be reachable so the dependency graph stays consistent.
- Do **not** use `effect()` to synchronize two signals — use `computed()` instead.
- Do **not** call `set()` / `update()` inside a `computed()` — computed signals must remain pure.

---

## Templates

- Keep templates **simple** and avoid complex logic.
- Use **native control flow** (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use the **async pipe** to handle observables.
- Do **not** call globals like `new Date()` directly in templates — instantiate values in the component class instead to keep templates simple and testable.

---

## Services

- Design services around a **single responsibility**.
- Use the `providedIn: 'root'` option for **singleton services**.
- Use the `inject()` function instead of constructor injection.
