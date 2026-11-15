# Array Methods Rule

Use the right array utility method for each operation. Never write a manual `for` loop when a declarative method expresses the same intent more clearly.

## Hard Rules

1. **Use `map` for transformations — never `forEach` with push.**
   `map` declares intent: input array → output array of the same length. `forEach` + `push` is an imperative workaround that forces the reader to infer the intent.

   ```typescript
   // ✅ Correct
   const names = users.map(user => user.name);

   // ❌ Wrong — forEach + push is a manual map
   const names: string[] = [];
   users.forEach(user => names.push(user.name));
   ```

2. **Use `filter` for exclusions — never push conditionally inside `forEach`.**

   ```typescript
   // ✅ Correct
   const active = orders.filter(order => order.status === 'active');

   // ❌ Wrong
   const active: Order[] = [];
   orders.forEach(order => {
     if (order.status === 'active') active.push(order);
   });
   ```

3. **Use `find` / `findIndex` to locate a single element — never a `for` loop with a flag.**

   ```typescript
   // ✅ Correct
   const target = items.find(item => item.id === id);
   const index = items.findIndex(item => item.id === id);

   // ❌ Wrong
   let target: Item | undefined;
   for (const item of items) {
     if (item.id === id) { target = item; break; }
   }
   ```

4. **Use `some` / `every` for boolean checks — never a manual flag variable.**

   ```typescript
   // ✅ Correct
   const hasActive = orders.some(order => order.status === 'active');
   const allConfirmed = orders.every(order => order.confirmed);

   // ❌ Wrong
   let hasActive = false;
   for (const order of orders) {
     if (order.status === 'active') { hasActive = true; break; }
   }
   ```

5. **Use `flatMap` instead of `map` + `flat(1)`.**

   ```typescript
   // ✅ Correct
   const tags = posts.flatMap(post => post.tags);

   // ❌ Wrong
   const tags = posts.map(post => post.tags).flat();
   ```

6. **Use `includes` instead of `indexOf !== -1`.**

   ```typescript
   // ✅ Correct
   if (allowedStatuses.includes(order.status)) { ... }

   // ❌ Wrong
   if (allowedStatuses.indexOf(order.status) !== -1) { ... }
   ```

7. **Use `reduce` only when no simpler method fits.**
   `reduce` is powerful but reduces readability. Prefer `filter` + `map` or `Object.fromEntries` + `map` before reaching for `reduce`.

   ```typescript
   // ✅ Correct — reduce is the right fit for grouping
   const byTenant = orders.reduce<Record<string, Order[]>>((acc, order) => {
     (acc[order.tenantId] ??= []).push(order);
     return acc;
   }, {});

   // ✅ Better — Object.fromEntries when mapping to an object
   const labelMap = Object.fromEntries(items.map(item => [item.id, item.label]));

   // ❌ Wrong — reduce used as a convoluted map
   const names = users.reduce<string[]>((acc, user) => {
     acc.push(user.name);
     return acc;
   }, []);
   ```

8. **Never mutate the source array — always return a new one.**
   Methods like `sort`, `reverse`, and `splice` mutate in place. Spread or slice before calling them.

   ```typescript
   // ✅ Correct — spread before sort
   const sorted = [...orders].sort((a, b) => a.createdAt - b.createdAt);

   // ❌ Wrong — sorts the original array as a side effect
   orders.sort((a, b) => a.createdAt - b.createdAt);
   ```

9. **Never use `forEach` when a return value is needed.**
   `forEach` always returns `void`. If the result matters, use `map`, `filter`, `reduce`, or `flatMap`.

   ```typescript
   // ✅ Correct
   return items.map(item => transform(item));

   // ❌ Wrong — forEach discards the transformed values
   items.forEach(item => transform(item)); // result is lost
   ```

10. **Chain at most two array methods inline. Extract intermediate results beyond that.**
    Long chains are hard to debug and hide intermediate shapes from the type checker.

    ```typescript
    // ✅ Correct — two methods, intent is clear
    const activeNames = users.filter(u => u.active).map(u => u.name);

    // ✅ Correct — three steps: extract the intermediate array
    const activeUsers = users.filter(u => u.active);
    const enriched = activeUsers.map(u => enrich(u));
    const sorted = [...enriched].sort((a, b) => a.score - b.score);

    // ❌ Wrong — three inline methods obscure what each step produces
    const result = users.filter(u => u.active).map(u => enrich(u)).sort((a, b) => a.score - b.score);
    ```

## Why

Declarative array methods communicate *what* is being computed, not *how*. A reader seeing `filter` immediately knows only a subset passes; seeing `map` immediately knows every element is transformed. Manual loops force the reader to simulate execution to infer the same intent. Immutability via spread prevents surprising aliasing bugs. Capping chain length keeps intermediate types inspectable and failures easier to isolate.
