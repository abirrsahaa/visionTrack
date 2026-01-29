## 2026-01-29 - Frontend Verification of Protected Routes
**Learning:** `clerkMiddleware` enforces authentication on protected routes (like `/dashboard`) even when `NEXT_PUBLIC_USE_MOCK_DATA=true` is set. This makes automated verification of these routes difficult without valid credentials or temporarily disabling the middleware.
**Action:** When verifying protected routes, consider if middleware modification is safe or if credentials can be provided. If not, rely on unit tests or type checks for low-risk changes.
