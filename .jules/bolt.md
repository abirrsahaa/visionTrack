## 2024-05-23 - Performance Optimization of Dashboard
**Learning:** `VisionBoardWidget` and `PixelatedBoard` are expensive components involving canvas operations and animations. They were re-rendering unnecessarily because `DashboardPage` passed new object references (arrays, inline functions) as props on every render.
**Action:** Always ensure stable props (using `useMemo`, `useCallback` or constants) when passing data to expensive components, and wrap those components in `React.memo`.

## 2024-05-23 - Clerk Keyless Mode
**Learning:** The project uses Clerk Keyless Mode for local development (`NEXT_PUBLIC_USE_MOCK_DATA=true` handles API, but Clerk handles Auth). Automated verification of authentication flows is difficult due to Cloudflare CAPTCHAs in Clerk's dev environment.
**Action:** For local verification involving auth, manual testing is preferred over automated scripts if CAPTCHA is involved.
