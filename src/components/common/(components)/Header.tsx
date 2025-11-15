"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { Mentor } from "@/interface/mentors";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utilities/getNameInitials";
import { Share2, Calendar, ArrowLeft } from "lucide-react";

type HeaderProps = {
  handleChangeView?: (view: "book_session" | "mentor_view") => void;
  currentView?: "book_session" | "mentor_view";
  mentor?: Mentor | null;
};

const Header = ({ handleChangeView, currentView, mentor }: HeaderProps) => {
  const pathname = usePathname();

  return (
    <div className="relative -mt-[5rem] z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              {mentor?.profile_pic ? (
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 border-4 border-white shadow-lg rounded-full overflow-hidden">
                  <Image
                    src={mentor.profile_pic}
                    fill
                    alt={`${mentor.first_name} ${
                      mentor.last_name || ""
                    } profile`}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1592173993451-73c4b56495b3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                    }}
                  />
                </div>
              ) : (
                <Avatar className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-[#334AFF] to-[#251F99]  text-white text-2xl sm:text-3xl font-semibold">
                    {getInitials(
                      mentor?.first_name as string,
                      mentor?.last_name as string
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left w-full">
              <div className="space-y-4">
                {/* Name and Title */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {mentor
                      ? `${mentor.first_name} ${mentor.last_name || ""}`.trim()
                      : "Loading..."}
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    {mentor?.new_role_values?.[0]?.name ||
                      "Professional Mentor"}
                  </p>
                </div>

                {/* Key Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 truncate">
                      {mentor?.email || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-gray-500">Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {mentor?.job_search_status?.[0]?.name ||
                        "Available for mentoring"}
                    </span>
                  </div>

                  {mentor?.location && (
                    <div className="space-y-1">
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">
                        {mentor.location}
                      </p>
                    </div>
                  )}

                  {mentor?.industry?.[0] && (
                    <div className="space-y-1">
                      <p className="text-gray-500">Industry</p>
                      <p className="font-medium text-gray-900">
                        {mentor.industry[0].name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Profile
                  </Button>

                  {pathname.includes("/mentor_match") &&
                    handleChangeView &&
                    currentView && (
                      <Button
                        onClick={() =>
                          handleChangeView(
                            currentView === "mentor_view"
                              ? "book_session"
                              : "mentor_view"
                          )
                        }
                        variant={
                          currentView === "mentor_view" ? "default" : "outline"
                        }
                        className={`flex items-center gap-2 ${
                          currentView === "mentor_view"
                            ? "bg-[#334AFF] hover:bg-[#334AFF]/90 hover:text-gray-200 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {currentView === "mentor_view" ? (
                          <>
                            <Calendar className="h-4 w-4" />
                            Book Session
                          </>
                        ) : (
                          <>
                            <ArrowLeft className="h-4 w-4" />
                            Back to Profile
                          </>
                        )}
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
