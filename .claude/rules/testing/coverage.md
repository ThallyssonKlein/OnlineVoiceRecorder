---
name: Coverage Rule
description: Implementation files in src/ must have >= 80% test coverage across statements, branches, functions, and lines.
type: feedback
---

# Coverage Rule

When writing or editing implementation files under `src/`, ensure the corresponding test file covers **>= 80%** on all four metrics: Stmts, Branch, Funcs, Lines.

## How to apply

- Write comprehensive tests upfront — cover happy path, error paths, and edge cases.
- If editing an existing file, check whether new branches or functions are already covered by existing tests and add missing cases.
- Test files live next to the source or mirror its path (follow the project convention) and are named `*.test.ts(x)`

## Verification

To check coverage for a specific file:

```bash
npx jest --coverage --collectCoverageFrom="<src_file>" <test_file>
```
