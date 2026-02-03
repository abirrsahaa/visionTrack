# Bolt's Performance Journal

## 2024-05-22 - Dashboard Re-render Optimization
**Learning:** React components using `useEffect` for canvas animations (like `PixelatedBoard`) are extremely sensitive to re-renders. If the parent component re-renders and passes new object references (even if data is identical), the `useEffect` cleanup runs, causing the canvas to flash or reset its animation.
**Action:** Always memoize parent components (`VisionBoardWidget`) and ensure their props (handlers, derived data like `domainProgress` Map) are referentially stable using `useCallback` and `useMemo` to prevent cascading re-renders that disrupt visual state.
