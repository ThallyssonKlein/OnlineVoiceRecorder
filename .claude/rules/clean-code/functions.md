# Functions Rule

Functions (and components) must be small, single-purpose, and predictable.

## Hard Rules

1. **A function does exactly one thing.**
   If you can describe what it does with "and", split it.

2. **Keep all statements at the same abstraction level.**
   A page composes hooks and child components — it does not format dates, parse API payloads, or build request bodies inline. Extract those to helpers or hooks.

3. **Limit function parameters to two. Group anything beyond that into a typed object.**
   Components already follow this: they receive a single typed `props` object.

   ```typescript
   // ✅ Correct
   interface TrackEventParams { name: string; screen: string; properties: Record<string, string> }
   function trackEvent(params: TrackEventParams): void

   // ❌ Wrong
   function trackEvent(name: string, screen: string, properties: Record<string, string>): void
   ```

4. **No hidden side effects.**
   A function must only do what its name promises. A function named `formatPrice` must not log, navigate, or write to storage.

5. **Obey Command-Query Separation.**
   Functions that change state return `void` (or `Promise<void>`). Functions that return data do not change state.

6. **Keep components small: when JSX grows past roughly one screen, extract child components.**
   Do not create components inside other components' render bodies — they remount on every render.

## Why

A function that does one thing at one abstraction level can be named precisely, tested in isolation, and replaced without side effects. In React, small components also re-render less and are easier to memoize.
