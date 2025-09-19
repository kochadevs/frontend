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
  new_role_values: NewRoleValue[] | null;
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