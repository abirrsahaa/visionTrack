import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth token in cookies (primary) or headers
  const accessToken = request.cookies.get("accessToken")?.value || 
                     request.headers.get("authorization")?.replace("Bearer ", "");

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/onboarding"];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/onboarding");

  // Protected routes
  const isProtectedRoute = pathname.startsWith("/dashboard") ||
                           pathname.startsWith("/domains") ||
                           pathname.startsWith("/journal") ||
                           pathname.startsWith("/tasks") ||
                           pathname.startsWith("/timeline") ||
                           pathname.startsWith("/settings") ||
                           pathname.startsWith("/boards");

  // If accessing a protected route without auth, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/login") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth pages while authenticated, redirect to dashboard
  // (This will be handled client-side in mock mode since middleware can't see localStorage)
  if ((pathname === "/login" || pathname === "/signup") && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};