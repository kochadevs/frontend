import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";
import { submitNewRoleValues, submitJobSearchStatus, submitRoleInterest, submitIndustries, submitSkills, submitCareerGoals } from "@/utilities/handlers/onboardingHandler";

interface OnboardingState {
  // Value Selection (Step 1)
  selectedValues: number[];
  toggleValue: (id: number) => void;
  setSelectedValues: (values: number[]) => void;
  clearSelectedValues: () => void;
  submitNewRoleValues: () => Promise<void>;
  
  // Job Search Status (Step 2)
  jobSearchStatus: number[];
  toggleJobSearchStatus: (id: number) => void;
  setJobSearchStatus: (status: number[]) => void;
  clearJobSearchStatus: () => void;
  submitJobSearchStatus: () => Promise<void>;

  // Role Selection (Step 3)
  selectedRoles: number[];
  toggleRole: (id: number) => void;
  setSelectedRoles: (roles: number[]) => void;
  clearSelectedRoles: () => void;
  submitRoleInterest: () => Promise<void>;

  // Industry Selection (Step 4)
  selectedIndustries: number[];
  toggleIndustry: (industry: number) => void;
  setSelectedIndustries: (industries: number[]) => void;
  clearSelectedIndustries: () => void;
  submitIndustries: () => Promise<void>;

  // Skills Selection (Step 5)
  selectedSkills: number[];
  toggleSkill: (skill: number) => void;
  setSelectedSkills: (skills: number[]) => void;
  clearSelectedSkills: () => void;
  submitSkills: () => Promise<void>;

  // Career Goals (Step 6)
  careerGoals: number[];
  toggleCareerGoal: (goal: number) => void;
  setCareerGoals: (goals: number[]) => void;
  clearCareerGoals: () => void;
  submitCareerGoals: () => Promise<void>;
  
  // Loading states
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  
  // Common
  clearAllData: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Value Selection (Step 1)
      selectedValues: [],
      
      toggleValue: (id) => {
        set((state) => {
          if (state.selectedValues.includes(id)) {
            // Remove the value if already selected
            return {
              selectedValues: state.selectedValues.filter((v) => v !== id)
            };
          }
          
          // Check if we've reached the limit
          if (state.selectedValues.length >= 3) {
            return state;
          }
          
          // Add the new value
          return {
            selectedValues: [...state.selectedValues, id]
          };
        });
      },
      
      setSelectedValues: (values) => {
        set({ selectedValues: values });
      },
      
      clearSelectedValues: () => {
        set({ selectedValues: [] });
      },
      
      submitNewRoleValues: async () => {
        try {
          set({ isSubmitting: true });
          const { selectedValues } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;
          
          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }
          await submitNewRoleValues(
            { new_role_values: selectedValues },
            accessToken
          );
        } finally {
          set({ isSubmitting: false });
        }
      },
      
      // Job Search Status (Step 2)
      jobSearchStatus: [],
      
      toggleJobSearchStatus: (id) => {
        set((state) => ({
          jobSearchStatus: state.jobSearchStatus.includes(id)
            ? state.jobSearchStatus.filter((v) => v !== id)
            : [...state.jobSearchStatus, id]
        }));
      },
      
      setJobSearchStatus: (status) => {
        set({ jobSearchStatus: status });
      },
      
      clearJobSearchStatus: () => {
        set({ jobSearchStatus: [] });
      },
      
      submitJobSearchStatus: async () => {
        try {
          set({ isSubmitting: true });
          const { jobSearchStatus } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;
          
          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }
          
          await submitJobSearchStatus(
            { job_search_status: jobSearchStatus },
            accessToken
          );
        } finally {
          set({ isSubmitting: false });
        }
      },

      // Role Selection (Step 3)
      selectedRoles: [],
      
      toggleRole: (id) => {
        set((state) => {
          if (state.selectedRoles.includes(id)) {
            return {
              selectedRoles: state.selectedRoles.filter((v) => v !== id)
            };
          }
          if (state.selectedRoles.length >= 5) {
            return state;
          }
          return {
            selectedRoles: [...state.selectedRoles, id]
          };
        });
      },
      
      setSelectedRoles: (roles) => {
        set({ selectedRoles: roles });
      },
      
      clearSelectedRoles: () => {
        set({ selectedRoles: [] });
      },
      
      submitRoleInterest: async () => {
        try {
          set({ isSubmitting: true });
          const { selectedRoles } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;
          
          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }
          
          await submitRoleInterest(
            { roles_of_interest: selectedRoles },
            accessToken
          );
        } finally {
          set({ isSubmitting: false });
        }
      },
      
      // Industry Selection (Step 4)
      selectedIndustries: [],
      
      toggleIndustry: (industry) => {
        set((state) => ({
          selectedIndustries: state.selectedIndustries.includes(industry)
            ? state.selectedIndustries.filter((i) => i !== industry)
            : [...state.selectedIndustries, industry]
        }));
      },
      
      setSelectedIndustries: (industries) => {
        set({ selectedIndustries: industries });
      },
      
      clearSelectedIndustries: () => {
        set({ selectedIndustries: [] });
      },
      
      submitIndustries: async () => {
        try {
          set({ isSubmitting: true });
          const { selectedIndustries } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;
          
          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }
          
          await submitIndustries(
            { industries: selectedIndustries },
            accessToken
          );
        } finally {
          set({ isSubmitting: false });
        }
      },

      // Skills Selection (Step 5)
      selectedSkills: [],
      
      toggleSkill: (skill) => {
        set((state) => ({
          selectedSkills: state.selectedSkills.includes(skill)
            ? state.selectedSkills.filter((s) => s !== skill)
            : [...state.selectedSkills, skill]
        }));
      },
      
      setSelectedSkills: (skills) => {
        set({ selectedSkills: skills });
      },
      
      clearSelectedSkills: () => {
        set({ selectedSkills: [] });
      },
      
      submitSkills: async () => {
        try {
          set({ isSubmitting: true });
          const { selectedSkills } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;
          
          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }
          
          await submitSkills(
            { skills: selectedSkills },
            accessToken
          );
        } finally {
          set({ isSubmitting: false });
        }
      },

      // Career Goals (Step 6)
      careerGoals: [],
      
      toggleCareerGoal: (goal) => {
        set((state) => ({
          careerGoals: state.careerGoals.includes(goal)
            ? state.careerGoals.filter((g) => g !== goal)
            : [...state.careerGoals, goal]
        }));
      },
      
      setCareerGoals: (goals) => {
        set({ careerGoals: goals });
      },
      
      clearCareerGoals: () => {
        set({ careerGoals: [] });
      },
      
      submitCareerGoals: async () => {
        try {
          set({ isSubmitting: true });
          const { careerGoals } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;
          
          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }
          
          await submitCareerGoals(
            { career_goals: careerGoals },
            accessToken
          );
        } finally {
          set({ isSubmitting: false });
        }
      },
      
      // Loading states
      isSubmitting: false,
      setIsSubmitting: (isSubmitting) => {
        set({ isSubmitting });
      },
      
      // Common
      clearAllData: () => {
        set({
          selectedValues: [],
          jobSearchStatus: [],
          selectedRoles: [],
          selectedIndustries: [],
          selectedSkills: [],
          careerGoals: [],
          isSubmitting: false,
        });
      },
    }),
    {
      name: "onboarding-values",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 1) {
          // Clear old data and start fresh
          return {
            selectedValues: [],
            jobSearchStatus: [],
            selectedRoles: [],
            selectedIndustries: [],
            selectedSkills: [],
            careerGoals: [],
            isSubmitting: false,
          };
        }
        return persistedState;
      },
    }
  )
);
