import { Card } from "@/components/ui/card";

export default function BookSessionView() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="w-full flex items-center">
        <h2 className="font-[600] text-2xl sm:text-3xl text-[#475467]">
          Session packages
        </h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((num) => (
          <Card key={num} className="p-4 flex flex-col gap-4">
            <div>
              <h3 className="text-[#475467] text-xl sm:text-2xl font-[600]">
                15 min quick chat
              </h3>
              <p className="text-[#667085] text-sm sm:text-base font-[400]">
                15 min
              </p>
            </div>

            <div className="bg-[#F2F4F7] flex-wrap rounded-[16px] p-4 h-[84px] flex items-center justify-between gap-4">
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

                <div>
                  <h4 className="text-[#344054] font-[600] text-sm sm:text-base">
                    Fullstack Developer
                  </h4>
                  <p className="text-[#667085] text-xs sm:text-sm">
                    Video meeting
                  </p>
                </div>
              </div>

              {/* Price Button */}
              <div className="min-w-[90px] h-[44px] rounded-full bg-white border flex items-center justify-center gap-x-2 py-2 px-4">
                <p className="text-[#475467] text-base sm:text-lg font-[700]">
                  $60
                </p>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="#344054"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
