import { NextRequest } from "next/server";

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;

// Client-side cookie utilities
export const cookieUtils = {
  // Set a cookie
  set: (name: string, value: string, days: number = 30) => {
    if (typeof window !== "undefined") {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
    }
  },

  // Get a cookie
  get: (name: string): string | null => {
    if (typeof window !== "undefined") {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  },

  // Remove a cookie
  remove: (name: string) => {
    if (typeof window !== "undefined") {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  },

  // Clear all auth cookies
  clearAuth: () => {
    cookieUtils.remove(COOKIE_NAMES.ACCESS_TOKEN);
    cookieUtils.remove(COOKIE_NAMES.REFRESH_TOKEN);
    cookieUtils.remove(COOKIE_NAMES.USER_DATA);
  },
};


// Middleware-specific cookie utilities (for NextRequest)
export const middlewareCookieUtils = {
  // Get cookie from middleware request
  get: (request: NextRequest, name: string): string | null => {
    try {
      const cookie = request.cookies.get(name);
      return cookie?.value || null;
    } catch (error) {
      console.error("Error reading middleware cookie:", error);
      return null;
    }
  },

  // Get all auth cookies from middleware request
  getAuthData: (request: NextRequest) => {
    return {
      accessToken: middlewareCookieUtils.get(
        request,
        COOKIE_NAMES.ACCESS_TOKEN
      ),
      refreshToken: middlewareCookieUtils.get(
        request,
        COOKIE_NAMES.REFRESH_TOKEN
      ),
      userData: middlewareCookieUtils.get(request, COOKIE_NAMES.USER_DATA),
    };
  },

  // Check if user is authenticated from request
  isAuthenticated: (request: NextRequest): boolean => {
    const accessToken = middlewareCookieUtils.get(
      request,
      COOKIE_NAMES.ACCESS_TOKEN
    );
    const refreshToken = middlewareCookieUtils.get(
      request,
      COOKIE_NAMES.REFRESH_TOKEN
    );
    return !!(accessToken && refreshToken);
  },
};

// Token utilities
export const tokenUtils = {
  // Store auth tokens
  storeTokens: (
    accessToken: string,
    refreshToken: string,
    userData: string
  ) => {
    cookieUtils.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, 30); // 30 days
    cookieUtils.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, 60); // 60 days
    cookieUtils.set(COOKIE_NAMES.USER_DATA, userData, 30); // 30 days
  },

  // Get stored tokens
  getTokens: () => {
    return {
      accessToken: cookieUtils.get(COOKIE_NAMES.ACCESS_TOKEN),
      refreshToken: cookieUtils.get(COOKIE_NAMES.REFRESH_TOKEN),
      userData: cookieUtils.get(COOKIE_NAMES.USER_DATA),
    };
  },

  // Clear stored tokens
  clearTokens: () => {
    cookieUtils.clearAuth();
  },

  // Check if user is authenticated (has valid access token)
  isAuthenticated: (): boolean => {
    const accessToken = cookieUtils.get(COOKIE_NAMES.ACCESS_TOKEN);
    return !!accessToken;
  },
};
