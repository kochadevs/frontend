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
  current_role: string;
  company: string;
  years_of_experience: number;
  long_term_goals: string;
  code_of_conduct_accepted: boolean;
  onboarding_completed: boolean;
  is_onboarded: boolean;
  user_type: string;
  social_links: SocialLinks;
  availability: Availability;
  new_role_values: NewRoleValue[];
  job_search_status: JobSearchStatus[];
  role_of_interest: RoleOfInterest[];
  industry: Industry[];
  skills: Skill[];
  career_goals: CareerGoal[];
  mentoring_frequency: MentoringFrequency[];
  mentoring_format: MentoringFormat[];
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