/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoginPayload {
  username: string;
  password: string;
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
  new_role_values: any | null;
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