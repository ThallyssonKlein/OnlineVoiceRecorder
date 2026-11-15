# TypeScript Path Aliases Rule

Always use path aliases for imports. Never use relative paths (`../`) to cross directory boundaries.

## Available Aliases

Check `tsconfig.json` (`compilerOptions.paths`) for the full list (e.g. `@components/*`, `@hooks/*`, `@pages/*`, `@services/*`, `@styles/*`, `@assets/*`).

## Hard Rules

1. **Never use `../` when an alias covers the target.**
2. **`./` is allowed only within the same immediate folder.**
3. **Apply aliases in both `src/` and test files.**
4. **Every alias must be configured in all three places, or imports will break at runtime:**
   - `tsconfig.json` → `paths`
   - the bundler config (`vite.config.ts` → `resolve.alias`, or `next.config`/`webpack`)
   - `jest.config.js` → `moduleNameMapper` (or `vitest.config.ts` → `resolve.alias`)

## Why

The bundler does not read `tsconfig.json` paths on its own — an alias that type-checks but is missing from the bundler config breaks the build or crashes at runtime. Aliases make imports self-documenting and resilient to restructuring.
