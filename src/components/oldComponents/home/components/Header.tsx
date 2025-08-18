import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="relative -mt-[5rem] z-50 flex justify-center">
      <div className="w-full ">
        <header className="lg:h-[234px] min-h-[234px] flex flex-col lg:flex-row items-center gap-4 sm:gap-x-8">
          <div className="relative lg:h-full md:w-[150px] h-[180px] w-[180px] sm:h-[234px] sm:w-[234px] min-w-[150px] sm:min-w-[234px] border-[4px] border-white overflow-hidden shadow rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1685374947616-754a07599f16?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              fill
              alt="profile image"
              className="object-cover"
            />

            <Button className="absolute bottom-1 right-1 bg-white hover:bg-gray-200 z-20">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 19.0002H19M14.5 2.50023C14.8978 2.1024 15.4374 1.87891 16 1.87891C16.2786 1.87891 16.5544 1.93378 16.8118 2.04038C17.0692 2.14699 17.303 2.30324 17.5 2.50023C17.697 2.69721 17.8532 2.93106 17.9598 3.18843C18.0665 3.4458 18.1213 3.72165 18.1213 4.00023C18.1213 4.2788 18.0665 4.55465 17.9598 4.81202C17.8532 5.06939 17.697 5.30324 17.5 5.50023L5 18.0002L1 19.0002L2 15.0002L14.5 2.50023Z"
                  stroke="#344054"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>

          <div className="flex-1 w-full h-full flex items-center justify-center bg-linear-to-r from-[#FFFEFE] via-[#FFFEFE] via-50% to-[#D8E8FF] p-4 sm:p-8 shadow rounded-sm">
            <div className="w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-[#475467] sm:text-[30px]">
                Olivia Rhye
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
                <div className="lg:flex lg:items-center gap-6 grid grid-cols-2">
                  <div>
                    <h6 className="text-sm sm:text-[16px] text-[#667085]">
                      Current Email
                    </h6>
                    <p className="text-[#344054] text-sm sm:text-[16px] font-semibold">
                      oliviarhye@example.com
                    </p>
                  </div>
                  <div>
                    <h6 className="text-sm sm:text-[16px] text-[#667085]">
                      Job Search Status
                    </h6>
                    <span className="inline-block bg-[#EFF8FF] text-[#175CD3] text-xs sm:text-sm px-2 py-1 rounded mt-1 sm:mt-2">
                      Actively looking
                    </span>
                  </div>
                </div>

                <div className="flex items-center lg:flex-row flex-col gap-3">
                  <Button
                    variant="ghost"
                    className="border bg-white text-[#344054] lg:w-[188px] w-full px-3 sm:px-[14px] py-2 sm:py-[10px] rounded-lg transition flex items-center justify-center h-[36px] sm:h-[44px] cursor-pointer text-xs sm:text-base"
                  >
                    View profile
                  </Button>

                  <Button
                    variant="ghost"
                    className="bg-[#334AFF] hover:bg-[#251F99] text-white lg:w-[188px] w-full px-3 sm:px-[14px] py-2 sm:py-[10px] rounded-lg transition flex items-center h-[36px] sm:h-[44px] cursor-pointer hover:text-[#fff] text-xs sm:text-base"
                  >
                    <Image
                      src="/asset/home/share icon.svg"
                      width={16}
                      height={16}
                      alt="profile image"
                      className="object-cover mr-1 sm:mr-2"
                    />
                    Share profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
