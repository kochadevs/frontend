/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignupPayload } from "../interface/auth/signup";
import { LoginPayload, LoginResponse } from "../interface/auth/login";
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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Signup failed";
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

export const handleLogin = async (payload: LoginPayload): Promise<LoginResponse> => {
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
        scope: ""
    }

    const response = await axios.post(`${baseURL}/users/login`, payloadData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as LoginResponse;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data?.detail ||
        "Login failed";
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
