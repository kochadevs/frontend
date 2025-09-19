import { UserProfile } from "../interface/auth/login";

/**
 * Determines the appropriate redirect URL based on user's role values
 * @param user - The user profile object
 * @param requestedPath - The path the user was trying to access (optional)
 * @returns The appropriate redirect path
 */
export const getRedirectPath = (user: UserProfile | null, requestedPath = "/home"): string => {
  if (!user) {
    return "/login";
  }

  // If user has no role values, they need to complete onboarding
  if (user.new_role_values === null) {
    return "/onboarding";
  }

  // If user has role values, they can access the requested path or go to home
  return requestedPath === "/onboarding" ? "/home" : requestedPath;
};

/**
 * Checks if a user needs to complete onboarding
 * @param user - The user profile object
 * @returns boolean indicating if onboarding is required
 */
export const requiresOnboarding = (user: UserProfile | null): boolean => {
  return user !== null && user.new_role_values === null;
};

/**
 * Checks if a user has completed onboarding
 * @param user - The user profile object
 * @returns boolean indicating if onboarding is completed
 */
export const hasCompletedOnboarding = (user: UserProfile | null): boolean => {
  return user !== null && user.new_role_values !== null;
};