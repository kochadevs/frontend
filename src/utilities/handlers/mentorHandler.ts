/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Mentor } from "@/interface/mentors";

const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getMentors(token: string): Promise<Mentor[]> {
  try {
    const response = await api.get<Mentor[]>("/mentors/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch mentors";

    throw new Error(message);
  }
}

export async function getMentorById(
  token: string,
  mentorId: string
): Promise<Mentor> {
  try {
    const response = await api.get<Mentor>(`/mentors/${mentorId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch mentor";

    throw new Error(message);
  }
}
