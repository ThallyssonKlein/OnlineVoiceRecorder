# Meaningful Names Rule

Every identifier — variable, function, component, hook, type — must reveal its purpose without requiring a comment.

## Hard Rules

1. **Names must reveal intent.** If you need a comment to explain the name, rename it.

   ```typescript
   // ✅ Correct
   const daysSinceLastSync = 5;
   function getActiveAccounts(userId: string): Account[] { ... }

   // ❌ Wrong
   const d = 5; // elapsed days
   function get(id: string) { ... }
   ```

2. **Avoid disinformation.** Do not use `List` unless the value is a list; do not use `Data` or `Info` as meaningless suffixes.

3. **Make meaningful distinctions.** No numbered suffixes (`a1`, `a2`) and no noise words (`Manager`, `Processor`, `Handler`) unless the distinction is real.

4. **Use pronounceable and searchable names.** Single-letter names are allowed only for loop counters in a tiny scope. Callback params in short lambdas should still be words (`user => user.name`, not `u => u.name`).

5. **Components are PascalCase nouns; hooks start with `use`; handlers are verbs.**
   - Components: `OrderCard`, `PrimaryButton`, `ProfilePage`.
   - Hooks: `useOrders`, `useDebouncedValue`. Only functions that call hooks may start with `use`.
   - Event handlers inside a component: `handle<Event>` (`handleClick`, `handleSubmit`).
   - Callback props: `on<Event>` (`onClick`, `onSubmit`).

   ```tsx
   // ✅ Correct
   <OrderCard order={order} onClick={handleOrderClick} />

   // ❌ Wrong
   <OrderCard order={order} click={orderClicked} />
   ```

6. **Boolean names read as questions: `isLoading`, `hasError`, `canSubmit`, `shouldRefetch`.**

## Why

Poorly named identifiers shift cognitive load onto every reader. A name that reveals intent is self-documenting, makes diffs easier to review, and the `use`/`handle`/`on` conventions are what lint rules (like `react-hooks`) rely on.
