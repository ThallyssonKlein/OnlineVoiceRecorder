# Comments Rule

Code must explain itself. A comment is an admission that the code failed to communicate its intent on its own.

## Hard Rules

1. **Do not comment bad code — clean it instead.**
   If a block requires a comment to be understood, refactor it until the code speaks for itself.

2. **Never write redundant comments.**
   Do not restate what the code already says.

   ```typescript
   // ✅ Correct — no comment needed; the name is self-explanatory
   const daysSinceLastModification = daysBetween(lastModifiedAt, now);

   // ❌ Wrong — comment repeats the code
   // Gets the days since last modification
   const daysSinceLastModification = daysBetween(lastModifiedAt, now);
   ```

3. **Never commit commented-out code.**
   Delete it. Version control preserves history — commented-out code is noise that misleads future readers.

   ```typescript
   // ❌ Wrong
   // const result = oldImplementation(id);
   const result = newImplementation(id);
   ```

4. **Never write historical or changelog comments.**
   That information belongs in git commits and PR descriptions, not in source files.

   ```typescript
   // ❌ Wrong
   // 2024-03-01 — changed by Alice to fix the session resolution bug
   const session = resolveSession(storedToken);
   ```

5. **Good comments are allowed when they add information the code cannot.**
   Acceptable uses:
   - **Legal notices** at the top of a file (copyright, license).
   - **Intent explanations** — *why* a non-obvious decision was made, not *what* the code does.
   - **Consequence warnings** — side effects or gotchas a caller must know.
   - **TODO notes** — tracked, actionable, and short.

   ```typescript
   // ✅ Intent — explains a non-obvious constraint
   // The backend rejects raw JSON bodies; payloads must be base64-encoded.
   const encoded = btoa(JSON.stringify(payload));

   // ✅ Warning — consequence a caller must know
   // Calling this method closes the connection; do not reuse the client afterward.
   await client.disconnect();

   // ✅ TODO — actionable and short
   // TODO: replace with streaming once the SDK supports it
   const data = await fetchAll();
   ```

## Why

Every comment is maintenance debt: it must stay in sync with the code it describes, or it becomes a lie. Code that needs a comment to be understood is code that needs to be rewritten. Comments that survive are the ones that capture intent, constraints, or context that no identifier or structure can express alone.
