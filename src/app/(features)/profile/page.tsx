"use client";
import { Button } from "@/components/ui/button";
import InformationCompletionBanner from "@/components/common/InformationCompletionBanner";
import { useState } from "react";
import AnnualTargetView from "./(views)/AnnualTarget";

export default function ProfileDetails() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <header className="w-full h-[60px] bg-[#251F99] border-b sticky top-0 z-10">
        {/* Background Pattern - moved behind content */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Content with higher z-index */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("profile")}
            className={`flex rounded-none flex-col items-center justify-center h-full w-[93px] border-b-2 ${
              activeTab == "profile"
                ? "text-[#334AFF] hover:text-[#334AFF] bg-[#DBEAFF] hover:bg-[#DBEAFF] border-[#334AFF]"
                : "border-transparent text-white hover:text-white hover:bg-white/10"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0653 12.8512 14.2174 12.5 13.3333 12.5H6.66668C5.78262 12.5 4.93478 12.8512 4.30965 13.4763C3.68453 14.1014 3.33334 14.9493 3.33334 15.8333V17.5M13.3333 5.83333C13.3333 7.67428 11.841 9.16667 10 9.16667C8.15906 9.16667 6.66668 7.67428 6.66668 5.83333C6.66668 3.99238 8.15906 2.5 10 2.5C11.841 2.5 13.3333 3.99238 13.3333 5.83333Z"
                stroke={activeTab == "profile" ? "#334AFF" : "#fff"}
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium">Profile</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setActiveTab("annualTarget")}
            className={`flex rounded-none flex-col items-center justify-center h-full w-[93px] border-b-2 ${
              activeTab == "annualTarget"
                ? "text-[#334AFF] hover:text-[#334AFF] bg-[#DBEAFF] hover:bg-[#DBEAFF] border-[#334AFF]"
                : "border-transparent text-white hover:text-white hover:bg-white/10"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 5.83333V10L12.5 11.6667M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z"
                stroke={activeTab == "annualTarget" ? "#334AFF" : "#fff"}
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium">Annual Target</span>
          </Button>
        </div>
      </header>

      <InformationCompletionBanner />

      {/* Tab Content */}
      <div className="container mx-auto p-6">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Profile Information
            </h2>
            <p className="text-gray-600">
              Your profile details will appear here.
            </p>
            {/* Add your profile form/content here */}
          </div>
        )}

        {activeTab === "annualTarget" && (
          <div>
            <AnnualTargetView/>
          </div>
        )}
      </div>
    </div>
  );
}
