"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, CheckCircle, XCircle } from "lucide-react";
import { BookingDetailsModalProps } from "@/interface/bookings";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#475467] flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#334AFF]" />
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <Badge
              variant="outline"
              className={`${getStatusColor(booking.status)} flex items-center gap-1`}
            >
              {getStatusIcon(booking.status)}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          {/* Booking ID */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Booking ID</span>
            <span className="text-sm font-mono text-gray-900">#{booking.id}</span>
          </div>

          {/* Session Date & Time */}
          <div className="bg-[#F8FAFC] rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-[#334AFF]" />
              <span className="font-semibold text-[#344054]">Session Details</span>
            </div>
            
            <div className="space-y-2 ml-7">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(booking.booking_date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatTime(booking.booking_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Mentor & Package Info */}
          <div className="bg-[#F8FAFC] rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-[#334AFF]" />
              <span className="font-semibold text-[#344054]">Session Information</span>
            </div>
            
            <div className="space-y-2 ml-7">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mentor ID</span>
                <span className="text-sm font-medium text-gray-900">
                  #{booking.mentor_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Package ID</span>
                <span className="text-sm font-medium text-gray-900">
                  #{booking.mentor_package_id}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-[#F8FAFC] rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-[#334AFF]" />
                <span className="font-semibold text-[#344054]">Session Notes</span>
              </div>
              <p className="text-sm text-gray-700 ml-7 leading-relaxed">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formatDateTime(booking.date_created)}</span>
              </div>
              {booking.last_modified !== booking.date_created && (
                <div className="flex justify-between">
                  <span>Last Modified:</span>
                  <span>{formatDateTime(booking.last_modified)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}