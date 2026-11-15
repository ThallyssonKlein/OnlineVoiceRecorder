# No Magic Numbers Rule

Every numeric or string literal that carries domain or design meaning must be extracted to a named constant or design token.

## Hard Rules

1. **Never use a bare literal where its meaning is not self-evident.**

   ```typescript
   // ✅ Correct
   const MAX_RETRY_ATTEMPTS = 3;
   const SEARCH_DEBOUNCE_MS = 300;

   // ❌ Wrong
   if (attempt > 3) throw new Error('[RetryPolicy] max retries exceeded');
   const debounced = useDebouncedValue(query, 300);
   ```

2. **Layout and visual values come from the theme (design tokens), not inline literals.**
   Spacing, font sizes, radii, colors, and z-indexes must reference shared tokens.

   ```tsx
   // ✅ Correct
   const styles = StyleSheet.create({
     card: { padding: theme.spacing.md, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface },
   });

   // ❌ Wrong
   const styles = StyleSheet.create({
     card: { padding: 16, borderRadius: 12, backgroundColor: '#FAFAFA' },
   });
   ```

3. **Place constants as close as possible to their use, but no closer than needed.**
   Module-scoped for values used by several members of one file; do not export unless another module imports it.

4. **Navigation route names, storage keys, analytics event names, and API paths are named constants.**

   ```typescript
   // ✅ Correct
   const STORAGE_KEY_AUTH_TOKEN = 'auth.token';
   storage.set(STORAGE_KEY_AUTH_TOKEN, token);

   // ❌ Wrong
   storage.set('auth.token', token);
   ```

5. **Exempt literals:** `0` and `1` where meaning is obvious, boolean literals, and empty string defaults. Hairline values like `flex: 1` and `StyleSheet.hairlineWidth` are also exempt.

6. **Use numeric separators for large literals** (`86_400_000`).

## Why

A magic number is a contract the future reader was never told about. Named constants and theme tokens create a single point of change — essential when a design refresh changes every spacing value, or when dark mode needs a different color for the same role.
