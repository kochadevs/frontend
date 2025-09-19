import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { middlewareCookieUtils } from "./utilities/cookies";
import { getRedirectPath, requiresOnboarding, hasCompletedOnboarding } from "./utilities/redirectUtils";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthenticated = middlewareCookieUtils.isAuthenticated(request);

  const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Helper function to get user data and check role values
  const getUserRoleStatus = () => {
    try {
      const authData = middlewareCookieUtils.getAuthData(request);
      if (authData.userData) {
        const user = JSON.parse(authData.userData);
        return {
          hasRoleValues: user.new_role_values !== null,
          user
        };
      }
    } catch (error) {
      console.error("Error parsing user data in middleware:", error);
    }
    return { hasRoleValues: false, user: null };
  };

  if (isPublicRoute && isAuthenticated) {
    const { user } = getUserRoleStatus();
    // Redirect authenticated users to appropriate page using utility function
    const redirectUrl = getRedirectPath(user, "/home");
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Handle authenticated users accessing protected routes
  if (!isPublicRoute && isAuthenticated) {
    const { user } = getUserRoleStatus();
    
    // If user doesn't have role values and is trying to access pages other than onboarding
    if (requiresOnboarding(user) && !pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    
    // If user has role values and is trying to access onboarding, redirect to home
    if (hasCompletedOnboarding(user) && pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|asset).*)",
  ],
};
