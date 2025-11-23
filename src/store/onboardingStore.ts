/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";
import {
  submitCareerGoals,
  submitProfessionalBackground,
  submitMentoringPreferences,
} from "@/utilities/handlers/onboardingHandler";

interface ProfessionalBackground {
  currentRole: string;
  company: string;
  yearsOfExperience: string;
  industries: number[];
  skills: number[];
}

interface CareerGoalsData {
  shortTermGoal: string;
  longTermGoal: string;
}

interface MentoringPreferences {
  frequency: string;
  language: string;
  skills: number[];
  industries: number[];
}

interface OnboardingState {
  // Professional Background (Step 1)
  professionalBackground: ProfessionalBackground;
  updateProfessionalBackground: (data: Partial<ProfessionalBackground>) => void;
  setProfessionalBackground: (data: ProfessionalBackground) => void;
  clearProfessionalBackground: () => void;
  submitProfessionalBackground: () => Promise<void>;

  // Career Goals (Step 2)
  careerGoals: CareerGoalsData;
  updateCareerGoals: (data: Partial<CareerGoalsData>) => void;
  setCareerGoals: (data: CareerGoalsData) => void;
  clearCareerGoals: () => void;
  submitCareerGoals: () => Promise<void>;

  // Mentoring Preferences (Step 3)
  mentoringPreferences: MentoringPreferences;
  updateMentoringPreferences: (data: Partial<MentoringPreferences>) => void;
  setMentoringPreferences: (data: MentoringPreferences) => void;
  clearMentoringPreferences: () => void;
  submitMentoringPreferences: () => Promise<void>;

  // Loading states
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;

  // Common
  clearAllData: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Professional Background (Step 1)
      professionalBackground: {
        currentRole: "",
        company: "",
        yearsOfExperience: "",
        industries: [],
        skills: [],
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
            industries: [],
            skills: [],
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

      // Career Goals (Step 2)
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

      // Mentoring Preferences (Step 3)
      mentoringPreferences: {
        frequency: "",
        language: "",
        skills: [],
        industries: [],
      },

      updateMentoringPreferences: (data) => {
        set((state) => ({
          mentoringPreferences: {
            ...state.mentoringPreferences,
            ...data,
          },
        }));
      },

      setMentoringPreferences: (data) => {
        set({ mentoringPreferences: data });
      },

      clearMentoringPreferences: () => {
        set({
          mentoringPreferences: {
            frequency: "",
            language: "",
            skills: [],
            industries: [],
          },
        });
      },

      submitMentoringPreferences: async () => {
        try {
          set({ isSubmitting: true });
          const { mentoringPreferences } = get();
          const authState = useAuthStore.getState();
          const accessToken = authState.accessToken;

          if (!accessToken) {
            throw new Error("Please log in to continue with onboarding");
          }

          await submitMentoringPreferences(
            { mentoring_preferences: mentoringPreferences },
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
          professionalBackground: {
            currentRole: "",
            company: "",
            yearsOfExperience: "",
            industries: [],
            skills: [],
          },
          careerGoals: {
            shortTermGoal: "",
            longTermGoal: "",
          },
          mentoringPreferences: {
            frequency: "",
            language: "",
            skills: [],
            industries: [],
          },
          isSubmitting: false,
        });
      },
    }),
    {
      name: "onboarding-values",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version < 1) {
          return {
            professionalBackground: {
              currentRole: "",
              company: "",
              yearsOfExperience: "",
              industries: [],
              skills: [],
            },
            careerGoals: {
              shortTermGoal: "",
              longTermGoal: "",
            },
            mentoringPreferences: {
              frequency: "",
              language: "",
              skills: [],
              industries: [],
            },
            isSubmitting: false,
          };
        }
        return persistedState;
      },
    }
  )
);
