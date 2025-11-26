import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse } from "../interface/auth/login";
import { tokenUtils } from "../utilities/cookies";

interface AuthStore {
  // State
  authData: LoginResponse | null;
  _hasHydrated: boolean;

  // Actions
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<LoginResponse["user_profile"]>) => void;
  setHasHydrated: (state: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      authData: null,
      _hasHydrated: false,

      // Login - store full data in localStorage, tokens in cookies
      login: (loginResponse: LoginResponse) => {
        const { access_token, refresh_token } = loginResponse;

        // Store tokens in cookies
        tokenUtils.storeTokens(access_token, refresh_token);

        // Store full auth data in localStorage (via Zustand persist)
        set({ authData: loginResponse });
      },

      // Logout - clear everything
      logout: () => {
        // Clear cookies
        tokenUtils.clearTokens();

        // Clear localStorage
        set({ authData: null });
      },

      // Update user - simple merge
      updateUser: (updatedUser: Partial<LoginResponse["user_profile"]>) => {
        const currentState = get();
        if (currentState.authData?.user_profile) {
          set({
            authData: {
              ...currentState.authData,
              user_profile: {
                ...currentState.authData.user_profile,
                ...updatedUser,
              },
            },
          });
        }
      },

      // Set hydration state
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      // Initialize auth - sync cookies with localStorage
      initializeAuth: () => {
        const currentState = get();

        // If we have auth data in localStorage but no cookies, restore cookies
        if (
          currentState.authData?.access_token &&
          currentState.authData?.refresh_token
        ) {
          const { accessToken, refreshToken } = tokenUtils.getTokens();

          if (!accessToken || !refreshToken) {
            // Restore tokens to cookies
            tokenUtils.storeTokens(
              currentState.authData.access_token,
              currentState.authData.refresh_token
            );
            console.log("Restored tokens to cookies");
          }
        }

        // If we have cookies but no localStorage data, we might want to fetch user data
        // This handles the case where only cookies exist (from previous session)
        const { accessToken, refreshToken } = tokenUtils.getTokens();
        if ((accessToken || refreshToken) && !currentState.authData) {
          console.log("Tokens found in cookies but no auth data in store");
          // You might want to fetch user profile here if needed
        }

        // Mark as hydrated
        set({ _hasHydrated: true });
      },
    }),
    {
      name: "kocha-auth-storage",
      onRehydrateStorage: () => () => {
        console.log("Store rehydrated from localStorage");
      },
      partialize: (state) => ({
        authData: state.authData,
      }),
    }
  )
);

// Hook to check if store has hydrated
export const useAuthHydration = () => {
  return useAuthStore((state) => state._hasHydrated);
};

// Simple hooks with hydration check
export const useAuth = () => {
  const authData = useAuthStore((state) => state.authData);
  const hasHydrated = useAuthHydration();

  return {
    isAuthenticated: !!authData?.access_token && hasHydrated,
    user: authData?.user_profile || null,
    accessToken: authData?.access_token || null,
    refreshToken: authData?.refresh_token || null,
    authData,
    hasHydrated,
  };
};

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  return { login, logout, updateUser, initializeAuth };
};

export const useIsAuthenticated = () => {
  const authData = useAuthStore((state) => state.authData);
  const hasHydrated = useAuthHydration();
  return !!authData?.access_token && hasHydrated;
};

export const useUser = () => {
  const authData = useAuthStore((state) => state.authData);
  const hasHydrated = useAuthHydration();
  return hasHydrated ? authData?.user_profile || null : null;
};

export const useAccessToken = () => {
  const authData = useAuthStore((state) => state.authData);
  const hasHydrated = useAuthHydration();
  return hasHydrated ? authData?.access_token || null : null;
};
