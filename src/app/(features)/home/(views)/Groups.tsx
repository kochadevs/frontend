import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import CreateGroupModal from "@/components/modals/CreateGroupModal";
import { Group } from "@/interface/groups";
import { fetchAllGroups, joinGroup, fetchMyGroups, leaveGroup } from "@/utilities/groupHandler";
import { useAuthStore } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";

export default function Groups() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [suggestedGroups, setSuggestedGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingMyGroups, setIsLoadingMyGroups] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleGroupCreated = () => {
    // You can add logic here to refresh the groups list or navigate to the new group
    // Refresh both groups lists
    loadSuggestedGroups();
    loadMyGroups();
  };

  const loadSuggestedGroups = useCallback(async () => {
    try {
      setIsLoadingGroups(true);
      
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }
      
      if (!token) {
        return;
      }

      const allGroups = await fetchAllGroups(token);
      // Show only first 3 groups as suggestions
      setSuggestedGroups(allGroups.slice(0, 3));
    } catch (error) {
      console.error('Error loading suggested groups:', error);
      // Don't show toast error here as it's just suggestions
    } finally {
      setIsLoadingGroups(false);
    }
  }, [accessToken]);

  const loadMyGroups = useCallback(async () => {
    try {
      setIsLoadingMyGroups(true);
      
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }
      
      if (!token) {
        return;
      }

      const userGroups = await fetchMyGroups(token);
      setMyGroups(userGroups);
    } catch (error) {
      console.error('Error loading my groups:', error);
      // Don't show toast error here as it loads in background
    } finally {
      setIsLoadingMyGroups(false);
    }
  }, [accessToken]);

  const handleJoinGroup = async (groupId: number, groupName: string) => {
    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }
      
      if (!token) {
        toast.error('Please log in to join a group');
        return;
      }

      await joinGroup(groupId, token);
      toast.success(`Successfully joined ${groupName}!`);
      
      // Refresh the groups lists
      loadSuggestedGroups();
      loadMyGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to join group'
      );
    }
  };

  const handleLeaveGroup = async (groupId: number, groupName: string) => {
    if (!confirm(`Are you sure you want to leave "${groupName}"?`)) {
      return;
    }

    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }
      
      if (!token) {
        toast.error('Please log in to leave a group');
        return;
      }

      await leaveGroup(groupId, token);
      toast.success(`Successfully left ${groupName}`);
      
      // Refresh the groups lists
      loadMyGroups();
      loadSuggestedGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to leave group'
      );
    }
  };

  const getGroupInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    loadSuggestedGroups();
    loadMyGroups();
  }, [loadSuggestedGroups, loadMyGroups]);

  return (
    <div className="p-2 pb-[1rem] container mx-auto flex flex-col gap-[1.5rem]">
      <div className="flex items-center justify-end ">
        <Button 
          variant="outline" 
          className="w-fit"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Group
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-[1.5rem]">
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
            {isLoadingMyGroups ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#334AFF]"></div>
                <span className="ml-2 text-sm text-gray-500">Loading your groups...</span>
              </div>
            ) : myGroups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">You haven&apos;t joined any groups yet</p>
                <p className="text-gray-400 text-xs mt-1">Join some groups to see them here!</p>
              </div>
            ) : (
              myGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-start justify-between border-b gap-x-1 py-2 group"
                >
                  <div className="flex items-start gap-2">
                    <Avatar className="w-[32px] h-[32px] object-center bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white">
                      <AvatarFallback className="bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white text-xs font-semibold">
                        {getGroupInitials(group.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="cursor-pointer">
                      <Link href={`/home/group/${group.id}`}>
                        <h2 className="font-semibold text-[#344054] text-[16px] group-hover:text-[#334AFF] group-hover:underline">
                          {group.name}
                        </h2>
                      </Link>
                      <p className="text-gray-500 text-[15px]">
                        {group.member_count !== undefined
                          ? `${group.member_count} member${group.member_count !== 1 ? 's' : ''}`
                          : group.is_public ? 'Public group' : 'Private group'}
                      </p>
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
                      <DropdownMenuItem 
                        className="rounded-none border-l-2 hover:bg-[#DBEAFF] hover:text-[#334AFF] data-[highlighted]:bg-[#DBEAFF] data-[highlighted]:text-[#334AFF] data-[highlighted]:border-l-2 data-[highlighted]:border-l-[#334AFF]"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/home/group/${group.id}`);
                          toast.success('Group link copied to clipboard!');
                        }}
                      >
                        Copy link to group
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="rounded-none border-l-2 text-red-500 hover:bg-[#DBEAFF] hover:text-red-600 data-[highlighted]:bg-[#DBEAFF] data-[highlighted]:text-red-600 data-[highlighted]:border-l-2 data-[highlighted]:border-l-[#334AFF]"
                        onClick={() => handleLeaveGroup(group.id, group.name)}
                      >
                        Leave this group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card className="w-full lg:w-[386px] gap-0 pb-0">
          <div className="px-[8px] mb-2">
            <h2 className="text-gray-700 text-[16px] font-[600]">
              Groups you might be interested in
            </h2>
          </div>
          <div className="px-[16px] flex-col flex gap-2 mt-3">
            {isLoadingGroups ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#334AFF]"></div>
                <span className="ml-2 text-sm text-gray-500">Loading groups...</span>
              </div>
            ) : suggestedGroups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No groups available</p>
              </div>
            ) : (
              suggestedGroups.map((group) => (
                <div key={group.id} className="flex items-start border-b gap-x-1 pb-2">
                  <div className="flex items-start  gap-4">
                    <Avatar className="w-[32px] h-[32px] object-center bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white">
                      <AvatarFallback className="bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white text-xs font-semibold">
                        {getGroupInitials(group.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-col flex gap-y-1">
                      <h2 className="font-semibold text-[#344054] text-[16px] hover:text-[#334AFF] hover:underline cursor-pointer">
                        {group.name}
                      </h2>
                      <p className="text-gray-500 text-[14px]">
                        {group.member_count !== undefined
                          ? `${group.member_count} member${group.member_count !== 1 ? 's' : ''}`
                          : group.is_public ? 'Public group' : 'Private group'}
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-fit"
                        onClick={() => handleJoinGroup(group.id, group.name)}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/groups">
            <Button variant="outline" className="w-full h-[52px]">
              Show all
            </Button>
          </Link>
        </Card>
      </div>
      
      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
}
