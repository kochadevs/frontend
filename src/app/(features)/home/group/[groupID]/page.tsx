"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import GroupPostContent from "./components/GroupPostsContent";
import MemberCard from "./components/MemberCard";
import MembersView from "./components/MembersView";
import { useParams } from "next/navigation";
import { GroupMember } from "@/interface/groupMembers";
import { fetchGroupMembers } from "@/utilities/groupHandler";
import { useAuthStore } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";

export default function Group() {
  const params = useParams();
  const groupId = parseInt(params.groupID as string, 10);
  const [activeTab, setActiveTab] = useState("live feed");
  const [previewMember, setPreviewMember] = useState<GroupMember | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const loadPreviewMember = async () => {
      try {
        setIsLoadingPreview(true);
        
        // Try to get token from store first, then from cookies as fallback
        let token = accessToken;
        if (!token) {
          const { accessToken: cookieToken } = tokenUtils.getTokens();
          token = cookieToken;
        }
        
        if (!token) {
          return;
        }

        const membersData = await fetchGroupMembers(groupId, token);
        // Show first member as preview
        if (membersData.length > 0) {
          setPreviewMember(membersData[0]);
        }
      } catch (error) {
        console.error('Error fetching preview member:', error);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    if (groupId) {
      loadPreviewMember();
    }
  }, [groupId, accessToken]);
  return (
    <div className="flex-col flex gap-y-4">
      <header className="flex items-center justify-center h-[232px] bg-linear-65 from-[#8E2DE2] to-[#4A00E0]">
        <div className="h-[129px] flex items-center gap-x-3">
          <div className="h-full w-[129px] relative">
            <Image
              src="/asset/home/group-page/figma icon.png"
              fill
              alt="group image"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-[30px] font-[600] text-white">
            Figma Product Community
          </h1>
        </div>
      </header>

      <div className="container m-auto px-[16px]">
        <div className=" p-[16px] flex-col flex items-start gap-y-6">
          <h2 className="text-[#344054] font-[600]">Figma Product Community</h2>
          <div className="w-[186px] bg-[#F2F4F7] rounded-[8px] h-[44px] flex justify-between">
            <Button
              onClick={() => setActiveTab("live feed")}
              variant="ghost"
              className={`h-full ${
                activeTab == "live feed"
                  ? "bg-white hover:bg-white"
                  : "bg-transparent hover:bg-transparent"
              }`}
            >
              Live Feed
            </Button>
            <Button
              onClick={() => setActiveTab("members")}
              variant="ghost"
              className={`h-full hover:bg-white ${
                activeTab == "members"
                  ? "bg-white hover:bg-white"
                  : "bg-transparent hover:bg-transparent"
              }`}
            >
              Members
            </Button>
          </div>
        </div>

        {activeTab == "live feed" ? (
          <div className="flex flex-col lg:flex-row items-start justify-between gap-[1.5rem] pb-[1rem]">
            <div className="flex-1 py-0 overflow-hidden gap-2 w-full">
              <GroupPostContent />
            </div>
            <div className="w-full lg:w-[386px] flex-col flex gap-y-5">
              <Card className="p-0 overflow-hidden gap-1">
                <div className="w-full h-[63px] flex items-center p-[16px] border-b">
                  <h3 className="font-[600] text-[20px] text-[#475467]">
                    About
                  </h3>
                </div>
                <div className="p-[16px]">
                  <p className="text-[#344054]">
                    Welcome to our Figma Group! We are a community of designers,
                    developers, and creative professionals dedicated to
                    collaborating, sharing knowledge, and mastering Figma.
                    Whether you&apos;re new to design or an experienced user,
                    this group provides a space for learning, feedback, and{" "}
                  </p>
                </div>
              </Card>
              <div className="w-full">
                <div className="w-full h-[63px] flex items-center justify-between">
                  <h3 className="font-[600] text-[20px] text-[#475467]">
                    Members
                  </h3>

                  <Button
                    variant="ghost"
                    className="underline text-[#334AFF] hover:text-[#334AFF]"
                    onClick={() => setActiveTab("members")}
                  >
                    View all
                  </Button>
                </div>
                <MemberCard member={previewMember || undefined} isLoading={isLoadingPreview} />
              </div>
            </div>
          </div>
        ) : (
          <MembersView groupId={groupId} />
        )}
      </div>
    </div>
  );
}
