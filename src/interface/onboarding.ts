export interface StepProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

// Base interface for all onboarding options
export interface OnboardingOption {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

// Extended interface for role interest (has category)
export interface RoleInterestOption extends OnboardingOption {
  category: string;
}

// API Response types
export type NewRoleValuesResponse = OnboardingOption[];
export type JobSearchStatusResponse = OnboardingOption[];
export type RoleInterestResponse = RoleInterestOption[];
export type IndustryResponse = OnboardingOption[];
export type SkillsResponse = OnboardingOption[];
export type CareerGoalsResponse = OnboardingOption[];

// API Request interfaces
export interface NewRoleValuesRequest {
  new_role_values: number[];
}

export interface JobSearchStatusRequest {
  job_search_status: number[];
}

export interface RoleInterestRequest {
  roles_of_interest: number[];
}

export interface IndustryRequest {
  industries: number[];
}

export interface SkillsRequest {
  skills: number[];
}

export interface CareerGoalsRequest {
  career_goals: number[];
}

// API Response for successful submissions
export interface OnboardingSubmissionResponse {
  message: string;
  success?: boolean;
}

export interface ProfessionalBackground {
  currentRole: string;
  company: string;
  yearsOfExperience: string;
}

export interface CareerGoalsData {
  shortTermGoal: string;
  longTermGoal: string;
}
