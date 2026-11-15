# Error Handling Rule

Handle errors explicitly, with context, and without hiding failures behind null or silent catches.

## Hard Rules

1. **Prefer exceptions to error codes in data/service code.**
   Functions that fetch or compute throw on failure. Never return `null`/`-1`/`false` to signal failure.

2. **Provide context in every thrown error:** the module/function, the operation, and the failing value.

   ```typescript
   // ✅ Correct
   if (!order) throw new Error(`[fetchOrder] Order not found for id: ${orderId}`);

   // ❌ Wrong
   if (!order) throw new Error('Not found');
   ```

3. **Never return null for failure. Never accept null as a parameter.**
   Optional props use `undefined` / `?`, not `null`. Absence is modeled explicitly (optional field or a thrown error).

4. **Catch and log at the boundary, not at every layer.**
   Boundaries in React are: event handlers, async effects/hooks that own the request, and the root `ErrorBoundary`. Intermediate helpers must let errors propagate.

   ```typescript
   // ✅ Correct — hook owns the request and converts failure into UI state
   async function load(): Promise<void> {
     try {
       const data = await orderApi.fetchAll();
       setOrders(data);
     } catch (err: unknown) {
       logger.error('[useOrders] failed to load orders', err);
       setError(ERROR_LOAD_ORDERS);
     }
   }
   ```

5. **Render errors are handled by Error Boundaries.**
   The app root must be wrapped in an `ErrorBoundary` with a fallback UI and crash reporting. Do not use try/catch around JSX.

6. **Every failed user action must give the user feedback** (inline message, toast, or retry UI). Never swallow an error silently.

7. **Use `unknown` in catch blocks, never `any`.** Narrow before reading `.message`.

   ```typescript
   } catch (err: unknown) {
     const message = err instanceof Error ? err.message : String(err);
   }
   ```

8. **Never show raw error messages or stack traces to the user.** Map errors to friendly, localized copy.

## Why

Error codes scatter handling logic and are silently ignored. In the browser you cannot attach a debugger to a user's session: contextual errors, boundary-only logging, and visible user feedback are what make production failures diagnosable and recoverable.
