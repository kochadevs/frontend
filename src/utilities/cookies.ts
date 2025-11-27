// utilities/cookies.ts

// Add this constant at the top of your file
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access-token",
  REFRESH_TOKEN: "refresh-token",
  USER_DATA: "user-data",
} as const;

export const tokenUtils = {
  // Store tokens in cookies
  storeTokens(accessToken: string, refreshToken: string) {
    try {
      // Set access token cookie (7 days)
      document.cookie = `${
        COOKIE_NAMES.ACCESS_TOKEN
      }=${accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; secure; samesite=lax`;

      // Set refresh token cookie (7 days)
      document.cookie = `${
        COOKIE_NAMES.REFRESH_TOKEN
      }=${refreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; secure; samesite=lax`;
    } catch (error) {
      console.error("Error storing tokens in cookies:", error);
    }
  },

  // Get tokens from cookies
  getTokens() {
    const cookies = document.cookie.split(";");
    let accessToken = null;
    let refreshToken = null;

    cookies.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name === COOKIE_NAMES.ACCESS_TOKEN) accessToken = value;
      if (name === COOKIE_NAMES.REFRESH_TOKEN) refreshToken = value;
    });

    return { accessToken, refreshToken };
  },

  // Clear tokens from cookies
  clearTokens() {
    document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=; path=/; max-age=0`;
    document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=; path=/; max-age=0`;
  },

  // Check if user is authenticated (for middleware)
  isAuthenticated() {
    return !!this.getTokens().accessToken;
  },
};

// For middleware usage
export const middlewareCookieUtils = {
  isAuthenticated(request: Request) {
    const cookieHeader = request.headers.get("cookie");
    return cookieHeader?.includes(`${COOKIE_NAMES.ACCESS_TOKEN}=`) || false;
  },

  getTokens(request: Request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";");
    let accessToken = null;
    let refreshToken = null;

    cookies.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name === COOKIE_NAMES.ACCESS_TOKEN) accessToken = value;
      if (name === COOKIE_NAMES.REFRESH_TOKEN) refreshToken = value;
    });

    return { accessToken, refreshToken };
  },
};
