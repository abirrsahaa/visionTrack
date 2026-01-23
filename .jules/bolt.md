## 2026-01-23 - Dashboard Re-renders
**Learning:** The `DashboardPage` was re-rendering heavy sub-components like `LifeDomainsPanel` on every state change because of inline function handlers and un-memoized derived data.
**Action:** Use `React.memo` for list components and `useMemo`/`useCallback` for derived data and handlers passed to them.
