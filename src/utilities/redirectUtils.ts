/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // If user needs to complete onboarding, redirect to onboarding page
  if (requiresOnboarding(user)) {
    return "/onboarding";
  }

  // If user has completed onboarding, they can access the requested path or go to home
  return requestedPath === "/onboarding" ? "/home" : requestedPath;
};

/**
 * Checks if a user needs to complete onboarding
 * Checks if any of the required onboarding fields are null or empty arrays
 * @param user - The user profile object
 * @returns boolean indicating if onboarding is required
 */
export const requiresOnboarding = (user: UserProfile | null): boolean => {
  if (!user) {
    return false;
  }

  // Check if any required onboarding field is null or empty
  const isFieldIncomplete = (field: unknown[] | null): boolean => {
    return field === null || (Array.isArray(field) && field.length === 0);
  };

  return (
    isFieldIncomplete(user.new_role_values) ||
    isFieldIncomplete(user.industry) ||
    isFieldIncomplete(user.job_search_status) ||
    isFieldIncomplete(user.role_of_interest) ||
    isFieldIncomplete(user.skills) ||
    isFieldIncomplete(user.career_goals)
  );
};

/**
 * Checks if a user has completed onboarding
 * Checks that all required onboarding fields have values (not null and not empty)
 * @param user - The user profile object
 * @returns boolean indicating if onboarding is completed
 */
export const hasCompletedOnboarding = (user: UserProfile | null): boolean => {
  if (!user) {
    return false;
  }

  // Check if all required onboarding fields have values
  const isFieldComplete = (field: unknown[] | null): boolean => {
    return field !== null && Array.isArray(field) && field.length > 0;
  };

  return (
    isFieldComplete(user.new_role_values) &&
    isFieldComplete(user.industry) &&
    isFieldComplete(user.job_search_status) &&
    isFieldComplete(user.role_of_interest) &&
    isFieldComplete(user.skills) &&
    isFieldComplete(user.career_goals)
  );
};
