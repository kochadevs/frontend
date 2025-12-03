/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from "@/interface/events";
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

export const fetchIncomingEvents = async (
  accessToken: string
): Promise<Event[]> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/events/upcoming`, {
      headers: getAuthHeaders(accessToken),
      timeout: 10000,
    });
    return response.data as Event[];
  } catch (error: any) {
    throw error
  }
};
export const fetchEventDetails = async (
  accessToken: string,
  event_id: number
): Promise<Event> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/api/v1/events/${event_id}`, {
      headers: getAuthHeaders(accessToken),
      timeout: 10000,
    });
    return response.data as Event;
  } catch (error: any) {
    throw error;
  }
};
