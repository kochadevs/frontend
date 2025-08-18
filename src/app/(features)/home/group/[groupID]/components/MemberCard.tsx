import { Card } from "@/components/ui/card";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function MemberCard(){
  return (
    <div>
      <Card className="p-0 pb-2 overflow-hidden gap-1">
        <div className="w-full min-h-[63px] flex items-center p-[16px] border-b">
          <div className="flex items-center gap-[16px]">
            <Avatar className="w-[60px] h-[60px] object-center">
              <AvatarImage
                src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="w-full h-full object-cover"
              />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-[#4D5256] text-[17px] font-[700]">
                Alexa Pacheco
              </h2>
              <p className="text-[#4D5256] text-[14px]">United Kingdom</p>
            </div>
          </div>
        </div>
        <div className="p-[16px] flex-col flex gap-y-3">
          <p className="text-[#344054] text-[15px]">
            <span className="font-semibold">Sector: </span>Private
          </p>
          <p className="text-[#344054] text-[15px]">
            <span className="font-semibold">Industry: </span>Tecnology
          </p>
          <p className="text-[#344054] text-[15px]">
            <span className="font-semibold">Job Title: </span>UI/UX designer
          </p>
          <p className="text-[#344054] text-[15px]">
            <span className="font-semibold">Organization: </span>Hubtel
          </p>
        </div>
        <div className="flex items-center justify-end px-[16px]">
          <Button variant="ghost" className="bg-[#334AFF] text-white hover:bg-[#334AFF]/90 hover:text-white">
            View profile
          </Button>
        </div>
      </Card>
    </div>
  );
};


