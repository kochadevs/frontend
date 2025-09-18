import { cookies } from "next/headers";
import { COOKIE_NAMES } from "./cookies";

// Server-side cookie utilities (only for server components)
export const serverCookieUtils = {
  // Get cookie from server
  get: async (name: string): Promise<string | null> => {
    try {
      const cookieStore = await cookies();
      const cookie = cookieStore.get(name);
      return cookie?.value || null;
    } catch (error) {
      console.error("Error reading server cookie:", error);
      return null;
    }
  },

  // Get all auth cookies from server
  getAuthData: async () => {
    return {
      accessToken: await serverCookieUtils.get(COOKIE_NAMES.ACCESS_TOKEN),
      refreshToken: await serverCookieUtils.get(COOKIE_NAMES.REFRESH_TOKEN),
      userData: await serverCookieUtils.get(COOKIE_NAMES.USER_DATA),
    };
  },

  // Check if user is authenticated from server cookies
  isAuthenticated: async (): Promise<boolean> => {
    const accessToken = await serverCookieUtils.get(COOKIE_NAMES.ACCESS_TOKEN);
    const refreshToken = await serverCookieUtils.get(COOKIE_NAMES.REFRESH_TOKEN);
    return !!(accessToken && refreshToken);
  },
};