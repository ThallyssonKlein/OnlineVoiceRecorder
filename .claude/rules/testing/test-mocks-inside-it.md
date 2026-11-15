# Mock Locality Rule

All mock setup — values, return values, and subject rendering/instantiation — must live **inside the `it` block** where they are used. Never hoist mocks into `describe` scope, `beforeEach`, or `beforeAll`.

## Hard Rules

1. **Declare mocks and configure return values inside `it`.**
2. **Do not use `beforeEach` to configure mocks or render components.** `jest.clearAllMocks()` / `afterEach` cleanup at file level is fine.
3. **Do not share mocked instances or rendered trees across tests via outer `let` variables.**
4. **`jest.mock()` at the top of the file is allowed** for module interception (browser APIs, router). Return values and implementations still go inside the `it`.
5. **Use a small file-scoped `renderX()` helper** when rendering needs providers; call it inside each `it`.

## Standard Pattern

```tsx
// ✅ Correct
it('should show the orders returned by the API', async () => {
  const mockApi = { fetchAll: jest.fn().mockResolvedValue([{ id: '1', title: 'Order 1' }]) };

  render(<OrdersPage api={mockApi} />);

  expect(await screen.findByText('Order 1')).toBeInTheDocument();
});
```

```tsx
// ❌ Wrong — shared state hoisted out of the test
describe('OrdersPage', () => {
  let mockApi: jest.Mocked<OrdersApi>;
  beforeEach(() => { mockApi = { fetchAll: jest.fn() }; render(<OrdersPage api={mockApi} />); });
  ...
});
```

## Why

Self-contained tests are easier to read, debug, and refactor. Shared mocks and shared rendered trees leak state between tests, which in React shows up as flaky, order-dependent failures.
