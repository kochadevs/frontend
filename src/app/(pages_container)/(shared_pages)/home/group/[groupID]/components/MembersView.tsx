"use client";

import { useState, useEffect } from "react";
import MemberCard from "./MemberCard";
import { GroupMember } from "@/interface/groupMembers";
import { fetchGroupMembers } from "@/utilities/handlers/groupHandler";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";

interface MembersViewProps {
  groupId: number;
}

export default function MembersView({ groupId }: Readonly<MembersViewProps>) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken = useAccessToken();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true);
        
        // Try to get token from store first, then from cookies as fallback
        let token = accessToken;
        if (!token) {
          const { accessToken: cookieToken } = tokenUtils.getTokens();
          token = cookieToken;
        }
        
        if (!token) {
          toast.error('Please log in to view group members');
          return;
        }

        const membersData = await fetchGroupMembers(groupId, token);
        setMembers(membersData);
        setFilteredMembers(membersData);
      } catch (error) {
        console.error('Error fetching group members:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to load group members'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      loadMembers();
    }
  }, [groupId, accessToken]);

  useEffect(() => {
    // Filter members based on search query
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((member) =>
        `${member.first_name} ${member.last_name || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.user_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);
  return (
    <div className="flex flex-col gap-y-4 px-[16px]">
      <header className="flex items-center justify-between h-[44px]">
        <h2 className="text-[#344054] font-[600]">
          {isLoading ? 'Loading...' : `${filteredMembers.length} Member${filteredMembers.length !== 1 ? 's' : ''}`}
        </h2>

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
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#334AFF] focus:border-transparent"
          />
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading state
          [...Array(6)].map((_, index) => (
            <MemberCard key={`loading-${index}`} isLoading={true} />
          ))
        ) : filteredMembers.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No members found' : 'No members in this group'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No members match "${searchQuery}". Try different keywords.`
                : 'This group doesn\'t have any members yet.'}
            </p>
          </div>
        ) : (
          // Members list
          filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
        )}
      </main>
    </div>
  );
}
