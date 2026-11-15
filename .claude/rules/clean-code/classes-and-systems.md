# Components, Hooks and Modules Rule

A unit (component, hook, module) must have one reason to change. A system is healthy when each unit is cohesive, minimal, and expressive.

## Hard Rules

1. **Apply the Single Responsibility Principle.**
   - **Pages** compose hooks and components and wire routing.
   - **Presentational components** render props; they do not fetch data or touch storage.
   - **Hooks** own state, side effects, and data fetching.
   - **Services / API clients** talk to the network or browser APIs (storage, WebSocket).

   ```tsx
   // ✅ Correct — each unit owns one responsibility
   function OrdersPage() {
     const { orders, isLoading } = useOrders();
     if (isLoading) return <LoadingView />;
     return <OrdersList orders={orders} />;
   }

   // ❌ Wrong — page fetches, maps, formats, and renders
   function OrdersPage() {
     const [orders, setOrders] = useState<Order[]>([]);
     useEffect(() => { fetch('/orders').then(r => r.json()).then(raw => setOrders(raw.map(mapOrder))); }, []);
     return <FlatList data={orders} renderItem={({ item }) => <Text>{new Date(item.date).toLocaleDateString()}</Text>} />;
   }
   ```

2. **Keep units cohesive.** If a hook returns two unrelated groups of values, split it into two hooks.

3. **Follow the four rules of Simple Design (in priority order):** passes all tests, no duplication, expresses intent, minimal number of units. Do not merge units or collapse abstractions just to reduce count.

4. **Prefer function components and hooks.** Use a class only where React requires one (e.g. an `ErrorBoundary`).

5. **Prefer composition over configuration.** Use `children` and small focused components instead of components with many boolean props (`isPrimary`, `isLarge`, `isOutlined`…).

6. **Dependencies flow one way:** pages → components/hooks → services → utils. A service must never import from a component or screen.

## Why

Single-responsibility units are easy to name, test, and replace. Separating UI from data fetching lets you render a component in isolation with fixture props and test a hook without mounting a page.
