import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="relative -mt-[5rem] z-30 flex justify-center ">
      <div className="w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 flex flex-col gap-y-[2rem]">
        <header className=" flex flex-col items-start gap-4 sm:gap-x-8">
          <div className="flex items-end justify-between w-full">
            <div className="relative md:h-[234px] md:w-[234px] h-[180px] w-[180px] sm:h-[234px] sm:w-[234px] min-w-[150px] sm:min-w-[234px] border-[4px] border-white overflow-hidden shadow rounded-full">
              <Image
                src="https://images.unsplash.com/photo-1592173993451-73c4b56495b3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                fill
                alt="profile image"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 w-full h-full flex items-center justify-center rounded-sm">
            <div className="w-full flex items-start justify-between flex-col gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#475467] sm:text-[30px]">
                Olivia Rhye
              </h1>
              <h3 className="font-[600] text-[#344054]">Fullstack Developer</h3>
              <div className="grid grid-cols-2 gap-x-20 gap-y-4 text-gray-500 text-[14px]">
                <div>
                  <p>Current Email</p>
                </div>

                <div>
                  <p>Job search status</p>
                </div>

                <div>
                  <p className="font-[500]">oliviarhye@example.com</p>
                </div>

                <div className="bg-[#EFF8FF] px-[6px] py-[2px] w-fit rounded-[16px] flex items-center justify-center">
                  <p className="font-[500] text-[13px] text-[#175CD3]">
                    Actively looking
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="bg-[#334AFF] hover:bg-[#334AFF/90 text-white hover:text-gray-200 mt-2"
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
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
