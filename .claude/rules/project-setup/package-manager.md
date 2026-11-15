# Package Manager Rule

Always use **npm** as the package manager. Never use `yarn`, `pnpm`, `bun`, or any other alternative. (One-off CLIs such as `npx create-vite` are still invoked through `npx`.)

## Hard Rules

1. **Use `npm` for all package management commands.**
   Never run `yarn`, `pnpm`, or `bun` commands — even if the user asks for the equivalent.

   ```bash
   # ✅ Correct
   npm install
   npm install <package>
   npm install --save-dev <package>
   npm uninstall <package>
   npm run <script>
   npm ci

   # ❌ Wrong
   yarn add <package>
   pnpm install
   bun add <package>
   ```

2. **Never create or modify `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb`.**
   The only lockfile in this project is `package-lock.json`. Do not generate or commit any other lockfile format.

3. **Always use `npm ci` in CI/CD and scripted environments.**
   `npm ci` installs exactly what is in `package-lock.json` without mutating it. Reserve `npm install` for local development when adding or updating packages.

   ```bash
   # ✅ CI / scripted install
   npm ci

   # ✅ Local — adding a new dependency
   npm install <package>
   ```

4. **Run scripts through `npm run`, not directly.**
   Always use `npm run <script>` to invoke scripts defined in `package.json`.

   ```bash
   # ✅ Correct
   npm run build
   npm run lint
   npm test

   # ❌ Wrong — invokes the tool directly, bypassing npm lifecycle hooks
   tsc
   eslint src/
   jest
   ```

## Why

A single package manager per project guarantees a reproducible dependency graph. Mixing managers produces conflicting lockfiles, inconsistent `node_modules` layouts, and hard-to-diagnose version drift. `npm` is the standard for this project — enforcing it avoids accidental manager switching that silently breaks the install.
