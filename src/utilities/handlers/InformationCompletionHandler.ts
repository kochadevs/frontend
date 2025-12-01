/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CompletionDataResponse } from "@/interface/InformationCompletion";

const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getInformationCompletionData(
  token: string
): Promise<CompletionDataResponse> {
  try {
    const response = await apiClient.get<CompletionDataResponse>(
      "/profile/completion",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error:any) {
    throw error
  }
}
