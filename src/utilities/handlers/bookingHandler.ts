import { CreateBookingRequest, BookingResponse, Booking } from "@/interface/bookings";

const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

/**
 * Create a new booking with a mentor
 */
export async function createBooking(
  mentorId: number,
  bookingData: CreateBookingRequest,
  token: string
): Promise<BookingResponse> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/bookings/${mentorId}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.detail ||
          `Failed to create booking: ${response.status} ${response.statusText}`
      );
    }

    const booking: BookingResponse = await response.json();
    return booking;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all bookings for the current mentor
 */
export async function getMentorBookings(token: string): Promise<Booking[]> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/bookings/me`, {
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
          `Failed to fetch mentor bookings: ${response.status} ${response.statusText}`
      );
    }

    const bookings: Booking[] = await response.json();
    return bookings;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all bookings for the current mentee
 */
export async function getMenteeBookings(token: string): Promise<Booking[]> {
  try {
    // Assuming there's a similar endpoint for mentees
    const response = await fetch(`${BASE_URL}/mentors/bookings/me`, {
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
          `Failed to fetch mentee bookings: ${response.status} ${response.statusText}`
      );
    }

    const bookings: Booking[] = await response.json();
    return bookings;
  } catch (error) {
    throw error;
  }
}

/**
 * Confirm a booking (mentor only)
 */
export async function confirmBooking(
  bookingId: number,
  token: string
): Promise<BookingResponse> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/bookings/${bookingId}/confirm`, {
      method: "PATCH",
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
          `Failed to confirm booking: ${response.status} ${response.statusText}`
      );
    }

    const booking: BookingResponse = await response.json();
    return booking;
  } catch (error) {
    throw error;
  }
}

/**
 * Cancel a booking (mentor only)
 */
export async function cancelBooking(
  bookingId: number,
  token: string
): Promise<BookingResponse> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/bookings/${bookingId}/cancel`, {
      method: "PATCH",
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
          `Failed to cancel booking: ${response.status} ${response.statusText}`
      );
    }

    const booking: BookingResponse = await response.json();
    return booking;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a booking (mentee only)
 */
export async function deleteBooking(
  bookingId: number,
  token: string
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/bookings/${bookingId}`, {
      method: "DELETE",
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
          `Failed to delete booking: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get booking details by ID
 */
export async function getBookingById(
  bookingId: number,
  token: string
): Promise<Booking> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/bookings/${bookingId}`, {
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
          `Failed to fetch booking details: ${response.status} ${response.statusText}`
      );
    }

    const booking: Booking = await response.json();
    return booking;
  } catch (error) {
    throw error;
  }
}
