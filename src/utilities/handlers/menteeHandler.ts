/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mentees } from "@/interface/mentees";
import axios from "axios";



const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getMentees(token: string): Promise<Mentees[]> {
  try {
    const response = await api.get<Mentees[]>("/mentors/mentees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error
  }
}
