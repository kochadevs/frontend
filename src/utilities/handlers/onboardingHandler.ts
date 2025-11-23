/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IndustryResponse,
  SkillsResponse,
  MentoringPreferences,
  CareerGoalsData,
  ProfessionalBackground,
} from "@/interface/onboarding";
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

// GET API functions (no authentication required)
export const fetchIndustries = async (): Promise<IndustryResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/onbarding/industry`, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data as IndustryResponse;
  } catch (error: any) {
    console.error("Error fetching industries:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch industries"
    );
  }
};

export const fetchSkills = async (): Promise<SkillsResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/onbarding/skills`, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data as SkillsResponse;
  } catch (error: any) {
    console.error("Error fetching skills:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch skills");
  }
};

// POST API functions (authentication required)
export const submitProfessionalBackground = async (
  data: { professional_background: ProfessionalBackground },
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(
      `${baseURL}/onboarding/professional-background`,
      data,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error submitting professional background:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to submit professional background"
    );
  }
};

export const submitMentoringPreferences = async (
  data: { mentoring_preferences: MentoringPreferences },
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(
      `${baseURL}/onboarding/mentoring-preferences`,
      data,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error submitting mentoring preferences:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit mentoring preferences"
    );
  }
};

export const submitCareerGoals = async (
  data: { career_goals: CareerGoalsData },
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(
      `${baseURL}/onboarding/career-goals`,
      data,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error submitting career goals:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit career goals"
    );
  }
};
