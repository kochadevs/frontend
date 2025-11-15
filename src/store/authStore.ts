import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthState, UserProfile, LoginResponse } from "../interface/auth/login";
import { tokenUtils } from "../utilities/cookies";
import {
  handleLogout,
  fetchUserProfile,
} from "../utilities/handlers/authHandler";

interface AuthActions {
  // Actions
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
  refreshUserProfile: () => Promise<void>;
  initializeAuth: () => void;
  refreshAuth: (newAccessToken: string) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenType: "Bearer",
};

// Create store with persist middleware
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Login action
        login: (loginResponse: LoginResponse) => {
          const { access_token, refresh_token, token_type, user_profile } =
            loginResponse;

          // Store tokens in cookies
          tokenUtils.storeTokens(
            access_token,
            refresh_token,
            JSON.stringify(user_profile)
          );

          // Update store state
          set({
            isAuthenticated: true,
            user: user_profile,
            accessToken: access_token,
            refreshToken: refresh_token,
            tokenType: token_type,
          });
        },

        // Logout action
        logout: async () => {
          const currentState = get();

          // Call logout API if we have an access token
          if (currentState.accessToken) {
            try {
              await handleLogout(currentState.accessToken);
            } catch (error) {
              console.error("Logout API error:", error);
              // Continue with local logout even if API fails
            }
          }

          // Clear cookies
          tokenUtils.clearTokens();

          // Reset store state
          set({ ...initialState });
        },

        // Update user profile
        updateUser: (updatedUser: Partial<UserProfile>) => {
          const currentState = get();
          const currentUser = currentState.user;

          if (currentUser) {
            const newUser = { ...currentUser, ...updatedUser };

            // Update user data in cookies
            if (currentState.accessToken && currentState.refreshToken) {
              tokenUtils.storeTokens(
                currentState.accessToken,
                currentState.refreshToken,
                JSON.stringify(newUser)
              );
            }

            set({ user: newUser });
          }
        },

        // Refresh user profile from API
        refreshUserProfile: async () => {
          const currentState = get();

          if (!currentState.accessToken) {
            throw new Error("No access token available");
          }

          try {
            const updatedUser = await fetchUserProfile(
              currentState.accessToken
            );

            // Update user data in cookies
            if (currentState.refreshToken) {
              tokenUtils.storeTokens(
                currentState.accessToken,
                currentState.refreshToken,
                JSON.stringify(updatedUser)
              );
            }

            set({ user: updatedUser });
          } catch (error) {
            console.error("Error refreshing user profile:", error);
            throw error;
          }
        },

        // Initialize auth from cookies
        initializeAuth: () => {
          const currentState = get();

          // Only run in browser
          if (typeof window === "undefined") {
            return;
          }

          const { accessToken, refreshToken, userData } =
            tokenUtils.getTokens();

          // If we have tokens but store is not authenticated, update the store
          if (accessToken && refreshToken && userData) {
            try {
              const user = JSON.parse(userData);
              set({
                isAuthenticated: true,
                user,
                accessToken,
                refreshToken,
                tokenType: "Bearer",
              });
            } catch {
              tokenUtils.clearTokens();
              set({ ...initialState });
            }
          } else if (currentState.isAuthenticated && !accessToken) {
            // If store thinks we're authenticated but no tokens in cookies, clear store
            set({ ...initialState });
          }
        },

        // Refresh access token
        refreshAuth: (newAccessToken: string) => {
          const currentState = get();

          if (currentState.refreshToken && currentState.user) {
            tokenUtils.storeTokens(
              newAccessToken,
              currentState.refreshToken,
              JSON.stringify(currentState.user)
            );

            set({ accessToken: newAccessToken });
          }
        },
      }),
      {
        name: "kocha-auth-storage",
        partialize: (state) => ({
          // Only persist user data and auth status, not tokens
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          tokenType: state.tokenType,
        }),
        // Handle hydration properly
        onRehydrateStorage: () => (state) => {
          // Initialize auth from cookies after rehydration
          if (state && typeof window !== "undefined") {
            state.initializeAuth?.();
          }
        },
      }
    ),
    { name: "authStore" }
  )
);

// Hook to get auth state
export const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return { isAuthenticated, user, accessToken, refreshToken };
};

// Hook to get auth actions
export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const refreshUserProfile = useAuthStore((state) => state.refreshUserProfile);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const refreshAuth = useAuthStore((state) => state.refreshAuth);

  return {
    login,
    logout,
    updateUser,
    refreshUserProfile,
    initializeAuth,
    refreshAuth,
  };
};

// Individual selectors
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
