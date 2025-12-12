/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserProfile } from "@/interface/auth/login";
import axios from "axios";

// Helper function to get base URL
const getBaseURL = () => {
  const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;
  if (!baseURL) {
    throw new Error("API base URL is not configured in environment variables");
  }
  return baseURL;
};

// Helper function to create authenticated headers
const getAuthHeaders = (accessToken: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
});

export const fetchAllUsers = async (
  accessToken: string
): Promise<UserProfile[]> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/admin/users`, {
      headers: getAuthHeaders(accessToken),
      timeout: 10000,
    });
    return response.data as UserProfile[];
  } catch (error: any) {
    throw error;
  }
};

export const ChangeUserType = async (
  accessToken: string,
  user_id: number,
  user_type: "regular" | "mentor" | "mentee" | "admin"
) => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.patch(
      `${baseURL}/admin/users/${user_id}/user-type?new_user_type=${user_type}`,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const DeleteUser = async (
  accessToken: string,
  user_id: number,
) => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.delete(
      `${baseURL}/admin/users/${user_id}`,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
