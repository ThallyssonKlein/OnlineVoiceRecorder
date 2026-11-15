# Log Prefix Rule

Every log statement must be prefixed with `[Name]` — the exact name of the component, hook, or module where the log is written.

## Hard Rules

1. **All `logger.*` calls start with `[Name]` as the first part of the message.**
   Use the literal component/hook/module name (`PascalCase` for components, exact `useThing` for hooks).

   ```typescript
   // ✅ Correct
   logger.info('[CheckoutPage] checkout started');
   logger.warn('[useOrders] cache miss, refetching');
   logger.error('[paymentApi] failed to create payment', err);

   // ❌ Wrong
   logger.info('checkout started');
   logger.info('CheckoutPage: checkout started');
   ```

2. **For `logger.error`, pass the error object as the second argument.**
3. **Messages are descriptive and in English.** Avoid `[Name] error` or `[Name] ok`.
4. **Never use `console.log` / `console.warn` / `console.error`.** Use the shared logger.
5. **Never log secrets or PII** — tokens, passwords, full card numbers, emails, phone numbers, or precise location.

## Why

A consistent prefix makes log lines filterable and traceable to source without a stack trace — important when reading browser logs or a crash-reporting breadcrumb trail.
