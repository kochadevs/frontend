"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { getMentorPackagesForMentees } from "@/utilities/handlers/mentorPackageHandler";
import { MentorPackage } from "@/interface/mentorPackages";
import { Mentor } from "@/interface/mentors";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingModal from "@/components/BookingModal";

type BookSessionViewProps = {
  mentor?: Mentor | null;
};

export default function BookSessionView({
  mentor,
}: Readonly<BookSessionViewProps>) {
  const [packages, setPackages] = useState<MentorPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<MentorPackage | null>(
    null
  );
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const accessToken = useAccessToken();

  const loadMentorPackages = useCallback(async () => {
    if (!mentor?.id) {
      setError("Mentor information not available");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        setError("Please sign in to view mentor packages.");
        return;
      }

      // Fetch packages for this specific mentor
      const mentorPackages = await getMentorPackagesForMentees(
        token,
        mentor.id
      );

      // Filter only active packages for booking
      const activePackages = mentorPackages.filter((pkg) => pkg.is_active);
      setPackages(activePackages);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load mentor packages";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [mentor?.id, accessToken]);

  const handleBookNow = (pkg: MentorPackage) => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    setSelectedPackage(null);
    toast.success(
      "Booking successful! You'll receive a confirmation email shortly."
    );
  };

  useEffect(() => {
    loadMentorPackages();
  }, [loadMentorPackages]);

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h2 className="font-[600] text-2xl sm:text-3xl text-[#475467]">
          Session packages
        </h2>
        {mentor && (
          <div className="text-sm text-gray-600">
            {packages.length} available packages
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
            <p className="text-gray-600">Loading session packages...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={loadMentorPackages}
              variant="outline"
              className="border-[#334AFF] text-[#334AFF] hover:bg-[#334AFF] hover:text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && packages.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 47 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
              >
                <path
                  d="M31.3333 3.9165V11.7498M15.6667 3.9165V11.7498M5.875 19.5832H41.125M9.79167 7.83317H37.2083C39.3715 7.83317 41.125 9.58672 41.125 11.7498V39.1665C41.125 41.3296 39.3715 43.0832 37.2083 43.0832H9.79167C7.62855 43.0832 5.875 41.3296 5.875 39.1665V11.7498C5.875 9.58672 7.62855 7.83317 9.79167 7.83317Z"
                  stroke="currentColor"
                  strokeWidth="3.91667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No session packages available
            </h3>
            <p className="text-gray-600 mb-4">
              This mentor hasn&apos;t created any session packages yet.
            </p>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      {!isLoading && !error && packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className="p-4 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-[#475467] text-xl sm:text-2xl font-[600]">
                  {pkg.name}
                </h3>
                <p className="text-[#667085] text-sm sm:text-base font-[400] mt-1">
                  {pkg.duration} min session
                </p>
                {pkg.description && (
                  <p className="text-[#667085] text-sm mt-2 line-clamp-2">
                    {pkg.description}
                  </p>
                )}
              </div>

              <div className="bg-[#F2F4F7] flex-wrap rounded-[16px] p-4 min-h-[84px] flex items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-start gap-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 47 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M31.3333 3.9165V11.7498M15.6667 3.9165V11.7498M5.875 19.5832H41.125M9.79167 7.83317H37.2083C39.3715 7.83317 41.125 9.58672 41.125 11.7498V39.1665C41.125 41.3296 39.3715 43.0832 37.2083 43.0832H9.79167C7.62855 43.0832 5.875 41.3296 5.875 39.1665V11.7498C5.875 9.58672 7.62855 7.83317 9.79167 7.83317Z"
                      stroke="#344054"
                      strokeWidth="3.91667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex-1">
                    <h4 className="text-[#344054] font-[600] text-sm sm:text-base">
                      {mentor?.new_role_values?.[0]?.name ||
                        "Professional Mentor"}
                    </h4>
                    <p className="text-[#667085] text-xs sm:text-sm">
                      Video meeting • {pkg.duration} minutes
                    </p>
                  </div>
                </div>

                {/* Book Now Button */}
                <Button
                  onClick={() => handleBookNow(pkg)}
                  className="min-w-[120px] h-[44px] rounded-full bg-[#334AFF] hover:bg-[#251F99] text-white transition-all flex items-center justify-center gap-x-2 py-2 px-4"
                >
                  <span className="text-sm font-[600]">
                    Book Now - ${pkg.price}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {mentor && selectedPackage && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedPackage(null);
          }}
          mentor={mentor}
          mentorPackage={selectedPackage}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
