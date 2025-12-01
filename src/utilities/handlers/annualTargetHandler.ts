/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  AnnualTarget,
  CreateAnnualTargetRequest,
  UpdateAnnualTargetRequest,
} from "@/interface/AnnualTarget";

const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET all annual targets
export async function getAnnualTargets(token: string): Promise<AnnualTarget[]> {
  try {
    const response = await apiClient.get<AnnualTarget[]>(
      "/profile/annual-targets",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

// GET target by ID
export async function getAnnualTargetById(
  token: string,
  targetId: number
): Promise<AnnualTarget> {
  try {
    const response = await apiClient.get<AnnualTarget>(
      `/profile/annual-targets/${targetId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

// CREATE new annual target
export async function createAnnualTarget(
  token: string,
  targetData: CreateAnnualTargetRequest
): Promise<AnnualTarget> {
  try {
    const response = await apiClient.post<AnnualTarget>(
      "/profile/annual-targets",
      targetData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

// UPDATE annual target (PATCH)
export async function updateAnnualTarget(
  token: string,
  targetId: number,
  targetData: UpdateAnnualTargetRequest
): Promise<AnnualTarget> {
  try {
    const response = await apiClient.patch<AnnualTarget>(
      `/profile/annual-targets/${targetId}`,
      targetData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

// DELETE annual target
export async function deleteAnnualTarget(
  token: string,
  targetId: number
): Promise<void> {
  try {
    await apiClient.delete(`/profile/annual-targets/${targetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw error;
  }
}
