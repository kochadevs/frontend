"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { Mentor } from "@/interface/mentors";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utilities/getNameInitials";

type HeaderProps = {
  handleChangeView?: (view: "book_session" | "mentor_view") => void;
  currentView?: "book_session" | "mentor_view";
  mentor?: Mentor | null;
};

const Header = ({ handleChangeView, currentView, mentor }: HeaderProps) => {
  const pathname = usePathname();

  return (
    <div className="relative -mt-[5rem] z-30 flex justify-center ">
      <div className="w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 flex flex-col gap-y-[2rem]">
        <header className=" flex flex-col items-start gap-4 sm:gap-x-8">
          <div className="flex items-end justify-between w-full">
            {mentor?.profile_pic ? (
              <div className="relative md:h-[234px] md:w-[234px] h-[180px] w-[180px] sm:h-[234px] sm:w-[234px] min-w-[150px] sm:min-w-[234px] border-[4px] border-white overflow-hidden shadow rounded-full">
                <Image
                  src={mentor?.profile_pic}
                  fill
                  alt={`${mentor?.first_name || ""} ${
                    mentor?.last_name || ""
                  } profile image`}
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1592173993451-73c4b56495b3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                  }}
                />
              </div>
            ) : (
              <Avatar className=" md:h-[234px] md:w-[234px] h-[180px] w-[180px] sm:h-[234px] sm:w-[234px] min-w-[150px] sm:min-w-[234px] border-[4px] border-white overflow-hidden shadow rounded-full">
                <AvatarFallback className="bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white text-[82px] font-semibold">
                  {getInitials(
                    mentor?.first_name as string,
                    mentor?.last_name as string
                  )}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          <div className="flex-1 w-full h-full flex items-center justify-center rounded-sm">
            <div className="w-full flex items-start justify-between flex-col gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#475467] sm:text-[30px]">
                {mentor
                  ? `${mentor.first_name} ${mentor.last_name || ""}`.trim()
                  : "Loading..."}
              </h1>
              <h3 className="font-[600] text-[#344054]">
                {mentor?.new_role_values?.[0]?.name || "Professional Mentor"}
              </h3>
              <div className="grid grid-cols-2 gap-x-20 gap-y-4 text-gray-500 text-[14px]">
                <div>
                  <p>Current Email</p>
                </div>

                <div>
                  <p>Job search status</p>
                </div>

                <div>
                  <p className="font-[500]">{mentor?.email || "N/A"}</p>
                </div>

                <div className="bg-[#EFF8FF] px-[6px] py-[2px] w-fit rounded-[16px] flex items-center justify-center">
                  <p className="font-[500] text-[13px] text-[#175CD3]">
                    {mentor?.job_search_status?.[0]?.name ||
                      "Available for mentoring"}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              {mentor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-2 text-gray-500 text-[14px] mt-2">
                  {mentor.location && (
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-[500] text-[#344054]">
                        {mentor.location}
                      </p>
                    </div>
                  )}
                  {mentor.industry?.[0] && (
                    <div>
                      <p className="text-gray-500">Industry</p>
                      <p className="font-[500] text-[#344054]">
                        {mentor.industry[0].name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 mt-2">
                <Button
                  variant="ghost"
                  className="bg-[#334AFF] hover:bg-[#334AFF]/90 text-white hover:text-gray-200"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Share profile
                </Button>
                {pathname.includes("/mentor_match") &&
                  handleChangeView &&
                  currentView &&
                  (currentView === "mentor_view" ? (
                    <Button
                      onClick={() => handleChangeView("book_session")}
                      variant="outline"
                      className="w-fit"
                    >
                      Book a session
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleChangeView("mentor_view")}
                      variant="outline"
                      className="w-fit"
                    >
                      Back Profile
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
