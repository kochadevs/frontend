/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignupPayload } from "../../interface/auth/signup";
import {
  LoginPayload,
  LoginResponse,
  UserProfile,
} from "../../interface/auth/login";
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../../interface/auth/passwordReset";
import axios from "axios";

export const handleSignup = async (payload: SignupPayload): Promise<any> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.post(`${baseURL}/users/register`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    const { data } = response;

    return data;
  } catch (error: any) {
    throw error;
  }
};

export const handleLogin = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const payloadData = {
      ...payload,
      grant_type: "password",
      scope: "",
    };

    const response = await axios.post(`${baseURL}/users/login`, payloadData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { data } = response;

    return data as LoginResponse;
  } catch (error: any) {
    throw error;
  }
};

export const handleLogout = async (accessToken: string): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    await axios.post(
      `${baseURL}/users/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error: any) {
    throw error;
  }
};

export const handleForgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.post(
      `${baseURL}/users/forgot-password`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const { data } = response;

    return data as ForgotPasswordResponse;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data?.detail ||
        "Failed to send reset email";
      console.error("Server error:", error.response.status, errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error:", error.request);
      throw new Error("Network error - please check your connection");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

export const handleResetPassword = async (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.post(
      `${baseURL}/users/reset-password`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const { data } = response;

    return data as ResetPasswordResponse;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data?.detail ||
        "Failed to reset password";
      console.error("Server error:", error.response.status, errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error:", error.request);
      throw new Error("Network error - please check your connection");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

// Fetch updated user profile after onboarding completion
export const fetchUserProfile = async (
  accessToken: string,
  user_id: number | undefined
): Promise<UserProfile> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    if (!user_id) {
      throw new Error("User ID is required to fetch profile");
    }

    const response = await axios.get(`${baseURL}/users/${user_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as UserProfile;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data?.detail ||
        "Failed to fetch user profile";
      console.error("Server error:", error.response.status, errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error:", error.request);
      throw new Error("Network error - please check your connection");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};
