"use client";

import { useState, useEffect } from "react";
import { useAccessToken, useUser } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import {
  getMentorBookings,
  getMenteeBookings,
  confirmBooking,
  cancelBooking,
  deleteBooking,
} from "@/utilities/handlers/bookingHandler";
import { Booking } from "@/interface/bookings";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import {
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Clock,
  User,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<{
    id: number;
    action: string;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const accessToken = useAccessToken();
  const user = useUser();
  const isMentor = user?.user_type === "mentor";

  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

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
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const loadBookings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to view bookings.");
        return;
      }

      let bookingsData: Booking[];
      if (isMentor) {
        bookingsData = await getMentorBookings(token);
      } else {
        bookingsData = await getMenteeBookings(token);
      }

      // Sort bookings by booking_date (most recent first)
      const sortedBookings = bookingsData.sort(
        (a, b) =>
          new Date(b.booking_date).getTime() -
          new Date(a.booking_date).getTime()
      );

      setBookings(sortedBookings);
      setTotalItems(sortedBookings.length);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load bookings";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: number) => {
    setActionLoading({ id: bookingId, action: "confirm" });
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to perform this action.");
        return;
      }

      await confirmBooking(bookingId, token);
      toast.success("Booking confirmed successfully!");
      loadBookings(); // Reload to get updated data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to confirm booking";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    setActionLoading({ id: bookingId, action: "cancel" });
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to perform this action.");
        return;
      }

      await cancelBooking(bookingId, token);
      toast.success("Booking cancelled successfully!");
      loadBookings(); // Reload to get updated data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel booking";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    setActionLoading({ id: bookingId, action: "delete" });
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to perform this action.");
        return;
      }

      await deleteBooking(bookingId, token);
      toast.success("Booking deleted successfully!");
      loadBookings(); // Reload to get updated data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete booking";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset to first page when bookings change
  useEffect(() => {
    setCurrentPage(1);
  }, [bookings]);

  useEffect(() => {
    if (user && accessToken) {
      loadBookings();
    }
  }, [user, accessToken]);

  // Show loading while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#334AFF]/10 rounded-lg">
                <Calendar className="h-6 w-6 text-[#334AFF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isMentor ? "My Bookings" : "My Bookings"}
                </h1>
                <p className="text-sm text-gray-600">
                  {isMentor
                    ? "Manage booking requests from mentees"
                    : "View and manage your mentor session bookings"}
                </p>
              </div>
            </div>

            {!isLoading && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{totalItems} bookings</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* No Bookings */}
        {!isLoading && bookings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-4">
                {isMentor
                  ? "You haven't received any booking requests yet. Keep providing great mentorship!"
                  : "You haven't made any bookings yet. Browse mentors to book your first session!"}
              </p>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {!isLoading && bookings.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Session Date</TableHead>
                    <TableHead>Session Time</TableHead>
                    {isMentor && <TableHead>Mentee ID</TableHead>}
                    {!isMentor && <TableHead>Mentor ID</TableHead>}
                    <TableHead>Package ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono">#{booking.id}</TableCell>
                      <TableCell>{formatDate(booking.booking_date)}</TableCell>
                      <TableCell>{formatTime(booking.booking_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-gray-400" />#
                          {booking.mentor_id}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        #{booking.mentor_package_id}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(
                            booking.status
                          )} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {/* View Details Option */}
                            <DropdownMenuItem
                              onClick={() => handleViewBooking(booking)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            {/* Mentor Actions for Pending Bookings */}
                            {isMentor && booking.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleConfirmBooking(booking.id)}
                                  disabled={
                                    actionLoading?.id === booking.id &&
                                    actionLoading?.action === "confirm"
                                  }
                                  className="flex items-center gap-2 cursor-pointer text-green-600 focus:text-green-600"
                                >
                                  {actionLoading?.id === booking.id &&
                                  actionLoading?.action === "confirm" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                  Confirm Booking
                                </DropdownMenuItem>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                      disabled={
                                        actionLoading?.id === booking.id &&
                                        actionLoading?.action === "cancel"
                                      }
                                    >
                                      {actionLoading?.id === booking.id &&
                                      actionLoading?.action === "cancel" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <XCircle className="h-4 w-4" />
                                      )}
                                      Cancel Booking
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Cancel Booking
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this
                                        booking? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        No, Keep It
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleCancelBooking(booking.id)
                                        }
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Yes, Cancel Booking
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}

                            {/* Mentee Actions */}
                            {!isMentor && (
                              <>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                      disabled={
                                        actionLoading?.id === booking.id &&
                                        actionLoading?.action === "delete"
                                      }
                                    >
                                      {actionLoading?.id === booking.id &&
                                      actionLoading?.action === "delete" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                      Delete Booking
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Booking
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        booking? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        No, Keep It
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteBooking(booking.id)
                                        }
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Yes, Delete Booking
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}

                            {/* No Actions Available */}
                            {isMentor && booking.status !== "pending" && (
                              <DropdownMenuItem
                                disabled
                                className="text-gray-400 cursor-not-allowed"
                              >
                                No actions available
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-700">per page</span>
              </div>

              {/* Page info */}
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} entries
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === pageNum
                            ? "bg-[#334AFF] text-white"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
      />
    </div>
  );
}