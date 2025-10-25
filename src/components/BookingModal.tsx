"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, DollarSign, User, Loader2 } from "lucide-react";
import { MentorPackage } from "@/interface/mentorPackages";
import { Mentor } from "@/interface/mentors";
import { CreateBookingRequest } from "@/interface/bookings";
import { createBooking } from "@/utilities/handlers/bookingHandler";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor;
  mentorPackage: MentorPackage;
  onBookingSuccess?: (bookingId: number) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  mentor,
  mentorPackage,
  onBookingSuccess,
}: Readonly<BookingModalProps>) {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = useAccessToken();

  // Generate minimum date (today) and time slots
  const today = new Date().toISOString().split("T")[0];
  const minDateTime = new Date();
  minDateTime.setHours(minDateTime.getHours() + 1); // At least 1 hour from now

  // Generate available time slots (9 AM to 6 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    const time24 = hour.toString().padStart(2, "0") + ":00";
    const time12 =
      hour > 12
        ? `${hour - 12}:00 PM`
        : hour === 12
        ? "12:00 PM"
        : `${hour}:00 AM`;
    timeSlots.push({ value: time24, label: time12 });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingDate || !bookingTime) {
      toast.error("Please select both date and time for your session.");
      return;
    }

    // Combine date and time into ISO string
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);

    // Check if booking is in the future
    if (bookingDateTime <= new Date()) {
      toast.error("Please select a future date and time for your session.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to book a session.");
        return;
      }

      const bookingRequest: CreateBookingRequest = {
        mentor_id: mentor.id, // This is the package user_id (mentor's user ID)
        mentor_package_id: mentorPackage.id,
        booking_date: bookingDateTime.toISOString(),
        notes: notes.trim(),
      };

      const booking = await createBooking(mentor.id, bookingRequest, token);

      toast.success(
        "Booking created successfully! The mentor will be notified."
      );

      if (onBookingSuccess) {
        onBookingSuccess(booking.id);
      }

      // Reset form and close modal
      setBookingDate("");
      setBookingTime("");
      setNotes("");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create booking";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setBookingDate("");
      setBookingTime("");
      setNotes("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#475467] flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#334AFF]" />
            Book Session
          </DialogTitle>
        </DialogHeader>

        {/* Package & Mentor Info */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 border">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <img
                src={
                  mentor.profile_pic ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
                alt={`${mentor.first_name} ${mentor.last_name}`.trim()}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-[#344054]">
                  {mentor.first_name} {mentor.last_name || ""}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[#475467] mb-2">
                {mentorPackage.name}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{mentorPackage.duration} minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold text-[#334AFF]">
                    ${mentorPackage.price}
                  </span>
                </div>
              </div>

              {mentorPackage.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {mentorPackage.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="booking-date"
                className="text-sm font-medium text-[#344054]"
              >
                Select Date *
              </Label>
              <Input
                id="booking-date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={today}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="booking-time"
                className="text-sm font-medium text-[#344054]"
              >
                Select Time *
              </Label>
              <select
                id="booking-time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#334AFF] focus:border-transparent"
              >
                <option value="">Choose time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-[#344054]"
            >
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any specific topics you'd like to discuss or questions you have..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-500">
              Let your mentor know what you&apos;d like to focus on during the
              session.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 bg-[#334AFF] hover:bg-[#251F99] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Booking...
                </>
              ) : (
                `Book Session - $${mentorPackage.price}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
