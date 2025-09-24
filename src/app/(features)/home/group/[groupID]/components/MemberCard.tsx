import { Card } from "@/components/ui/card";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GroupMember } from "@/interface/groupMembers";

interface MemberCardProps {
  member?: GroupMember;
  isLoading?: boolean;
}

export default function MemberCard({ member, isLoading }: MemberCardProps) {
  const getFullName = (firstName: string, lastName: string | null) => {
    return lastName ? `${firstName} ${lastName}` : firstName;
  };

  const getInitials = (firstName: string, lastName: string | null) => {
    return lastName ? `${firstName[0]}${lastName[0]}` : firstName[0];
  };

  if (isLoading) {
    return (
      <div>
        <Card className="p-0 pb-2 overflow-hidden gap-1">
          <div className="w-full min-h-[63px] flex items-center p-[16px] border-b">
            <div className="flex items-center gap-[16px]">
              <div className="w-[60px] h-[60px] bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
              </div>
            </div>
          </div>
          <div className="p-[16px] flex-col flex gap-y-3">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div>
        <Card className="p-0 pb-2 overflow-hidden gap-1">
          <div className="w-full min-h-[63px] flex items-center p-[16px] border-b">
            <div className="flex items-center gap-[16px]">
              <div className="w-[60px] h-[60px] bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400">No Data</span>
              </div>
              <div>
                <h2 className="text-[#4D5256] text-[17px] font-[700]">
                  No Member Data
                </h2>
                <p className="text-[#4D5256] text-[14px]">-</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="p-0 pb-2 overflow-hidden gap-1">
        <div className="w-full min-h-[63px] flex items-center p-[16px] border-b">
          <div className="flex items-center gap-[16px]">
            <Avatar className="w-[60px] h-[60px] object-center">
              {member.profile_pic ? (
                <AvatarImage
                  src={member.profile_pic}
                  className="w-full h-full object-cover"
                  alt={getFullName(member.first_name, member.last_name)}
                />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white font-semibold">
                {getInitials(member.first_name, member.last_name)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-[#4D5256] text-[17px] font-[700]">
                {getFullName(member.first_name, member.last_name)}
              </h2>
              <p className="text-[#4D5256] text-[14px]">{member.location}</p>
            </div>
          </div>
        </div>
        <div className="p-[16px] flex-col flex gap-y-3">
          <p className="text-[#344054] text-[15px]">
            <span className="font-semibold">User Type: </span>
            {member.user_type}
          </p>
          {member.industry.length > 0 && (
            <p className="text-[#344054] text-[15px]">
              <span className="font-semibold">Industry: </span>
              {member.industry.slice(0, 2).map(ind => ind.name).join(", ")}
              {member.industry.length > 2 && ` +${member.industry.length - 2} more`}
            </p>
          )}
          {member.role_of_interest.length > 0 && (
            <p className="text-[#344054] text-[15px]">
              <span className="font-semibold">Roles of Interest: </span>
              {member.role_of_interest.slice(0, 2).map(role => role.name).join(", ")}
              {member.role_of_interest.length > 2 && ` +${member.role_of_interest.length - 2} more`}
            </p>
          )}
          {member.skills.length > 0 && (
            <p className="text-[#344054] text-[15px]">
              <span className="font-semibold">Skills: </span>
              {member.skills.slice(0, 2).map(skill => skill.name).join(", ")}
              {member.skills.length > 2 && ` +${member.skills.length - 2} more`}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end px-[16px]">
          <Link href={`/home/group_member_profile/${member.id}`}>
            <Button
              variant="ghost"
              className="bg-[#334AFF] text-white hover:bg-[#334AFF]/90 hover:text-white"
            >
              View profile
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};


