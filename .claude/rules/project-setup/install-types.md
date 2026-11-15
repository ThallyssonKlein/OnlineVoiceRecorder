# Install Types Rule

Whenever installing a package that does not bundle its own TypeScript types, also install the corresponding `@types/` package as a dev dependency.

## Hard Rules

1. **Always check if the package ships its own types before installing.**
   A package ships its own types if its `package.json` has a `"types"` or `"typings"` field, or if it includes a `.d.ts` file at the root. If it does, no `@types/` package is needed.

   ```bash
   # Quick check — if output is empty, the package does NOT ship its own types
   npm show <package> types typings
   ```

2. **If the package does not ship its own types, install `@types/<package>` as a dev dependency in the same command.**

   ```bash
   # ✅ Correct — runtime dep + types together
   npm install express && npm install --save-dev @types/express

   # ✅ Correct — types-only install when the runtime dep already exists
   npm install --save-dev @types/node

   # ❌ Wrong — installs the package but leaves TypeScript blind to its types
   npm install express
   ```

3. **Always install `@types/` packages with `--save-dev`, never as a regular dependency.**
   Type declarations are a compile-time concern and must not ship in the production bundle.

   ```bash
   # ✅ Correct
   npm install --save-dev @types/jest @types/node @types/express

   # ❌ Wrong — types end up in dependencies instead of devDependencies
   npm install @types/express
   ```

4. **If `@types/<package>` does not exist on npm, create a minimal local declaration file.**
   Place it under `src/types/<package>.d.ts` and declare the module so TypeScript stops complaining.

   ```typescript
   // src/types/some-untyped-lib.d.ts
   declare module 'some-untyped-lib' {
     export function doSomething(input: string): string;
   }
   ```

5. **Keep `@types/` versions aligned with the runtime package major version.**
   Mismatched majors cause type errors that don't reflect the actual runtime API.

   ```bash
   # ✅ Correct — express v4 paired with @types/express v4
   npm install express@4 && npm install --save-dev @types/express@4

   # ❌ Wrong — @types major does not match runtime major
   npm install express@4 && npm install --save-dev @types/express@2
   ```

## Why

TypeScript can only enforce correctness for packages it has type information for. Installing a package without its `@types/` counterpart silently downgrades every import from that package to `any`, bypassing the type checker for all callers. Catching this at install time costs one extra command; discovering it later costs a debugging session.
