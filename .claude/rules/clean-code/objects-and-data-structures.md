# Data and Behavior Rule

Keep data shapes and behavior separate. Never mix the two roles in the same type.

## Hard Rules

1. **Model data as plain `interface`/`type` values** (API DTOs, props, navigation params, state). They have no methods.

2. **Put behavior in functions, hooks, and services — not in data objects.**

   ```typescript
   // ✅ Correct
   interface Order { id: string; total: number; status: OrderStatus }
   function isOrderCancellable(order: Order): boolean { ... }

   // ❌ Wrong — data bag with behavior and public mutable fields
   class Order { public status: OrderStatus; cancel() { ... } }
   ```

3. **Obey the Law of Demeter.** Do not chain through returned objects (`user.account.settings.theme.colors.primary`). Expose a focused value from a hook or selector instead.

4. **Treat state as immutable.** Never mutate state, props, or context values. Create new objects/arrays.

   ```typescript
   // ✅ Correct
   setItems(current => [...current, newItem]);
   // ❌ Wrong
   items.push(newItem); setItems(items);
   ```

5. **Map API payloads to app models at the boundary.** Components never consume raw API responses; the service/mapper layer converts them to the app's own types.

## Why

Plain data is trivial to serialize, test, and pass across the bridge or navigation params. Immutability is what lets React detect changes and what makes `memo` and selector optimizations safe.
