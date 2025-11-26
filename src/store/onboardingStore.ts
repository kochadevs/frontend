/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  // Get all onboarding data
  getAllOnboardingData: () => {
    professionalBackground: ProfessionalBackground;
    careerGoals: CareerGoalsData;
    mentoringPreferences: MentoringPreferences;
  };
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
        // Simply resolve the promise - data is already stored in state
        console.log(
          "Professional background stored locally:",
          get().professionalBackground
        );
        return Promise.resolve();
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
        // Simply resolve the promise - data is already stored in state
        console.log("Career goals stored locally:", get().careerGoals);
        return Promise.resolve();
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
        // Simply resolve the promise - data is already stored in state
        console.log(
          "Mentoring preferences stored locally:",
          get().mentoringPreferences
        );
        return Promise.resolve();
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

      // Get all onboarding data
      getAllOnboardingData: () => {
        const state = get();
        return {
          professionalBackground: state.professionalBackground,
          careerGoals: state.careerGoals,
          mentoringPreferences: state.mentoringPreferences,
        };
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

// Convenience hooks for individual sections
export const useProfessionalBackground = () => {
  const professionalBackground = useOnboardingStore(
    (state) => state.professionalBackground
  );
  const updateProfessionalBackground = useOnboardingStore(
    (state) => state.updateProfessionalBackground
  );
  const setProfessionalBackground = useOnboardingStore(
    (state) => state.setProfessionalBackground
  );
  const clearProfessionalBackground = useOnboardingStore(
    (state) => state.clearProfessionalBackground
  );
  const submitProfessionalBackground = useOnboardingStore(
    (state) => state.submitProfessionalBackground
  );

  return {
    professionalBackground,
    updateProfessionalBackground,
    setProfessionalBackground,
    clearProfessionalBackground,
    submitProfessionalBackground,
  };
};

export const useCareerGoals = () => {
  const careerGoals = useOnboardingStore((state) => state.careerGoals);
  const updateCareerGoals = useOnboardingStore(
    (state) => state.updateCareerGoals
  );
  const setCareerGoals = useOnboardingStore((state) => state.setCareerGoals);
  const clearCareerGoals = useOnboardingStore(
    (state) => state.clearCareerGoals
  );
  const submitCareerGoals = useOnboardingStore(
    (state) => state.submitCareerGoals
  );

  return {
    careerGoals,
    updateCareerGoals,
    setCareerGoals,
    clearCareerGoals,
    submitCareerGoals,
  };
};

export const useMentoringPreferences = () => {
  const mentoringPreferences = useOnboardingStore(
    (state) => state.mentoringPreferences
  );
  const updateMentoringPreferences = useOnboardingStore(
    (state) => state.updateMentoringPreferences
  );
  const setMentoringPreferences = useOnboardingStore(
    (state) => state.setMentoringPreferences
  );
  const clearMentoringPreferences = useOnboardingStore(
    (state) => state.clearMentoringPreferences
  );
  const submitMentoringPreferences = useOnboardingStore(
    (state) => state.submitMentoringPreferences
  );

  return {
    mentoringPreferences,
    updateMentoringPreferences,
    setMentoringPreferences,
    clearMentoringPreferences,
    submitMentoringPreferences,
  };
};

// Hook for common actions
export const useOnboardingActions = () => {
  const clearAllData = useOnboardingStore((state) => state.clearAllData);
  const getAllOnboardingData = useOnboardingStore(
    (state) => state.getAllOnboardingData
  );
  const setIsSubmitting = useOnboardingStore((state) => state.setIsSubmitting);
  const isSubmitting = useOnboardingStore((state) => state.isSubmitting);

  return {
    clearAllData,
    getAllOnboardingData,
    setIsSubmitting,
    isSubmitting,
  };
};

// Hook to get entire onboarding state
export const useOnboarding = () => {
  const professionalBackground = useOnboardingStore(
    (state) => state.professionalBackground
  );
  const careerGoals = useOnboardingStore((state) => state.careerGoals);
  const mentoringPreferences = useOnboardingStore(
    (state) => state.mentoringPreferences
  );
  const isSubmitting = useOnboardingStore((state) => state.isSubmitting);
  const getAllOnboardingData = useOnboardingStore(
    (state) => state.getAllOnboardingData
  );

  return {
    professionalBackground,
    careerGoals,
    mentoringPreferences,
    isSubmitting,
    getAllOnboardingData,
  };
};
