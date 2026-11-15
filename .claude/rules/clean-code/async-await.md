# Async/Await Rule

Always use `async/await` to handle promises. Never use raw `.then()` / `.catch()` chains or Node-style callbacks.

## Hard Rules

1. **All async operations must use `async/await`.**

   ```typescript
   // ✅ Correct
   async function fetchProfile(userId: string): Promise<Profile> {
     const profile = await profileApi.fetchById(userId);
     if (!profile) throw new Error(`[fetchProfile] Profile not found for id: ${userId}`);
     return profile;
   }

   // ❌ Wrong — promise chain
   function fetchProfile(userId: string): Promise<Profile> {
     return profileApi.fetchById(userId).then(profile => profile);
   }
   ```

2. **Never pass an `async` function directly where a sync callback is expected without handling its promise.**
   `onClick`, `onSubmit`, `useEffect` and event handlers ignore returned promises, so rejections vanish. Wrap the call in a handler that uses `try/catch`.

   ```typescript
   // ✅ Correct — async work lives in a named handler with try/catch
   const handleSave = async () => {
     try {
       await saveProfile(form);
     } catch (err: unknown) {
       logger.error('[ProfilePage] failed to save profile', err);
       showErrorToast(ERROR_SAVE_PROFILE);
     }
   };

   // ❌ Wrong — floating promise, rejection is silently lost
   <button onClick={() => saveProfile(form)} />
   ```

3. **`useEffect` callbacks must not be `async`. Declare an inner async function and call it.**
   An async effect returns a promise, which React interprets as a cleanup function.

   ```typescript
   // ✅ Correct
   useEffect(() => {
     const load = async () => {
       const data = await profileApi.fetchById(userId);
       setProfile(data);
     };
     load();
   }, [userId]);

   // ❌ Wrong
   useEffect(async () => {
     setProfile(await profileApi.fetchById(userId));
   }, [userId]);
   ```

4. **Guard against state updates after unmount or stale responses.**
   Use an `AbortController` or an `isCurrent` flag in the effect cleanup so an old response never overwrites newer state.

   ```typescript
   // ✅ Correct
   useEffect(() => {
     let isCurrent = true;
     const load = async () => {
       const data = await profileApi.fetchById(userId);
       if (isCurrent) setProfile(data);
     };
     load();
     return () => { isCurrent = false; };
   }, [userId]);
   ```

5. **Never use Node-style callbacks.** Wrap callback-based browser/JS APIs once at the integration boundary with `new Promise()`; all callers use `await`.

6. **Never mix `await` and `.then()` on the same value, and use `try/catch` instead of `.catch()`.**

## Why

`async/await` keeps control flow linear and errors visible through `try/catch`. In React specifically, event handlers and effects silently drop returned promises, so unhandled rejections become invisible bugs in a user's browser that you cannot reproduce from a stack trace.
