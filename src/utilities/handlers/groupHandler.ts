import axios from "axios";
import { CreateGroupPayload, CreateGroupResponse, Group } from "../interface/groups";
import { GroupMember } from "../interface/groupMembers";

export const createGroup = async (
  payload: CreateGroupPayload,
  accessToken: string
): Promise<CreateGroupResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.post(`${baseURL}/groups/`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as CreateGroupResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to create group";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    // Something happened in setting up the request that triggered an Error
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const fetchAllGroups = async (accessToken: string): Promise<Group[]> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.get(`${baseURL}/groups/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as Group[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to fetch groups";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const joinGroup = async (
  groupId: number,
  accessToken: string
): Promise<{ message: string }> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.post(
      `${baseURL}/groups/${groupId}/join`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        timeout: 10000,
      }
    );

    const { data } = response;

    return data as { message: string };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to join group";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const fetchMyGroups = async (accessToken: string): Promise<Group[]> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.get(`${baseURL}/groups/my-groups`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as Group[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to fetch your groups";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const leaveGroup = async (
  groupId: number,
  accessToken: string
): Promise<{ message: string }> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.post(
      `${baseURL}/groups/${groupId}/leave`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        timeout: 10000,
      }
    );

    const { data } = response;

    return data as { message: string };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to leave group";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const fetchGroupDetails = async (
  groupId: number,
  accessToken: string
): Promise<Group> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.get(`${baseURL}/groups/${groupId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as Group;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to fetch group details";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const fetchGroupMembers = async (
  groupId: number,
  accessToken: string
): Promise<GroupMember[]> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const response = await axios.get(`${baseURL}/groups/${groupId}/members`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as GroupMember[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to fetch group members";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};
