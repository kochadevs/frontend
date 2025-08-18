import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Mentors from "./(components)/Mentors";

export default function MentorMatch() {
  return (
    <div className="relative">
      <header className="bg-white h-[70px] z-10 sticky top-0 w-full px-[16px] py-[25px] flex items-center border-b">
        <h1 className="text-[30px] font-[600] text-[#475467]">Mentor match</h1>
      </header>

      <main className="p-[20px] flex-col flex gap-y-[30px]">
        <div className="bg-[#EAECF0] h-[80px] rounded-[8px] flex items-center justify-between p-[16px]">
          <p className="flex-1 text-[#344054] font-[500]">
            Find your ideal career guide with AI-driven mentor matching tailored
            to your goals. Gain insider knowledge, navigate challenges, and
            unlock your potential—through personalized advice that accelerates
            your growth.
          </p>
          <svg
            className="cursor-pointer"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="#667085"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between">
          {/* search */}
          <div className="relative w-full md:w-[320px] overflow-hidden bg-white rounded-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
              >
                <path
                  d="M13 13.0005L9.53537 9.53585M9.53537 9.53585C10.4731 8.59814 10.9999 7.32632 10.9999 6.00019C10.9999 4.67406 10.4731 3.40224 9.53537 2.46452C8.59765 1.5268 7.32583 1 5.9997 1C4.67357 1 3.40175 1.5268 2.46403 2.46452C1.52632 3.40224 0.999512 4.67406 0.999512 6.00019C0.999512 7.32632 1.52632 8.59814 2.46403 9.53585C3.40175 10.4736 4.67357 11.0004 5.9997 11.0004C7.32583 11.0004 8.59765 10.4736 9.53537 9.53585Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Mentors/>
      </main>
    </div>
  );
}
