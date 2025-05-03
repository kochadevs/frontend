import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { customStorage } from "@/lib/customStorage";

interface OnboardingState {
  // Value Selection
  selectedValues: string[];
  toggleValue: (id: string) => void;
  setSelectedValues: (values: string[]) => void;
  clearSelectedValues: () => void;
  
  // Job Search Status
  jobSearchStatus: string[];
  toggleJobSearchStatus: (id: string) => void;
  setJobSearchStatus: (status: string[]) => void;
  clearJobSearchStatus: () => void;

  // Role Selection
  selectedRoles: string[];
  toggleRole: (id: string) => void;
  setSelectedRoles: (roles: string[]) => void;
  clearSelectedRoles: () => void;

  // Industry Selection
  selectedIndustries: string[];
  toggleIndustry: (industry: string) => void;
  setSelectedIndustries: (industries: string[]) => void;
  clearSelectedIndustries: () => void;

  // Skills Selection
  selectedSkills: string[];
  toggleSkill: (skill: string) => void;
  setSelectedSkills: (skills: string[]) => void;
  clearSelectedSkills: () => void;

  // Career Goals
  careerGoals: string[];
  toggleCareerGoal: (goal: string) => void;
  setCareerGoals: (goals: string[]) => void;
  clearCareerGoals: () => void;
  
  // Common
  saveOnboardingData: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      // Value Selection
      selectedValues: [],
      
      toggleValue: (id) => {
        set((state) => {
          if (state.selectedValues.includes(id)) {
            return {
              selectedValues: state.selectedValues.filter((v) => v !== id)
            };
          }
          if (state.selectedValues.length >= 3) {
            return state;
          }
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
      
      // Job Search Status
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

      // Role Selection
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
      
       // Industry Selection
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

      // Skills Selection
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

       // Career Goals
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
      
      // Common
      saveOnboardingData: async () => {
        // The values are already saved in the store via persist middleware
        // This is just a placeholder for any async operations you might need
        return Promise.resolve();
      }
    }),
    {
      name: "onboarding-values",
      // storage: customStorage,
    }
  )
);