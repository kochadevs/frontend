/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NewRoleValuesResponse,
  JobSearchStatusResponse,
  RoleInterestResponse,
  IndustryResponse,
  SkillsResponse,
  CareerGoalsResponse,
  NewRoleValuesRequest,
  OnboardingSubmissionResponse,
  JobSearchStatusRequest,
  RoleInterestRequest,
  IndustryRequest,
  SkillsRequest,
  CareerGoalsRequest,
  MentoringPreferences,
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

export const fetchNewRoleValues = async (): Promise<NewRoleValuesResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/onbarding/new-role-values`, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data as NewRoleValuesResponse;
  } catch (error: any) {
    console.error("Error fetching new role values:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch new role values"
    );
  }
};

export const fetchJobSearchStatus =
  async (): Promise<JobSearchStatusResponse> => {
    try {
      const baseURL = getBaseURL();
      const response = await axios.get(
        `${baseURL}/onbarding/job-search-status`,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );
      return response.data as JobSearchStatusResponse;
    } catch (error: any) {
      console.error("Error fetching job search status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch job search status"
      );
    }
  };

export const fetchRoleInterest = async (): Promise<RoleInterestResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/onbarding/role-interest`, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data as RoleInterestResponse;
  } catch (error: any) {
    console.error("Error fetching role interest:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch role interest"
    );
  }
};

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

export const fetchCareerGoals = async (): Promise<CareerGoalsResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/onbarding/career-goals`, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data as CareerGoalsResponse;
  } catch (error: any) {
    console.error("Error fetching career goals:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch career goals"
    );
  }
};

// POST API functions (authentication required)

export const submitProfessionalBackground = async (
  data: { professional_background: any },
  accessToken: string
): Promise<void> => {
  const baseURL = getBaseURL();
  const response = await fetch(`${baseURL}/onboarding/professional-background`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit professional background");
  }
};

export const submitMentoringPreferences = async (
  data: { mentoring_preferences: MentoringPreferences },
  accessToken: string
): Promise<void> => {
  const baseURL = getBaseURL();
  const response = await fetch(`${baseURL}/onboarding/mentoring-preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit mentoring preferences");
  }
};

export const submitNewRoleValues = async (
  payload: NewRoleValuesRequest,
  accessToken: string
): Promise<OnboardingSubmissionResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(
      `${baseURL}/users/new-role-values`,
      payload,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data as OnboardingSubmissionResponse;
  } catch (error: any) {
    console.error("Error submitting new role values:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit new role values"
    );
  }
};

export const submitJobSearchStatus = async (
  payload: JobSearchStatusRequest,
  accessToken: string
): Promise<OnboardingSubmissionResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(
      `${baseURL}/users/job-search-status`,
      payload,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data as OnboardingSubmissionResponse;
  } catch (error: any) {
    console.error("Error submitting job search status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit job search status"
    );
  }
};

export const submitRoleInterest = async (
  payload: RoleInterestRequest,
  accessToken: string
): Promise<OnboardingSubmissionResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(
      `${baseURL}/users/role-of-interest`,
      payload,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data as OnboardingSubmissionResponse;
  } catch (error: any) {
    console.error("Error submitting role interest:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit role interest"
    );
  }
};

export const submitIndustries = async (
  payload: IndustryRequest,
  accessToken: string
): Promise<OnboardingSubmissionResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(`${baseURL}/users/industry`, payload, {
      headers: getAuthHeaders(accessToken),
      timeout: 10000,
    });
    return response.data as OnboardingSubmissionResponse;
  } catch (error: any) {
    console.error("Error submitting industries:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit industries"
    );
  }
};

export const submitSkills = async (
  payload: SkillsRequest,
  accessToken: string
): Promise<OnboardingSubmissionResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(`${baseURL}/users/skills`, payload, {
      headers: getAuthHeaders(accessToken),
      timeout: 10000,
    });
    return response.data as OnboardingSubmissionResponse;
  } catch (error: any) {
    console.error("Error submitting skills:", error);
    throw new Error(error.response?.data?.message || "Failed to submit skills");
  }
};

export const submitCareerGoals = async (
  payload: CareerGoalsRequest,
  accessToken: string
): Promise<OnboardingSubmissionResponse> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(
      `${baseURL}/users/career-goals`,
      payload,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data as OnboardingSubmissionResponse;
  } catch (error: any) {
    console.error("Error submitting career goals:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit career goals"
    );
  }
};
