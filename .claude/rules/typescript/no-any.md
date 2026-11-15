# No `any` Rule

Never use `any` in TypeScript. Every value must have an explicit, accurate type.

## Hard Rules

1. **Never write `: any` or `as any`.**
   If the type is unknown at compile time, use `unknown` and narrow it explicitly.

2. **Never use `any` to silence a TypeScript error.**
   Fix the root type mismatch instead. If a third-party type is wrong, extend or override it with `declare module` or a wrapper type.

3. **Never cast through `any` (e.g. `value as any as Target`).**
   Write a proper type guard or assertion function instead.

4. **`unknown` is the safe alternative for truly unknown input.**
   Use `unknown` for external data (HTTP bodies, parsed JSON, errors in `catch`), then narrow with type guards or `zod`/`io-ts` schemas before use.

5. **Generic parameters must be constrained, not defaulted to `any`.**
   ```typescript
   // ✅ Correct
   function wrap<T extends object>(value: T): T { ... }

   // ❌ Wrong
   function wrap<T = any>(value: T): T { ... }
   ```

## Allowed Exceptions

- `eslint-disable` lines in generated files (e.g. auto-generated SDK types) that you did not write and cannot change.
- Third-party library types that expose `any` internally — do not re-export or widen them.

## Standard Patterns

```typescript
// ✅ Unknown input narrowed with a type guard
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ✅ catch block — use unknown, not any
try {
  ...
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  logger.error('[MyClass] operation failed', message);
}

// ✅ Generic utility type instead of any
type HttpResponse<T> = { data: T; status: number };

// ❌ Wrong — any suppresses the error instead of fixing it
const result = (value as any).someProperty;

// ❌ Wrong — any in catch
} catch (err: any) {
  logger.error(err.message);
}
```

## Why

`any` disables the type checker for the annotated value and all values derived from it. A single `any` can silently propagate unsafety across an entire call chain. `unknown` provides the same flexibility while forcing explicit narrowing at the boundary — the compiler stays in control.
