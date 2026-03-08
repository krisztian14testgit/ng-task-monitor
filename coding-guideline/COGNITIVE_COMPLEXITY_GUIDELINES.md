# Reducing Cognitive Complexity Guidelines

> **Sources:**
> - [5 Clean Code Tips for Reducing Cognitive Complexity — SonarSource](https://www.sonarsource.com/blog/5-clean-code-tips-for-reducing-cognitive-complexity/)
> - [Cognitive Complexity Explained: Causes, Metrics, and How to Fix — axify.io](https://axify.io/blog/cognitive-complexity)

---

## Table of Contents

1. [What is Cognitive Complexity?](#what-is-cognitive-complexity)
2. [Cognitive Complexity vs Cyclomatic Complexity](#cognitive-complexity-vs-cyclomatic-complexity)
3. [How Cognitive Complexity is Scored](#how-cognitive-complexity-is-scored)
4. [What Causes High Cognitive Complexity](#what-causes-high-cognitive-complexity)
5. [Tip 1 — Avoid Deep Nesting with Guard Clauses and Early Returns](#tip-1--avoid-deep-nesting-with-guard-clauses-and-early-returns)
6. [Tip 2 — Simplify Boolean Conditions](#tip-2--simplify-boolean-conditions)
7. [Tip 3 — Extract Functions](#tip-3--extract-functions)
8. [Tip 4 — Choose the Right Loop and Array Method](#tip-4--choose-the-right-loop-and-array-method)
9. [Tip 5 — Leverage Optional Chaining and Nullish Coalescing](#tip-5--leverage-optional-chaining-and-nullish-coalescing)
10. [Tip 6 — Avoid Unnecessary Recursion](#tip-6--avoid-unnecessary-recursion)

---

## What is Cognitive Complexity?

**Cognitive complexity** is a code metric that estimates how hard a piece of code is for a human to **read, reason about, and maintain**. It was introduced by SonarSource as an improvement over cyclomatic complexity because it reflects *human* comprehension cost — not just the number of execution paths.

A function with a high cognitive complexity score:
- takes longer to understand on first read
- is harder to debug and modify safely
- is more likely to harbour hidden bugs
- slows down onboarding of new team members

The SonarQube default threshold is **15** per function/method. Functions exceeding this limit are flagged as too complex and should be refactored.

---

## Cognitive Complexity vs Cyclomatic Complexity

| | Cyclomatic Complexity | Cognitive Complexity |
|---|---|---|
| **Measures** | Number of independent execution paths | Mental effort required to understand the code |
| **Penalises nesting** | No — same score for flat and nested logic | Yes — each nesting level adds an extra penalty |
| **Penalises flat switch/case** | Yes — one point per `case` | No — a flat `switch` is easy to scan; minimal penalty |
| **Primary use** | Estimating minimum test cases needed | Measuring code maintainability and readability |

**Example — why the two metrics diverge:**

```ts
// A flat switch with 7 cases
// Cyclomatic complexity: 7 (one per case)
// Cognitive complexity: ~1 (flat structure, easy to read)
function getDayName(day: number): string {
  switch (day) {
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
    case 7: return 'Sunday';
    default: return 'Unknown';
  }
}
```

```ts
// Two nested ifs
// Cyclomatic complexity: 2
// Cognitive complexity: 3 (+1 outer if, +2 inner if because of nesting penalty)
function example(a: number, b: number): number {
  if (a > 0) {       // +1
    if (b > 0) {     // +2 (1 for if + 1 nesting penalty)
      return a + b;
    }
  }
  return 0;
}
```

---

## How Cognitive Complexity is Scored

The scoring follows three principles:

1. **+1 for each control flow structure** — `if`, `else if`, `else`, `for`, `while`, `do…while`, `switch`, `catch`, logical operators (`&&`, `||`) in a chain, ternary `? :`.
2. **Nesting penalty** — each nesting level adds an extra `+nesting_depth` to the score of the construct that introduces that level.
3. **+1 for flow-interrupting statements** inside complex logic — `break` or `continue` with a label, early `return` inside a nested structure.

```ts
function calculateScore(values: number[], threshold: number): number {
  let score = 0;

  for (const val of values) {             // +1 (nesting level becomes 1)
    if (val < 0) {                        // +2 (1 for if + 1 nesting penalty)
      continue;                           // +1 (flow interruption)
    }

    if (val > threshold) {                // +2 (1 for if + 1 nesting penalty)
      for (let i = 0; i < val; i++) {     // +3 (1 for for + 2 nesting penalty)
        score += i;                       // inside nesting level 3
      }
    } else {                              // +1
      score += val;
    }
  }

  return score;
}
// Total cognitive complexity: 1 + 2 + 1 + 2 + 3 + 1 = 10
```

---

## What Causes High Cognitive Complexity

| Cause | Why it increases complexity |
|---|---|
| **Deep nesting** | Each additional level adds a nesting penalty on top of the base +1 |
| **Long functions with mixed responsibilities** | More control-flow branches, harder to follow a single train of thought |
| **Complex boolean expressions** | Chained `&&`/`||`/`!` require the reader to evaluate compound logic |
| **Flow interruptions** | `break`, `continue` inside loops and early `return` in deeply nested blocks disrupt the linear read |
| **Recursion** | Requires the reader to mentally simulate multiple stack frames |
| **Unclear naming** | Poor names force the reader to decode intent, adding cognitive load even though it does not raise the metric score |

---

## Tip 1 — Avoid Deep Nesting with Guard Clauses and Early Returns

Deeply nested conditionals are the single biggest driver of cognitive complexity. Invert the condition to handle the error or boundary case first, then continue with the main path at a flat level.

```ts
// ❌ Bad — main logic buried three levels deep (complexity: ~10)
function processOrder(order: Order | null): void {
  if (order) {                              // +1
    if (order.isValid) {                   // +2
      if (order.items.length > 0) {        // +3
        // main processing logic
        sendToWarehouse(order);
        notifyCustomer(order);
      } else {                             // +1
        logError('Order has no items');
      }
    } else {                               // +1
      logError('Invalid order');
    }
  } else {                                 // +1
    logError('Order is null');
  }
}
```

```ts
// ✅ Good — guard clauses keep main logic at the top level (complexity: 3)
function processOrder(order: Order | null): void {
  if (!order) {             // +1 — guard clause, exit immediately
    logError('Order is null');
    return;
  }
  if (!order.isValid) {     // +1 — guard clause
    logError('Invalid order');
    return;
  }
  if (order.items.length === 0) {  // +1 — guard clause
    logError('Order has no items');
    return;
  }

  // Main logic sits at the top level — easy to read
  sendToWarehouse(order);
  notifyCustomer(order);
}
```

---

## Tip 2 — Simplify Boolean Conditions

Long chains of `&&`, `||`, and `!` operators make conditions hard to parse. Extract the sub-expressions into **named boolean variables** or a dedicated **helper function** that communicates intent.

```ts
// ❌ Bad — compound condition requires the reader to evaluate multiple things at once
function canEditPost(user: User, post: Post): boolean {
  if ((user.role === 'admin' || user.role === 'moderator') &&  // +1
      !post.isArchived &&                                       // +1
      (post.authorId === user.id || user.canEditAll)) {         // +1
    return true;
  }
  return false;
}
```

```ts
// ✅ Good — each condition has a descriptive name that reads like plain English
function canEditPost(user: User, post: Post): boolean {
  const isPrivilegedUser = user.role === 'admin' || user.role === 'moderator';
  const isPostEditable = !post.isArchived;
  const hasOwnership = post.authorId === user.id || user.canEditAll;

  return isPrivilegedUser && isPostEditable && hasOwnership; // +1 — single, readable line
}
```

When the condition is complex enough to warrant its own logic, extract it to a method:

```ts
// ✅ Also good — helper function names the concept
function canEditPost(user: User, post: Post): boolean {
  return isAuthorised(user) && isEditable(post); // +1
}

function isAuthorised(user: User): boolean {
  return user.role === 'admin' || user.role === 'moderator' || user.canEditAll;
}

function isEditable(post: Post): boolean {
  return !post.isArchived;
}
```

---

## Tip 3 — Extract Functions

Long functions accumulate many branches and responsibilities, pushing the complexity score up rapidly. Splitting a function into smaller, single-purpose helpers **distributes the complexity** and makes each piece individually easy to understand.

```ts
// ❌ Bad — one function does validation, mapping, and persistence (complexity: ~11)
async function submitForm(formData: FormData): Promise<void> {
  if (!formData.name || formData.name.trim() === '') {  // +1
    showError('Name is required');
    return;
  }
  if (!formData.email || !formData.email.includes('@')) { // +1
    showError('Invalid email');
    return;
  }
  if (formData.age < 18 || formData.age > 120) {           // +1
    showError('Age must be between 18 and 120');
    return;
  }

  const payload = {
    name: formData.name.trim(),
    email: formData.email.toLowerCase(),
    age: formData.age,
    createdAt: new Date().toISOString(),
  };

  try {                          // +1
    await api.post('/users', payload);
    showSuccess('User created');
  } catch (error) {              // +1
    if (error.status === 409) { // +2
      showError('Email already exists');
    } else {                    // +1
      showError('Unexpected error');
    }
  }
}
```

```ts
// ✅ Good — each concern lives in its own focused function (each function complexity: ≤5)
async function submitForm(formData: FormData): Promise<void> {
  const validationError = validateFormData(formData);
  if (validationError) {   // +1
    showError(validationError);
    return;
  }

  const payload = mapToPayload(formData);
  await saveUser(payload);
}

function validateFormData(data: FormData): string | null {
  if (!data.name?.trim()) return 'Name is required';              // +1
  if (!data.email?.includes('@')) return 'Invalid email';         // +1
  if (data.age < 18 || data.age > 120) return 'Age must be between 18 and 120'; // +1
  return null;
}

function mapToPayload(data: FormData): UserPayload {
  return {
    name: data.name.trim(),
    email: data.email.toLowerCase(),
    age: data.age,
    createdAt: new Date().toISOString(),
  };
}

async function saveUser(payload: UserPayload): Promise<void> {
  try {                         // +1
    await api.post('/users', payload);
    showSuccess('User created');
  } catch (error) {             // +1
    const message = error.status === 409 ? 'Email already exists' : 'Unexpected error'; // +1
    showError(message);
  }
}
```

---

## Tip 4 — Choose the Right Loop and Array Method

Explicit `for` loops with index-based logic and embedded `if/continue/break` accumulate complexity quickly. Functional array methods (`filter`, `map`, `find`, `some`, `every`, `reduce`) declare **intent** rather than **mechanics** and reduce both nesting and complexity score.

```ts
// ❌ Bad — procedural loop with branches (complexity: 6)
function getActiveAdminEmails(users: User[]): string[] {
  const emails: string[] = [];
  for (const user of users) {          // +1
    if (user.isActive) {               // +2
      if (user.role === 'admin') {     // +3
        emails.push(user.email);
      }
    }
  }
  return emails;
}
```

```ts
// ✅ Good — declarative pipeline, zero nesting (complexity: 1)
function getActiveAdminEmails(users: User[]): string[] {
  return users
    .filter(user => user.isActive && user.role === 'admin') // +1
    .map(user => user.email);
}
```

Similarly, replace compound membership checks with `Array.includes()`:

```ts
// ❌ Bad
function isValidStatus(status: string): boolean {
  if (status === 'pending' || status === 'active' || status === 'completed') { // +1 + logical ops
    return true;
  }
  return false;
}

// ✅ Good
function isValidStatus(status: string): boolean {
  return ['pending', 'active', 'completed'].includes(status);
}
```

---

## Tip 5 — Leverage Optional Chaining and Nullish Coalescing

Null-guard chains (`if (a && a.b && a.b.c)`) are a common source of nested or compound conditions. TypeScript's optional chaining (`?.`) and nullish coalescing (`??`) operators collapse these into a single, readable expression.

```ts
// ❌ Bad — repeated null guards inflate boolean complexity
function getCity(user: User | null): string {
  let city = 'Unknown';
  if (user) {                              // +1
    if (user.address) {                   // +2
      if (user.address.city) {            // +3
        city = user.address.city;
      }
    }
  }
  return city;
}
```

```ts
// ✅ Good — optional chaining and nullish coalescing (complexity: 0)
function getCity(user: User | null): string {
  return user?.address?.city ?? 'Unknown';
}
```

```ts
// ❌ Bad — manual default value assignment via if/else
function getTimeout(config: Config | undefined): number {
  if (config && config.timeout !== undefined && config.timeout !== null) { // +1
    return config.timeout;
  }
  return 3000;
}

// ✅ Good
function getTimeout(config: Config | undefined): number {
  return config?.timeout ?? 3000;
}
```

---

## Tip 6 — Avoid Unnecessary Recursion

Recursive solutions require the reader to mentally simulate multiple stack frames at once, which makes the code harder to understand. Prefer iterative solutions when the problem does not naturally map to recursion (e.g., tree traversal).

```ts
// ❌ Bad — recursive factorial is unnecessary; iteration is clearer (complexity: 2)
function factorial(n: number): number {
  if (n <= 1) {                     // +1
    return 1;
  }
  return n * factorial(n - 1);     // recursion adds cognitive load
}
```

```ts
// ✅ Good — iterative version is straightforward and equally readable (complexity: 1)
function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {   // +1
    result *= i;
  }
  return result;
}
```

When recursion **is** the right tool (e.g., traversing a tree), keep the recursive function focused, give it a clear name, and add a brief comment explaining the base case and the recursive step:

```ts
// ✅ Acceptable recursion — tree traversal is a natural use case
/** Collects all leaf-node values in a depth-first order. */
function collectLeaves(node: TreeNode): number[] {
  if (!node.children || node.children.length === 0) {  // +1 — base case: leaf node
    return [node.value];
  }
  return node.children.flatMap(child => collectLeaves(child)); // recursive step
}
```
