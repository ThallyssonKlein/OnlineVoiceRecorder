# ESM Imports Rule

Always use ES module syntax (`import` / `export`). Never use CommonJS (`require` / `module.exports`).

## Hard Rules

1. **Always use `import`.** Never call `require()` inline, dynamically, or inside a function body.

   ```typescript
   // ✅ Correct
   import { useState } from 'react';
   import { useOrders } from '@hooks/useOrders';

   // ❌ Wrong
   const { useState } = require('react');
   ```

   **No exceptions for assets:** import static assets with ESM (`import logo from '@assets/logo.svg'`) and let the bundler resolve them. Lazy-load routes/components with dynamic `import()` (`React.lazy`), which is ESM, not `require`.

2. **Always use `export`; never `module.exports` / `exports.x`.**
   Config files read by tooling that mandates CommonJS (`jest.config.js`, `.eslintrc.cjs`, `postcss.config.cjs` when the tool mandates CommonJS) are exempt.

3. **Prefer named exports over default exports.** Exception: files whose default export is mandated by a framework (e.g. Next.js `page.tsx`/`layout.tsx`, `React.lazy` targets).

   ```typescript
   // ✅ Correct
   export function OrderCard(props: OrderCardProps) { ... }
   ```

4. **Never use dynamic `require()` to break a circular dependency.** Extract the shared type/value into a third module.

5. **Re-exports must use ESM syntax** (`export { X } from './x'`, `export type { T } from './types'`).

6. **Use `import type` for type-only imports.** It keeps them out of the bundle.

## Why

`import`/`export` are statically analyzable, enabling type checking, tree-shaking, and reliable IDE navigation. Inline `require` also defeats the bundler's static dependency graph and code splitting.
