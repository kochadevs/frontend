export interface LoginPayload {
  username: string;
  password: string;
}

interface NewRoleValue {
  id: number;
  date_created: string;
  last_modified:string;
  name:string
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

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  gender: string;
  nationality: string;
  location: string;
  is_active: boolean;
  profile_pic: string;
  user_type: string;
  new_role_values: NewRoleValue[] | null;
  industry: Industry[] | null;
  job_search_status: JobSearchStatus[] | null;
  role_of_interest: RoleOfInterest[] | null;
  skills: Skill[] | null;
  career_goals: CareerGoal[] | null;
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