import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Groups() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="container mx-auto flex flex-col lg:flex-row items-start justify-between gap-[1.5rem] p-2 pb-[1rem]">
      <Card className="flex-1 py-0 overflow-hidden gap-2 w-full">
        <div className="border h-[76px] flex items-center justify-start px-[8px]">
          <div className="w-[150px] bg-[#F2F4F7] rounded-[8px] h-[44px] flex justify-between">
            <Button
              onClick={() => setActiveTab("all")}
              variant="ghost"
              className={`h-full ${
                activeTab == "all"
                  ? "bg-white hover:bg-white"
                  : "bg-transparent hover:bg-transparent"
              }`}
            >
              All
            </Button>
            <Button
              onClick={() => setActiveTab("requested")}
              variant="ghost"
              className={`h-full hover:bg-white ${
                activeTab == "requested"
                  ? "bg-white hover:bg-white"
                  : "bg-transparent hover:bg-transparent"
              }`}
            >
              Requested
            </Button>
          </div>
        </div>
        <div className="px-[16px] flex-col flex gap-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="flex items-start justify-between border-b gap-x-1 py-2 group"
            >
              <div className="flex items-start gap-2">
                <Avatar className="w-[32px] h-[32px] object-center">
                  <AvatarImage
                    src="/asset/home/figma.png"
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback>ProfileIcon</AvatarFallback>
                </Avatar>
                <div className="cursor-pointer">
                  <h2 className="font-semibold text-[#344054] text-[16px] group-hover:text-[#334AFF] group-hover:underline">
                    Figma Product Community
                  </h2>
                  <p className="text-gray-500 text-[15px]">192,736 members</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-fit">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.9987 10.8334C10.4589 10.8334 10.832 10.4603 10.832 10C10.832 9.53978 10.4589 9.16669 9.9987 9.16669C9.53846 9.16669 9.16536 9.53978 9.16536 10C9.16536 10.4603 9.53846 10.8334 9.9987 10.8334Z"
                        stroke="#344054"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.832 10.8334C16.2923 10.8334 16.6654 10.4603 16.6654 10C16.6654 9.53978 16.2923 9.16669 15.832 9.16669C15.3718 9.16669 14.9987 9.53978 14.9987 10C14.9987 10.4603 15.3718 10.8334 15.832 10.8334Z"
                        stroke="#344054"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.16536 10.8334C4.6256 10.8334 4.9987 10.4603 4.9987 10C4.9987 9.53978 4.6256 9.16669 4.16536 9.16669C3.70513 9.16669 3.33203 9.53978 3.33203 10C3.33203 10.4603 3.70513 10.8334 4.16536 10.8334Z"
                        stroke="#344054"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 -ml-[8rem]">
                  <DropdownMenuItem className="rounded-none border-l-2 hover:bg-[#DBEAFF] hover:text-[#334AFF] data-[highlighted]:bg-[#DBEAFF] data-[highlighted]:text-[#334AFF] data-[highlighted]:border-l-2 data-[highlighted]:border-l-[#334AFF]">
                    Copy link to group
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-none border-l-2 text-red-500 hover:bg-[#DBEAFF] hover:text-red-600 data-[highlighted]:bg-[#DBEAFF] data-[highlighted]:text-red-600 data-[highlighted]:border-l-2 data-[highlighted]:border-l-[#334AFF]">
                    Leave this group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </Card>
      <Card className="w-full lg:w-[386px] gap-0 pb-0">
        <div className="px-[8px] mb-2">
          <h2 className="text-gray-700 text-[16px] font-[600]">
            Groups you might be interested in
          </h2>
        </div>
        <div className="px-[16px] flex-col flex gap-2 mt-3">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-start border-b gap-x-1 pb-2">
              <div className="flex items-start ">
                <Avatar className="w-[32px] h-[32px] object-center">
                  <AvatarImage
                    src="/asset/home/mailchimp.png"
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback>Icon</AvatarFallback>
                </Avatar>
                <div className="flex-col flex gap-y-1">
                  <h2 className="font-semibold text-[#344054] text-[16px] hover:text-[#334AFF] hover:underline cursor-pointer">
                    mailchimp
                  </h2>
                  <p className="text-gray-500 text-[15px]">192,736 members</p>
                  <Button variant="outline" className="w-fit">
                    Join
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full h-[52px]">
          Show all
        </Button>
      </Card>
    </div>
  );
}
