/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoginPayload {
  username: string;
  password: string;
}

interface NewRoleValue {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface Industry {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface JobSearchStatus {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface RoleOfInterest {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
  category: string;
}

interface Skill {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface CareerGoal {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface MentoringFrequency {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface MentoringFormat {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface SocialLinks {
  [key: string]: any;
}

interface Availability {
  [key: string]: any;
}

// Nested Professional Background Interface
interface ProfessionalBackground {
  current_role: string;
  company: string;
  years_of_experience: number;
  industry: Industry[];
  skills: Skill[];
}

// Nested Goals Interface
interface Goals {
  career_goals: CareerGoal[];
  long_term_goals: string;
}

// Nested Mentoring Preferences Interface
interface MentoringPreferences {
  mentoring_frequency: MentoringFrequency[];
  mentoring_format: MentoringFormat[];
  preferred_skills: Skill[];
  preferred_industries: Industry[];
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  nationality: string;
  location: string;
  phone: string;
  is_active: boolean;
  email_verified: boolean;
  profile_pic: string;
  cover_photo: string;
  about: string;
  user_type: string;
  social_links: SocialLinks;
  availability: Availability;

  // Nested objects
  professional_background: ProfessionalBackground;
  goals: Goals;
  mentoring_preferences: MentoringPreferences;

  // Direct arrays
  new_role_values: NewRoleValue[];
  job_search_status: JobSearchStatus[];
  role_of_interest: RoleOfInterest[];

  code_of_conduct_accepted: boolean;
  onboarding_completed: boolean;
  is_onboarded: boolean;
}

export interface LoginResponse {
  id: number;
  access_token: string;
  token_type: string;
  is_active: boolean;
  refresh_token: string;
  user_profile: UserProfile;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string;
}