// @/utilities/authUtils.ts
import { tokenUtils } from "@/utilities/cookies";
import { UserProfile } from "@/interface/auth/login";

interface AuthTokenResult {
  token: string | null;
  isReady: boolean;
  error?: string;
  user?: UserProfile | null;
}

/**
 * Utility to check if auth store is hydrated and get access token
 * This ensures we don't make API calls before the store is ready
 */
export const getAuthData = (
  accessToken: string | null,
  user: UserProfile | null | undefined
): AuthTokenResult => {
  // First check if we have a token from the store (hydration complete)
  const token = accessToken || tokenUtils.getTokens().accessToken;

  if (token) {
    return {
      token,
      isReady: true,
      user: user || null,
    };
  }

  // No token available
  return {
    token: null,
    isReady: true, // Store is ready, just no auth
    error: "Authentication required. Please sign in.",
    user: user || null,
  };
};

/**
 * Utility to wait for auth store hydration including user data
 * Useful when you need to ensure store is fully hydrated before making API calls
 */
export const waitForAuthHydration = async (
  accessToken: string | null,
  user: UserProfile | null | undefined,
  maxWaitTime = 5000,
  checkInterval = 100
): Promise<AuthTokenResult> => {
  const startTime = Date.now();

  // Wait for either token or user data to be available
  while (Date.now() - startTime < maxWaitTime) {
    const token = accessToken || tokenUtils.getTokens().accessToken;

    // Check if we have a token AND user data is loaded (even if null)
    if (token !== undefined && user !== undefined) {
      return {
        token: token || null,
        isReady: true,
        user: user || null,
      };
    }

    // Wait before checking again
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  return {
    token: null,
    isReady: false,
    error:
      "Authentication store took too long to hydrate. Please refresh the page.",
    user: user || null,
  };
};
