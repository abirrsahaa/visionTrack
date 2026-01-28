## 2026-01-28 - React Memoization Dependencies
**Learning:** `React.memo` is ineffective if parent components pass new object/function references on every render. In `DashboardPage`, `domainProgress` Map and `onViewChange` handler were recreated on every render, causing `LifeDomainsPanel` and `VisionBoardWidget` to re-render despite being memoized.
**Action:** Always pair `React.memo` with `useMemo` (for objects/arrays) and `useCallback` (for functions) in the parent component to ensure stable props.
