/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";
import {
  submitNewRoleValues,
  submitJobSearchStatus,
  submitRoleInterest,
  submitIndustries,
  submitSkills,
  submitCareerGoals,
  submitProfessionalBackground,
} from "@/utilities/handlers/onboardingHandler";

interface ProfessionalBackground {
  currentRole: string;
  company: string;
  yearsOfExperience: string;
}

interface CareerGoalsData {
  shortTermGoal: string;
  longTermGoal: string;
}

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

  // Career Goals (Step 6) - UPDATED
  careerGoals: CareerGoalsData;
  updateCareerGoals: (data: Partial<CareerGoalsData>) => void;
  setCareerGoals: (data: CareerGoalsData) => void;
  clearCareerGoals: () => void;
  submitCareerGoals: () => Promise<void>;

  // Professional Background (Step)
  professionalBackground: ProfessionalBackground;
  updateProfessionalBackground: (data: Partial<ProfessionalBackground>) => void;
  setProfessionalBackground: (data: ProfessionalBackground) => void;
  clearProfessionalBackground: () => void;
  submitProfessionalBackground: () => Promise<void>;

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
            return {
              selectedValues: state.selectedValues.filter((v) => v !== id),
            };
          }

          if (state.selectedValues.length >= 3) {
            return state;
          }

          return {
            selectedValues: [...state.selectedValues, id],
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
            : [...state.jobSearchStatus, id],
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
              selectedRoles: state.selectedRoles.filter((v) => v !== id),
            };
          }
          if (state.selectedRoles.length >= 5) {
            return state;
          }
          return {
            selectedRoles: [...state.selectedRoles, id],
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
            : [...state.selectedIndustries, industry],
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
            : [...state.selectedSkills, skill],
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

          await submitSkills({ skills: selectedSkills }, accessToken);
        } finally {
          set({ isSubmitting: false });
        }
      },

      // Career Goals (Step 6) - UPDATED IMPLEMENTATION
      careerGoals: {
        shortTermGoal: "",
        longTermGoal: "",
      },

      updateCareerGoals: (data) => {
        set((state) => ({
          careerGoals: {
            ...state.careerGoals,
            ...data,
          },
        }));
      },

      setCareerGoals: (data) => {
        set({ careerGoals: data });
      },

      clearCareerGoals: () => {
        set({
          careerGoals: {
            shortTermGoal: "",
            longTermGoal: "",
          },
        });
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

          await submitCareerGoals({ career_goals: careerGoals }, accessToken);
        } finally {
          set({ isSubmitting: false });
        }
      },

      // Professional Background (Step)
      professionalBackground: {
        currentRole: "",
        company: "",
        yearsOfExperience: "",
      },

      updateProfessionalBackground: (data) => {
        set((state) => ({
          professionalBackground: {
            ...state.professionalBackground,
            ...data,
          },
        }));
      },

      setProfessionalBackground: (data) => {
        set({ professionalBackground: data });
      },

      clearProfessionalBackground: () => {
        set({
          professionalBackground: {
            currentRole: "",
            company: "",
            yearsOfExperience: "",
          },
        });
      },

      submitProfessionalBackground: async () => {
        try {
          set({ isSubmitting: true });
          const { professionalBackground } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;

          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }

          await submitProfessionalBackground(
            { professional_background: professionalBackground },
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
          careerGoals: {
            shortTermGoal: "",
            longTermGoal: "",
          },
          professionalBackground: {
            currentRole: "",
            company: "",
            yearsOfExperience: "",
          },
          isSubmitting: false,
        });
      },
    }),
    {
      name: "onboarding-values",
      version: 3, // Increment version for career goals change
      migrate: (persistedState: any, version: number) => {
        if (version < 3) {
          // Migrate to include new career goals structure
          return {
            ...persistedState,
            careerGoals: {
              shortTermGoal: "",
              longTermGoal: "",
            },
          };
        }
        return persistedState;
      },
    }
  )
);
