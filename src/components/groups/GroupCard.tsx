"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group } from "@/interface/groups";
import { joinGroup } from "@/utilities/handlers/groupHandler";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/utilities/dateFormator";

interface GroupCardProps {
  group: Group;
  onJoinSuccess?: (groupId: number) => void;
}

export default function GroupCard({
  group,
  onJoinSuccess,
}: Readonly<GroupCardProps>) {
  const accessToken = useAccessToken();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinGroup = async () => {
    setIsJoining(true);

    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Please log in to join a group");
      }

      await joinGroup(group.id, token);

      toast.success(`Successfully joined ${group.name}!`);

      if (onJoinSuccess) {
        onJoinSuccess(group.id);
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to join group"
      );
    } finally {
      setIsJoining(false);
    }
  };

  const getInitialsFromSingleName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  console.log(group);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        {/* Group Avatar */}
        <Avatar className="w-12 h-12 bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white">
          <AvatarFallback className="bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white font-semibold">
            {getInitialsFromSingleName(group.name)}
          </AvatarFallback>
        </Avatar>

        {/* Group Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
              {group.name}
            </h3>
            <span
              className={`shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                group.is_public
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {group.is_public ? "Public" : "Private"}
            </span>
          </div>
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {group.description}
        </p>

        <div className="flex flex-col items-start gap-y-2 justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Created {formatDate(group.date_created)}</span>
            {group.member_count !== undefined && (
              <span>
                {group.member_count} member
                {group.member_count !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <Button
            onClick={handleJoinGroup}
            disabled={isJoining}
            size="sm"
            variant="outline"
            className="w-fit"
          >
            {isJoining ? "Joining..." : "Join Group"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
