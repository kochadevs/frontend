// utilities/cookies.ts
export const tokenUtils = {
  // Store tokens in cookies
  storeTokens(accessToken: string, refreshToken: string) {
    try {
      // Set access token cookie (7 days)
      document.cookie = `access-token=${accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; secure; samesite=lax`;

      // Set refresh token cookie (7 days)
      document.cookie = `refresh-token=${refreshToken}; path=/; max-age=${
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
      if (name === "access-token") accessToken = value;
      if (name === "refresh-token") refreshToken = value;
    });

    return { accessToken, refreshToken };
  },

  // Clear tokens from cookies
  clearTokens() {
    document.cookie = "access-token=; path=/; max-age=0";
    document.cookie = "refresh-token=; path=/; max-age=0";
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
    return cookieHeader?.includes("access-token=") || false;
  },

  getTokens(request: Request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";");
    let accessToken = null;
    let refreshToken = null;

    cookies.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name === "access-token") accessToken = value;
      if (name === "refresh-token") refreshToken = value;
    });

    return { accessToken, refreshToken };
  },
};
