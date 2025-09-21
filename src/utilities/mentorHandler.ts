import { Mentor } from "@/interface/mentors";

const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

/**
 * Fetch all mentors from the API
 */
export async function getMentors(token: string): Promise<Mentor[]> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.detail ||
          `Failed to fetch mentors: ${response.status} ${response.statusText}`
      );
    }

    const mentors: Mentor[] = await response.json();
    return mentors;
  } catch (error) {
    throw error;
  }
}
