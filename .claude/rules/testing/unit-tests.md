---
name: Unit Test Rule
description: Test behavior through the user's eyes with React Testing Library; mock network and browser APIs; use builders for repeated shapes.
type: feedback
---

# Unit Test Rule

## The Three Laws of TDD

1. Do not write production code without a failing test first.
2. Do not write more test code than is necessary to fail.
3. Do not write more production code than is necessary to pass.

## F.I.R.S.T.

Tests must be **Fast**, **Independent**, **Repeatable**, **Self-validating**, and **Timely**.

## Hard Rules

1. **Test behavior the user can observe, not implementation details.**
   Use React Testing Library queries (`getByRole`, `getByLabelText`, `getByText`, `getByTestId` as a last resort) and `userEvent` (`user.click`, `user.type`). Never assert on internal state, hook internals, or component instances.

2. **Never test more than one layer at a time.**
   - Component: render with fixture props; mock hooks/services it depends on.
   - Hook: use `renderHook`; mock the service/API client.
   - Service/API client: mock the HTTP client or `fetch`.
   - Pure utils/mappers: call directly with valid and invalid inputs.

3. **Mock every I/O boundary.** No real network, `localStorage`, timers, geolocation, clipboard, or WebSocket. Mock the network at the HTTP layer (e.g. MSW) or mock the service module via `jest.mock()`.

4. **Never test third-party UI libraries or navigation internals.** Mock the router hooks (`useNavigate`, `useRouter`) and assert on navigation calls.

5. **Assert on mock calls and rendered output, not on side effects.**

6. **Never assert on log calls.** Logging is observability, not behavior.

7. **Use async queries (`findBy*`, `waitFor`) for async UI; never use arbitrary `setTimeout` sleeps.** Use fake timers for debounce/animation timing.

8. **Snapshot tests are not a substitute for behavior assertions.** Allowed only for small, stable, pure presentational output; never for whole screens.

9. **Use builder functions when the same fixture/mock shape appears in more than one test.**
   Define a file-scoped `makeX(overrides)` function and call it inside each `it`.

## Standard Pattern

```tsx
function makeOrder(overrides?: Partial<Order>): Order {
  return { id: '1', title: 'Order 1', total: 10, status: 'paid', ...overrides };
}

it('should call onClick with the order id when the card is clicked', async () => {
  const onClick = jest.fn();
  const user = userEvent.setup();
  render(<OrderCard order={makeOrder({ id: '42' })} onClick={onClick} />);

  await user.click(screen.getByRole('button', { name: 'Order 1' }));

  expect(onClick).toHaveBeenCalledWith('42');
});
```

## Why

Tests that interact with the UI the way a user does survive refactors and catch real regressions. Mocking I/O boundaries keeps the suite fast and deterministic on any CI machine.
