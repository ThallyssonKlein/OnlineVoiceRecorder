---
name: Logs and Analytics Rule
description: Implementation files must use the shared logger; user-facing flows and external calls emit analytics events and error reporting.
type: feedback
---

# Logs and Analytics Rule

## Scope

Applies to `src/**/*.ts(x)` except type-only files, pure presentational components, style/constants files, and tests (`*.test.ts(x)`).

## Required Patterns

### Logs

Use the project's configured logger through a shared instance — never `console.*`. Use the right level (`info`, `warn`, `error`). The prefix rule is in `log-class-prefix.md`.

```typescript
logger.info('[useCheckout] checkout submitted');
logger.error('[useCheckout] checkout failed', err);
```

### Analytics / metrics

Use the project's configured analytics library. Track key user actions (page views, submits, purchases) and outcomes (success / failure) of important external calls. Keep property cardinality low and never include PII in event properties.

```typescript
analytics.track('checkout_submitted', { status: 'ok' });
```

### Crash and error reporting

Unexpected errors caught at a boundary (error boundary, top-level handler) must be reported to the configured crash-reporting tool in addition to being logged.

> Snippets are illustrative. Use whichever logging, analytics, and crash libraries the project already adopts.

## Why

Frontend code runs in browsers you cannot inspect. Structured logs, a small set of well-named analytics events, and crash reports are the only way to understand what happened in the field.
