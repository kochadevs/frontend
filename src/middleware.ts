import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check for auth token in cookies (simple check)
  const hasAuthToken = request.cookies.get("auth-token")?.value;

  // Redirect authenticated users away from public routes
  if (isPublicRoute && hasAuthToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isPublicRoute && !hasAuthToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
