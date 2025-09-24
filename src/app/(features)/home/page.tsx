"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostContent from "./(views)/PostContent";
import Groups from "./(views)/Groups";

export default function Home() {
  const [activeTab, setActiveTab] = useState("general");
  return (
    <div>
      <header className="w-full h-[60px] bg-white border-b flex items-center justify-center sticky top-0 z-10">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("general")}
          className={`flex rounded-none flex-col items-center justify-center h-full w-[93px] border-b-2 ${
            activeTab == "general"
              ? "text-[#334AFF] hover:text-[#334AFF] bg-[#DBEAFF] hover:bg-[#DBEAFF] border-[#334AFF]"
              : "border-gray-100 border"
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
              d="M17.5 9.58336C17.5029 10.6832 17.2459 11.7683 16.75 12.75C16.162 13.9265 15.2581 14.916 14.1395 15.6078C13.021 16.2995 11.7319 16.6662 10.4167 16.6667C9.31678 16.6696 8.23176 16.4126 7.25 15.9167L2.5 17.5L4.08333 12.75C3.58744 11.7683 3.33047 10.6832 3.33333 9.58336C3.33384 8.26815 3.70051 6.97907 4.39227 5.86048C5.08402 4.7419 6.07355 3.838 7.25 3.25002C8.23176 2.75413 9.31678 2.49716 10.4167 2.50002H10.8333C12.5703 2.59585 14.2109 3.32899 15.4409 4.55907C16.671 5.78915 17.4042 7.42973 17.5 9.16669V9.58336Z"
              stroke={activeTab == "general" ? "#334AFF" : "#000"}
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h1>General</h1>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("groups")}
          className={`flex rounded-none flex-col items-center justify-center h-full w-[93px] border-b-2 ${
            activeTab == "groups"
              ? "text-[#334AFF] hover:text-[#334AFF] bg-[#DBEAFF] hover:bg-[#DBEAFF] border-[#334AFF]"
              : "border-gray-100 border"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1224_6308)">
              <path
                d="M14.1654 17.5V15.8333C14.1654 14.9493 13.8142 14.1014 13.1891 13.4763C12.5639 12.8512 11.7161 12.5 10.832 12.5H4.16536C3.28131 12.5 2.43346 12.8512 1.80834 13.4763C1.18322 14.1014 0.832031 14.9493 0.832031 15.8333V17.5M19.1654 17.5V15.8333C19.1648 15.0948 18.919 14.3773 18.4665 13.7936C18.014 13.2099 17.3805 12.793 16.6654 12.6083M13.332 2.60833C14.049 2.79192 14.6846 3.20892 15.1384 3.79359C15.5922 4.37827 15.8386 5.09736 15.8386 5.8375C15.8386 6.57764 15.5922 7.29673 15.1384 7.88141C14.6846 8.46608 14.049 8.88308 13.332 9.06667M10.832 5.83333C10.832 7.67428 9.33965 9.16667 7.4987 9.16667C5.65775 9.16667 4.16536 7.67428 4.16536 5.83333C4.16536 3.99238 5.65775 2.5 7.4987 2.5C9.33965 2.5 10.832 3.99238 10.832 5.83333Z"
                stroke={activeTab == "groups" ? "#334AFF" : "#000"}
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1224_6308">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <h1>Groups</h1>
        </Button>
      </header>

      {activeTab == "general" ? <PostContent /> : <Groups />}
    </div>
  );
}
