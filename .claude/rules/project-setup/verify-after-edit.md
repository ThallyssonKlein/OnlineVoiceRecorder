---
name: Verify After Edit Rule
description: After modifying any file under src/ or tests, run lint, type-check, and the affected tests — fix all failures before finishing.
type: feedback
---

# Verify After Edit Rule

After **any** modification to source or test files, run lint, the type-check, and the affected tests. A task is not done until all pass.

## Hard Rules

1. **Only after ALL edits are done — run lint, then type-check, then the affected tests.**

   ```bash
   npm run lint -- --fix
   npx tsc --noEmit
   npx jest path/to/affected.test.tsx
   ```

2. **Fix lint, type, and test failures before finishing.** Re-run until clean.
3. **Do not skip verification for "small" edits.**
4. **A production build (`npm run build`) is not required for every edit,** but run it when you changed bundler/framework config, env handling, routing, or added a dependency. Mention when build verification was not possible.

## Order of Operations

```
1. Make ALL code changes
2. npm run lint -- --fix   ← fix until clean
3. npx tsc --noEmit        ← fix until exits 0
4. npx jest <affected>     ← fix until green
```

## Why

Unverified changes break the pipeline and shift debugging to the next person. In React, type errors and bad imports often only surface as a blank screen in the browser — catching them locally is far cheaper.
