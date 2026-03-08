# RxJS Coding Guidelines

> **RxJS version:** 7  
> **Sources:**
> - [Best practices when using RxJS in Angular — Benjamin Canapé](https://medium.com/@benjamin.canape/best-practices-when-using-rxjs-in-angular-e1e3e210b304)
> - [RxJS and Angular Best Practices — Taira Seal](https://medium.com/@taira.seal/rxjs-and-angular-best-practices-47cbd9b63a56)
> - [RxJS Best Practices — Nya Garcia](https://dev.to/nyagarcia/rxjs-best-practices-bhb)
> - [RxJS Error Handling: Complete Practical Guide — Angular University](https://blog.angular-university.io/rxjs-error-handling/)

---

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Subscription Management](#subscription-management)
3. [Pipeable Operators & Stream Composition](#pipeable-operators--stream-composition)
4. [Keeping subscribe Lean](#keeping-subscribe-lean)
5. [State Sharing and Caching](#state-sharing-and-caching)
6. [Error Handling](#error-handling)
   - [catchError](#catcherror)
   - [retry and retryWhen](#retry-and-retrywhen)
   - [throwError](#throwerror)
   - [finalize](#finalize)

---

## Naming Conventions

- **Suffix all Observable and Subject variables with `$`** to signal that the variable is a stream, not a plain value.
- Use **camelCase** and a **descriptive name** that expresses the domain concept, not the implementation detail.
- Expose a private Subject's value as a public `asObservable()` (or `asReadonly()` signal) to prevent external callers from emitting on the Subject directly.

```ts
// ❌ Bad — no $ suffix, ambiguous name
userdata: Observable<User[]>;
sub = new Subject();

// ✅ Good — $ suffix, descriptive name, encapsulated Subject
private readonly userSubject = new Subject<User[]>();
readonly user$ = this.userSubject.asObservable();

readonly activeUsers$: Observable<User[]> = this.user$.pipe(
  map(users => users.filter(u => u.active))
);
```

---

## Subscription Management

### Prefer the async pipe in templates

The `async` pipe is the safest way to handle template-bound observables — it subscribes on creation and **unsubscribes automatically** when the component is destroyed.

```ts
// ❌ Bad — manual subscription in the component, easy to forget cleanup
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.userService.getUsers().subscribe(u => this.users = u);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // often forgotten
  }
}
```

```html
<!-- ✅ Good — async pipe handles subscribe/unsubscribe automatically -->
@if (users$ | async; as users) {
  @for (user of users; track user.id) {
    <app-user-card [user]="user" />
  }
}
```

### Use `takeUntilDestroyed` for imperative subscriptions (Angular 16+)

When you must subscribe in TypeScript code (e.g., reacting to router events or form value changes), use `takeUntilDestroyed` from `@angular/core/rxjs-interop`. It ties the subscription lifetime to the host component's `DestroyRef` with zero boilerplate.

```ts
import { DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// ❌ Bad — manual Subject + ngOnDestroy
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => this.search(term));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```ts
// ✅ Good — takeUntilDestroyed with injected DestroyRef
export class SearchComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(term => this.search(term));
  }
}

// ✅ Also good — inside the constructor (injection context), no DestroyRef needed
export class SearchComponent {
  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(term => this.search(term));
  }
}
```

### Place `takeUntilDestroyed` / `takeUntil` last in the pipe

Putting a completion operator before higher-order mapping operators (e.g., `switchMap`) only cancels the outer observable — the inner observable keeps running and can cause memory leaks.

```ts
// ❌ Bad — takeUntil before switchMap, inner observable leaks
this.trigger$
  .pipe(
    takeUntilDestroyed(this.destroyRef), // cancels too early
    switchMap(id => this.http.get(`/api/items/${id}`))
  )
  .subscribe();

// ✅ Good — takeUntil / takeUntilDestroyed is the last operator
this.trigger$
  .pipe(
    switchMap(id => this.http.get(`/api/items/${id}`)),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe();
```

### HTTP observables rarely need manual unsubscription

`HttpClient` observables complete after emitting a single value, so memory leaks are not a concern. Manual unsubscription is only necessary for **infinite streams** (WebSocket, intervals, user-event streams, etc.).

---

## Pipeable Operators & Stream Composition

### Never nest `.subscribe()` calls

Subscribing inside a subscription creates tangled, hard-to-test code and defeats the reactive model. Use higher-order mapping operators to flatten streams instead.

```ts
// ❌ Bad — subscribe inside subscribe
this.authService.getUserId().subscribe(id => {
  this.postService.getPostsByUser(id).subscribe(posts => {
    this.posts = posts;
  });
});
```

```ts
// ✅ Good — flat chain with switchMap
this.authService.getUserId()
  .pipe(
    switchMap(id => this.postService.getPostsByUser(id)),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe(posts => (this.posts = posts));
```

### Choose the right flattening operator

| Operator | Behaviour | When to use |
|---|---|---|
| `switchMap` | Cancels the previous inner observable when a new source value arrives | Search / autocomplete — only the latest result matters |
| `mergeMap` | Runs all inner observables concurrently | Parallel, independent operations |
| `concatMap` | Queues inner observables — executes them one after the other | Sequential operations where order matters (e.g., file uploads) |
| `exhaustMap` | Ignores new source values while an inner observable is still active | Form submit buttons — prevent duplicate requests |

```ts
// ❌ Bad — mergeMap for a save action allows duplicate concurrent requests
this.saveButton$.pipe(
  mergeMap(() => this.api.save(this.form.value))
).subscribe();

// ✅ Good — exhaustMap prevents duplicate saves
this.saveButton$.pipe(
  exhaustMap(() => this.api.save(this.form.value))
).subscribe();
```

---

## Keeping subscribe Lean

The `.subscribe()` callback should only **assign the result** to component state — it must not contain transformation logic, side effects, or business rules. Move everything upstream into `.pipe()`.

```ts
// ❌ Bad — transformation and side effects inside subscribe
this.userService.getUser(id).subscribe(user => {
  const displayName = `${user.firstName} ${user.lastName}`.toUpperCase();
  this.displayName = displayName;
  this.logger.log('User loaded', displayName);
  this.router.navigate(['/dashboard']);
});
```

```ts
// ✅ Good — all logic lives in the pipe
this.userService.getUser(id)
  .pipe(
    map(user => `${user.firstName} ${user.lastName}`.toUpperCase()),
    tap(name => this.logger.log('User loaded', name)),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe(displayName => {
    this.displayName = displayName;
    this.router.navigate(['/dashboard']);
  });
```

---

## State Sharing and Caching

### Use `shareReplay` to avoid duplicate executions

When multiple consumers subscribe to the same cold observable (e.g., an HTTP request), each subscription re-executes the source. Use `shareReplay` to share a single execution and replay the cached result to late subscribers.

```ts
// ❌ Bad — each subscriber triggers a separate HTTP call
readonly config$ = this.http.get<Config>('/api/config');

// ✅ Good — one request, result shared and replayed to all subscribers
readonly config$ = this.http.get<Config>('/api/config').pipe(
  shareReplay({ bufferSize: 1, refCount: true })
);
```

- **`bufferSize: 1`** — cache only the latest emitted value.
- **`refCount: true`** — automatically dispose of the source observable when there are no more active subscribers, preventing memory leaks.

---

## Error Handling

> **Source:** [RxJS Error Handling: Complete Practical Guide — Angular University](https://blog.angular-university.io/rxjs-error-handling/)

In RxJS, an error is a terminal event — once an observable errors, it can no longer emit values or complete. Proper error handling is therefore essential for building resilient Angular applications.

### catchError

`catchError` intercepts an error in the pipeline and lets you **replace** the failed observable with a fallback, or **rethrow** the error for a higher-level handler.

The placement of `catchError` matters: inside a `switchMap` it only kills the inner observable (the outer stream survives); at the outermost pipe level it terminates the entire stream.

```ts
// ❌ Bad — no error handling; an HTTP failure will crash the entire stream
this.http.get<Item[]>('/api/items')
  .subscribe(items => (this.items = items));
```

```ts
// ✅ Good — replace strategy: provide a safe fallback
this.http.get<Item[]>('/api/items')
  .pipe(
    catchError(err => {
      console.error('Failed to load items', err);
      return of([]); // fallback value keeps the stream alive
    })
  )
  .subscribe(items => (this.items = items));
```

```ts
// ✅ Also good — catchError on the inner observable only, outer stream survives
this.searchTerm$
  .pipe(
    switchMap(term =>
      this.http.get<Item[]>(`/api/search?q=${term}`).pipe(
        catchError(() => of([])) // inner error is contained here
      )
    )
  )
  .subscribe(results => (this.results = results));
```

### retry and retryWhen

`retry(n)` automatically re-subscribes to the source observable up to `n` times before propagating the error. Use it for **transient, idempotent** failures (e.g., network blips, 5xx server errors). Never use it on non-idempotent operations (e.g., POST requests that create data) or on client errors (4xx).

```ts
// ❌ Bad — retry on a POST that creates data may create duplicates
this.http.post('/api/orders', order).pipe(
  retry(3)
).subscribe();
```

```ts
// ✅ Good — retry a read operation with a limited attempt count
this.http.get<Config>('/api/config')
  .pipe(
    retry(3),
    catchError(err => {
      this.notificationService.error('Could not load configuration.');
      return throwError(() => err);
    })
  )
  .subscribe(config => (this.config = config));
```

For exponential backoff or conditional retry logic, use `retryWhen` (RxJS 6/7) or the `retry({ delay })` overload (RxJS 7.4+), where the `delay` factory returns an `ObservableInput` that controls when the next attempt is made:

```ts
import { retry, timer } from 'rxjs';

// ✅ Good — exponential backoff using retry delay factory (RxJS 7.4+)
// The delay factory receives (error, retryCount) and returns an ObservableInput.
// The next retry attempt begins when that observable emits.
this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (_error, retryCount) => timer(Math.pow(2, retryCount) * 500)
  }),
  catchError(err => {
    this.logger.error(err);
    return of(null);
  })
).subscribe();
```

### throwError

Use `throwError` inside `catchError` to **rethrow** the error — either after logging a side effect, or to let a global error handler (e.g., an HTTP interceptor) take over.

```ts
// ❌ Bad — swallowing the error silently
catchError(err => {
  console.error(err);
  return EMPTY; // caller has no idea something went wrong
})

// ✅ Good — log locally and rethrow for the global handler
catchError(err => {
  this.logger.error('API call failed', err);
  return throwError(() => err); // rethrows the original error
})
```

### finalize

`finalize` runs its callback regardless of whether the observable completes successfully or errors. Use it for **cleanup work** such as hiding a loading spinner.

```ts
// ❌ Bad — loading state only reset on success; stays true on error
this.loading = true;
this.http.get<Data>('/api/data')
  .subscribe({
    next: data => {
      this.data = data;
      this.loading = false;
    }
  });
```

```ts
// ✅ Good — finalize guarantees the loading flag is always cleared
this.loading = true;
this.http.get<Data>('/api/data')
  .pipe(
    catchError(err => {
      this.notificationService.error('Failed to load data.');
      return throwError(() => err);
    }),
    finalize(() => (this.loading = false)) // always runs
  )
  .subscribe(data => (this.data = data));
```
