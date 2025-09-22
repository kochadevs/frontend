"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getMentors } from "@/utilities/mentorHandler";
import { Mentor } from "@/interface/mentors";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAccessToken();

  const loadMentors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }
      
      if (!token) {
        setError("Please sign in to view mentors.");
        setIsLoading(false);
        return;
      }

      const mentorsData = await getMentors(token);
      // Filter only mentors (user_type === "mentor")
      const actualMentors = mentorsData.filter(mentor => mentor.user_type === "mentor");
      setMentors(actualMentors.slice(0, 5)); // Show first 5 mentors for recommended section
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load mentors";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, [accessToken]);

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#344054]">
          Recommended mentors
        </h2>
        <Link href="/mentors">
          <Button variant="link" className="text-[#344054]">
            View all
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={loadMentors}
              variant="outline"
              className="border-[#334AFF] text-[#334AFF] hover:bg-[#334AFF] hover:text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && mentors.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No mentors available at the moment.</p>
            <p className="text-sm text-gray-500">Check back soon for new mentors!</p>
          </div>
        </div>
      )}

      {/* Mentors List */}
      {!isLoading && !error && mentors.length > 0 && (
        <div className="space-y-4">
          {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className=" flex items-start gap-2 min-w-[240px] h-[65px]">
              <div className="w-[65px] aspect-square h-[65px] relative rounded-md overflow-hidden">
                <Image
                  src={mentor.profile_pic || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"}
                  alt={`${mentor.first_name} ${mentor.last_name || ''}`}
                  className="object-cover"
                  fill
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg";
                  }}
                />
              </div>

              <div className="flex items-start flex-col">
                <h3 className="font-medium text-[17px] text-[#344054]">
                  {mentor.first_name} {mentor.last_name || ''}
                </h3>
                <p className="text-[15px] text-[#475467] font-semibold mb-1">
                  {mentor.new_role_values?.[0]?.name || "Mentor"}
                </p>
                <div className="flex items-center">
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M3.91752 8.23037L1.13417 4.75118C0.960903 4.5346 0.874271 4.42631 0.812666 4.30572C0.75801 4.19874 0.718063 4.08486 0.69391 3.96718C0.666687 3.83453 0.666687 3.69585 0.666687 3.4185V2.96683C0.666687 2.22009 0.666687 1.84672 0.812012 1.56151C0.939843 1.31063 1.14382 1.10665 1.39470 0.978821C1.67992 0.833496 2.05328 0.833496 2.80002 0.833496H9.20002C9.94676 0.833496 10.3201 0.833496 10.6053 0.978821C10.8562 1.10665 11.0602 1.31063 11.1880 1.56151C11.3334 1.84672 11.3334 2.22009 11.3334 2.96683V3.4185C11.3334 3.69585 11.3334 3.83453 11.3061 3.96718C11.2820 4.08486 11.2420 4.19874 11.1874 4.30572C11.1258 4.42631 11.0391 4.5346 10.8659 4.75118L8.08252 8.23037M1.33339 1.50016L6.00006 7.50016L10.6667 1.50016M8.35705 8.47647C9.65879 9.77822 9.65879 11.8888 8.35705 13.1905C7.05530 14.4923 4.94475 14.4923 3.64300 13.1905C2.34125 11.8888 2.34125 9.77822 3.64300 8.47647C4.94474 7.17473 7.05529 7.17473 8.35705 8.47647Z"
                      stroke="#8D8983"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* First 3 yellow stars (filled) */}
                  {[...Array(3)].map((_, index) => (
                    <Star
                      key={`yellow-${mentor.id}-${index}`}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}

                  {[...Array(2)].map((_, index) => (
                    <Star
                      key={`gray-${mentor.id}-${index}`}
                      size={16}
                      className="text-gray-200 fill-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h6 className="text-[#344054] text-[16px] font-semibold">
                About
              </h6>
              <p className="text-[16px] text-[#344054] line-clamp-2">
                {mentor.about ? 
                  (mentor.about.length > 150 ? 
                    `${mentor.about.substring(0, 150)}...` : 
                    mentor.about
                  ) : 
                  "Experienced mentor ready to guide you in your career journey."
                }
              </p>
              {mentor.industry?.[0] && (
                <p className="text-sm text-[#475467] mt-1">
                  Industry: {mentor.industry[0].name}
                </p>
              )}
              {mentor.location && (
                <p className="text-sm text-[#475467]">
                  Location: {mentor.location}
                </p>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              <Link href={`/mentor_match/mentor/${mentor.id}`}>
                <Button
                  variant="ghost"
                  className="bg-[#334AFF] hover:bg-[#251F99] text-white hover:text-white"
                >
                  View profile
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-300">
                Book a session
              </Button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
