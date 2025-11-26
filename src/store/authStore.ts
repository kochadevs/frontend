import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse } from "../interface/auth/login";

interface AuthStore {
  // State
  authData: LoginResponse | null;
  _hasHydrated: boolean; // Track if store has been hydrated from localStorage

  // Actions
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<LoginResponse["user_profile"]>) => void;
  setHasHydrated: (state: boolean) => void;
  initializeAuth: () => void; // Add this back to fix the error
}

// Simple store that just persists the login response
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      authData: null,
      _hasHydrated: false,

      // Login - just store the response
      login: (loginResponse: LoginResponse) => {
        set({ authData: loginResponse });
      },

      // Logout - clear everything
      logout: () => {
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

      // Initialize auth (empty function for compatibility)
      initializeAuth: () => {
        // This is now handled automatically by Zustand's persistence
        // Keeping it for backward compatibility
        console.log("Auth initialization handled automatically by Zustand");
      },
    }),
    {
      name: "kocha-auth-storage", // localStorage key
      onRehydrateStorage: () => (state) => {
        // This runs after Zustand rehydrates from localStorage
        state?.setHasHydrated(true);
      },
      // Only persist authData, not the hydration flag
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
    authData, // Full auth data if needed
    hasHydrated, // Useful for conditional rendering
  };
};

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  return { login, logout, updateUser, initializeAuth };
};

// Individual selectors with hydration check
export const useIsAuthenticated = () => {
  const authData = useAuthStore((state) => state.authData);
  const hasHydrated = useAuthHydration();
  return !!authData?.access_token && hasHydrated;
};

export const useUser = () => {
  const authData = useAuthStore((state) => state.authData);
  const hasHydrated = useAuthHydration();
  // Return null if not hydrated to avoid flash of incorrect state
  return hasHydrated ? authData?.user_profile || null : null;
};

export const useAccessToken = () => {
  const authData = useAuthStore((state) => state.authData);
  const hasHydrated = useAuthHydration();
  return hasHydrated ? authData?.access_token || null : null;
};
