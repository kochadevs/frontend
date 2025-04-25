import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="relative -mt-[5rem] z-50 flex justify-center">
      <div className="w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <header className="md:h-[234px] min-h-[234px] flex flex-col sm:flex-row items-center gap-4 sm:gap-x-8">
          <div className="relative md:h-full md:w-[150px] h-[180px] w-[180px] sm:h-[234px] sm:w-[234px] min-w-[150px] sm:min-w-[234px] border-[4px] border-white overflow-hidden shadow rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1685374947616-754a07599f16?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              fill
              alt="profile image"
              className="object-cover"
            />
          </div>

          <div className="flex-1 w-full h-full flex items-center justify-center bg-linear-to-r from-[#FFFEFE] via-[#FFFEFE] via-50% to-[#D8E8FF] p-4 sm:p-8 shadow rounded-sm">
            <div className="w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-[#475467] sm:text-[30px]">
                Olivia Rhye
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mt-2 sm:mt-0">
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

                <div>
                  <h6 className="text-sm sm:text-[16px] text-[#667085]">
                    Gender
                  </h6>
                  <p className="text-[#344054] text-sm sm:text-[16px] font-semibold">
                    Female
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="bg-linear-to-r from-[#334AFF] to-[#1F2C99] text-white px-3 sm:px-[14px] py-2 sm:py-[10px] rounded-lg transition flex items-center h-[36px] sm:h-[44px] cursor-pointer hover:text-[#fff]/80 text-xs sm:text-base"
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
        </header>
      </div>
    </div>
  );
};

export default Header;
