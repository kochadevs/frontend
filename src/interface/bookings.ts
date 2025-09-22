export interface CreateBookingRequest {
  mentor_id: number;
  mentor_package_id: number;
  booking_date: string; // ISO string format
  notes: string;
}

export interface BookingResponse {
  mentor_id: number;
  mentor_package_id: number;
  booking_date: string;
  notes: string;
  id: number;
  date_created: string;
  last_modified: string;
  status: string;
}

export interface BookingFormData {
  booking_date: string;
  notes: string;
}

export interface Booking {
  id: number;
  mentor_id: number;
  mentor_package_id: number;
  booking_date: string;
  notes: string;
  date_created: string;
  last_modified: string;
  status: string;
}

export type BookingStatus = 
  | "pending" 
  | "confirmed" 
  | "cancelled" 
  | "completed"
  | string; // Allow other status values

export interface BookingTableProps {
  bookings: Booking[];
  userType: "mentor" | "mentee";
  isLoading?: boolean;
  onConfirm?: (bookingId: number) => void;
  onCancel?: (bookingId: number) => void;
  onDelete?: (bookingId: number) => void;
  onView?: (booking: Booking) => void;
}

export interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}
