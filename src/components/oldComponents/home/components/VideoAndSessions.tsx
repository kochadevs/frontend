import React from "react";

const VideoAndSessions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-md p-6 min-h-[418px] border">
        <h2 className="text-lg font-semibold text-[#344054] mb-4">
          How Kocha AI Works
        </h2>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 h-[346px]">
          <video
            controls
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1629204814140-42a737865119?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          >
            <source src="/kocha-ai-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 min-h-[418px] border">
        <div className="flex items-start flex-col mb-4">
          <h2 className="text-lg font-semibold text-[#344054]">
            Upcoming sessions overview
          </h2>
          <div className="text-[14px] text-[#667085] flex items-center font-semibold gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_793_10333)">
                <path
                  d="M7.99998 10.6666V7.99992M7.99998 5.33325H8.00665M14.6666 7.99992C14.6666 11.6818 11.6819 14.6666 7.99998 14.6666C4.31808 14.6666 1.33331 11.6818 1.33331 7.99992C1.33331 4.31802 4.31808 1.33325 7.99998 1.33325C11.6819 1.33325 14.6666 4.31802 14.6666 7.99992Z"
                  stroke="#667085"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_793_10333">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Click on a session to start meeting
          </div>
        </div>
        <div className="space-y-2 h-[346px] overflow-auto">
          {[
            { id: 1, time: "Jan 15, 10:00am" },
            { id: 2, time: "Jan 15, 10:00am" },
            { id: 3, time: "Jan 15, 10:00am" },
            { id: 4, time: "Jan 15, 10:00am" },
            { id: 5, time: "Jan 15, 10:00am" },
          ].map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 p-[8px] hover:bg-[#F2F4F7] transition cursor-pointer"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 11.6C2 8.23969 2 6.55953 2.65396 5.27606C3.2292 4.14708 4.14708 3.2292 5.27606 2.65396C6.55953 2 8.23969 2 11.6 2H20.4C23.7603 2 25.4405 2 26.7239 2.65396C27.8529 3.2292 28.7708 4.14708 29.346 5.27606C30 6.55953 30 8.23969 30 11.6V20.4C30 23.7603 30 25.4405 29.346 26.7239C28.7708 27.8529 27.8529 28.7708 26.7239 29.346C25.4405 30 23.7603 30 20.4 30H11.6C8.23969 30 6.55953 30 5.27606 29.346C4.14708 28.7708 3.2292 27.8529 2.65396 26.7239C2 25.4405 2 23.7603 2 20.4V11.6Z"
                  fill="#4087FC"
                />
                <path
                  d="M8.26667 10C7.56711 10 7 10.6396 7 11.4286V18.3571C7 20.369 8.44612 22 10.23 22L17.7333 21.9286C18.4329 21.9286 19 21.289 19 20.5V13.5C19 11.4881 17.2839 10 15.5 10L8.26667 10Z"
                  fill="white"
                />
                <path
                  d="M20.7122 12.7276C20.2596 13.1752 20 13.8211 20 14.5V17.3993C20 18.0782 20.2596 18.7242 20.7122 19.1717L23.5288 21.6525C24.1019 22.2191 25 21.7601 25 20.9005V11.1352C25 10.2755 24.1019 9.81654 23.5288 10.3832L20.7122 12.7276Z"
                  fill="white"
                />
              </svg>

              <div>
                <h3 className="text-[16px] font-medium text-[#344054]">
                  UX Design Workshop
                </h3>
                <p className="text-[14px] text-[#344054]">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoAndSessions;
