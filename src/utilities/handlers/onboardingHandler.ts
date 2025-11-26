/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IndustryResponse,
  SkillsResponse,
  CareerGoals,
  MentoringFrequency,
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

export const fetchCareerGoals = async (): Promise<CareerGoals> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/onbarding/career-goals`, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data as CareerGoals;
  } catch (error: any) {
    console.error("Error fetching skills:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch career goals"
    );
  }
};

export const fetchMentoringFrequency =
  async (): Promise<MentoringFrequency> => {
    try {
      const baseURL = getBaseURL();
      const response = await axios.get(
        `${baseURL}/onbarding/mentoring-frequency`,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );
      return response.data as MentoringFrequency;
    } catch (error: any) {
      console.error("Error fetching skills:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch mentoring frequency"
      );
    }
  };

// Submit Onboarding Data
export const submitOnboardingInformation = async (
  onboardingData: any,
  code_of_conduct_accepted: boolean,
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = getBaseURL();
    // Construct the request body according to the API specification
    const requestBody = {
      professional_background: {
        current_role: onboardingData.professionalBackground.currentRole,
        company: onboardingData.professionalBackground.company,
        years_of_experience:
          parseInt(onboardingData.professionalBackground.yearsOfExperience) ||
          0,
        industry_ids: onboardingData.professionalBackground.industries,
        skill_ids: onboardingData.professionalBackground.skills,
      },
      goals: {
        career_goal_ids: onboardingData.careerGoals.shortTermGoals,
        long_term_goals: onboardingData.careerGoals.longTermGoal,
      },
      mentoring_preferences: {
        mentoring_frequency_ids: onboardingData.mentoringPreferences.frequency, // Now directly using the array
        mentoring_format_ids: [], // You might need to add this to your store if needed
        preferred_skill_ids: onboardingData.mentoringPreferences.skills,
        preferred_industry_ids: onboardingData.mentoringPreferences.industries,
      },
      code_of_conduct_accepted: code_of_conduct_accepted,
    };

    console.log("Submitting onboarding data:", requestBody);

    const response = await axios.post(
      `${baseURL}/onbarding/complete`,
      requestBody,
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
