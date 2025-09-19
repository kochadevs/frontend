// Interface for forgot password API payload
export interface ForgotPasswordPayload {
  email: string;
}

// Interface for reset password API payload
export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

// Interface for forgot password API response
export interface ForgotPasswordResponse {
  message: string;
  success?: boolean;
}

// Interface for reset password API response
export interface ResetPasswordResponse {
  message: string;
  success?: boolean;
}