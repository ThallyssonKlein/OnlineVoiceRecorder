# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Turbopack, localhost:3000)
npm run build    # Production build (Turbopack)
npm run start    # Serve production build
npm run lint     # Run ESLint
```

There is no test command configured. Playwright is installed as a dependency but no test files exist yet.

## Architecture

Single-page Next.js 16 app using the App Router. All UI lives in `app/page.tsx` as a single Client Component (`'use client'`), which uses the `useVoiceRecorder` hook from `react-voice-recorder-kit` to manage recorder state.

**State machine**: The recorder cycles through states — `idle → recording → paused → reviewing/playing` — controlled via the hook's returned handlers (`start`, `handlePause`, `handleResume`, `handleStop`, `handlePlay`, `handleRestart`, `handleDelete`). The UI renders different controls based on the current state.

**Styling**: Tailwind CSS v4 via `@import "tailwindcss"` in `globals.css`. No config file — v4 uses zero-config CSS-first approach.

## Next.js 16 Breaking Changes (vs. your training data)

- **Turbopack is default**: `next dev` and `next build` both use Turbopack. Custom webpack config will break builds — use `--webpack` flag to opt out.
- **Async Request APIs only**: `cookies()`, `headers()`, `draftMode()`, and `params` in layouts/pages are async-only. Synchronous access was removed.
- **`middleware` → `proxy`**: The `middleware.ts` convention is deprecated; use `proxy.ts`. Edge runtime is NOT supported in proxy (nodejs only).
- **`revalidateTag` requires second arg**: Now takes a `cacheLife` profile as the second argument.
- **Stable cache APIs**: Use `cacheLife`/`cacheTag` directly (no `unstable_` prefix).
- **ESLint**: Uses the ESLint CLI directly (`eslint`), not `next lint`.

Before writing code that touches routing, caching, or middleware, read the relevant guide in `node_modules/next/dist/docs/`.
