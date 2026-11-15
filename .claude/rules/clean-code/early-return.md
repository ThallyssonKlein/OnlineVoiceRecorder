# Early Return Rule

Exit a function as soon as preconditions fail. Never wrap the happy path in a conditional block.

## Hard Rules

1. **Guard at the top, return early, keep the happy path flat.**

   ```typescript
   // ✅ Correct
   async function submitOrder(params: SubmitOrderParams): Promise<void> {
     if (!params.items.length) throw new Error('[submitOrder] cart is empty');
     if (!params.addressId) throw new Error('[submitOrder] addressId is required');

     await orderApi.create(params);
   }

   // ❌ Wrong — happy path buried in nested ifs
   async function submitOrder(params: SubmitOrderParams): Promise<void> {
     if (params.items.length) {
       if (params.addressId) {
         await orderApi.create(params);
       }
     }
   }
   ```

2. **Never use `else` after a block that throws or returns.**

   ```typescript
   // ✅ Correct
   function resolveLabel(status: OrderStatus): string {
     if (status === 'paid') return 'Paid';
     if (status === 'pending') return 'Pending';

     return 'Unknown';
   }

   // ❌ Wrong
   function resolveLabel(status: OrderStatus): string {
     if (status === 'paid') {
       return 'Paid';
     } else if (status === 'pending') {
       return 'Pending';
     } else {
       return 'Unknown';
     }
   }
   ```

3. **In components, return early for loading, error, and empty states before rendering the main tree.**
   The final `return` is always the success UI, unindented and unconditional.

   ```tsx
   // ✅ Correct
   function OrdersPage() {
     const { orders, isLoading, error } = useOrders();

     if (isLoading) return <LoadingView />;
     if (error) return <ErrorView onRetry={error.retry} />;
     if (!orders.length) return <EmptyOrders />;

     return <OrdersList orders={orders} />;
   }

   // ❌ Wrong — nested ternaries in JSX
   function OrdersPage() {
     const { orders, isLoading, error } = useOrders();
     return isLoading ? <LoadingView /> : error ? <ErrorView /> : orders.length ? <OrdersList orders={orders} /> : <EmptyOrders />;
   }
   ```

4. **For `void` functions and handlers, return early to skip the rest of the body.**

   ```typescript
   // ✅ Correct
   const handleClick = () => {
     if (isSubmitting) return;

     onSubmit(form);
   };
   ```

## Why

Nesting is the enemy of readability. Early returns keep functions and components linear: a reader scans a list of exit conditions, then reaches the single happy path, unindented and unambiguous. This matters even more in JSX, where nested ternaries quickly become unreadable.
