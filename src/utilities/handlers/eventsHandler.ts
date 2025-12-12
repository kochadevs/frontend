/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event, EventPayload } from "@/interface/events";
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
    });
    return response.data as Event[];
  } catch (error: any) {
    throw error;
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
    });
    return response.data as Event;
  } catch (error: any) {
    throw error;
  }
};

// admin endpoints..................

export const fetchAllEventsAdmin = async (
  accessToken: string
): Promise<Event[]> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/admin/events`, {
      headers: getAuthHeaders(accessToken),
    });
    return response.data as Event[];
  } catch (error: any) {
    throw error;
  }
};

export const CreateEvent = async (
  accessToken: string,
  payload: EventPayload
): Promise<Event> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.post(`${baseURL}/admin/events`, payload, {
      headers: getAuthHeaders(accessToken),
    });
    return response.data as Event;
  } catch (error: any) {
    throw error;
  }
};

export const fetchEventDetailsAdmin = async (
  accessToken: string,
  event_id: number
): Promise<Event> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.get(`${baseURL}/admin/events/${event_id}`, {
      headers: getAuthHeaders(accessToken),
    });
    return response.data as Event;
  } catch (error: any) {
    throw error;
  }
};

export const UpdateEventDetailsAdmin = async (
  accessToken: string,
  event_id: number,
  payload: EventPayload
): Promise<Event> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.patch(
      `${baseURL}/admin/events/${event_id}`,
      payload,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data as Event;
  } catch (error: any) {
    throw error;
  }
};

export const DeleteEventAdmin = async (
  accessToken: string,
  event_id: number
): Promise<Event> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.delete(`${baseURL}/admin/events/${event_id}`, {
      headers: getAuthHeaders(accessToken),
    });
    return response.data as Event;
  } catch (error: any) {
    throw error;
  }
};

export const DeactivateEventAdmin = async (
  accessToken: string,
  event_id: number
): Promise<Event> => {
  try {
    const baseURL = getBaseURL();
    const response = await axios.patch(
      `${baseURL}/admin/events/${event_id}/deactivate`,
      {
        headers: getAuthHeaders(accessToken),
        timeout: 10000,
      }
    );
    return response.data as Event;
  } catch (error: any) {
    throw error;
  }
};
