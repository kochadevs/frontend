// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { middlewareCookieUtils } from "./utilities/cookies";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/onboarding",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check for auth token in cookies
  const isAuthenticated = middlewareCookieUtils.isAuthenticated(request);

  // Handle public routes for authenticated users
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Handle protected routes for unauthenticated users
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
