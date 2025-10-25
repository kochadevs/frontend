"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { togglePostLike } from "@/utilities/handlers/postHandler";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  timeAgo: string;
  content: string;
  image: string;
  likes: {
    count: number;
    avatars: string[];
  };
  comments: number;
  reposts: number;
  user_reaction: "like" | null;
}

interface InfluencerPostCardProps {
  post: Post;
}

const PostCard: React.FC<InfluencerPostCardProps> = ({ post }) => {
  const [userReaction, setUserReaction] = useState<"like" | null>(
    post.user_reaction
  );
  const [likesCount, setLikesCount] = useState(post.likes.count);
  const [isLiking, setIsLiking] = useState(false);
  const accessToken = useAccessToken();

  const handleLike = async () => {
    if (isLiking) return; // Prevent multiple clicks

    setIsLiking(true);
    try {
      // Get token
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to like posts.");
        return;
      }

      // Optimistically update UI
      const newReaction = userReaction === "like" ? null : "like";
      const newLikesCount =
        userReaction === "like" ? likesCount - 1 : likesCount + 1;

      setUserReaction(newReaction);
      setLikesCount(newLikesCount);

      // Make API call
      const result = await togglePostLike(post.id, userReaction, token);

      // The optimistic update should match the result, but let's be safe
      if (result !== newReaction) {
        setUserReaction(result);
        // Adjust count if needed
        if (result === "like" && newReaction !== "like") {
          setLikesCount((prev) => prev + 1);
        } else if (result !== "like" && newReaction === "like") {
          setLikesCount((prev) => prev - 1);
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setUserReaction(post.user_reaction);
      setLikesCount(post.likes.count);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to update like";
      toast.error(errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="w-[459px] h-full gap-1">
      <div className="p-[16px]">
        <header className="flex items-start justify-between">
          <div className="flex items-start gap-[16px]">
            <Avatar className="w-[40px] h-[40px] object-center">
              <AvatarImage
                src={post.author.avatar}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>ProfileIcon</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-[#344054] text-[17px]">
                {post.author.name}
              </h2>
              <p className="text-black-shade-900 text-[15px]">
                {post.author.role}
              </p>
              <span className="text-black-shade-900 text-[13px]">
                {post.timeAgo}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[16px]">
            <Button variant="ghost" className="bg-white border">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1210_3835)">
                  <path
                    d="M8.33252 10.8333C8.6904 11.3118 9.14699 11.7077 9.67131 11.9941C10.1956 12.2806 10.7754 12.4509 11.3714 12.4936C11.9674 12.5363 12.5655 12.4503 13.1253 12.2415C13.6851 12.0327 14.1935 11.7059 14.6159 11.2833L17.1159 8.78334C17.8748 7.9975 18.2948 6.94499 18.2853 5.85251C18.2758 4.76002 17.8376 3.71497 17.0651 2.94243C16.2926 2.1699 15.2475 1.7317 14.155 1.7222C13.0625 1.71271 12.01 2.13269 11.2242 2.89168L9.79086 4.31668M11.6659 9.16668C11.308 8.68824 10.8514 8.29236 10.3271 8.00589C9.80274 7.71943 9.22293 7.54908 8.62698 7.5064C8.03103 7.46372 7.43287 7.54971 6.87307 7.75853C6.31327 7.96735 5.80493 8.29412 5.38252 8.71668L2.88252 11.2167C2.12353 12.0025 1.70355 13.055 1.71305 14.1475C1.72254 15.24 2.16075 16.2851 2.93328 17.0576C3.70581 17.8301 4.75086 18.2683 5.84335 18.2778C6.93584 18.2873 7.98835 17.8673 8.77419 17.1083L10.1992 15.6833"
                    stroke="#344054"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1210_3835">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Button>

            <Button variant="ghost" className="bg-white border">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="#344054"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </header>
        <div className="h-[80px]">
          <p className="text-gray-700 text-[16px]">
            {post.content.split(" ").slice(0, 20).join(" ") +
              (post.content.split(" ").length > 20 ? "..." : "")}
          </p>
        </div>
      </div>
      <div className="relative w-full h-[222px]">
        <Image
          fill
          alt="card image"
          src={post.image}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Likes/comments summary */}
      <div className="p-[16px] flex items-center justify-between border-b mx-1.5">
        <div className="flex items-center gap-[16px]">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <div className="flex items-center gap-[16px]">
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                {post.likes.avatars.slice(0, 3).map((avatar, index) => (
                  <Avatar key={index}>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <p className="text-black-shade-900 text-[13px]">
                  {likesCount} others
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <p className="text-black-shade-900 text-[15px]">
            {post.comments} comments
          </p>
          <span className="w-[3px] h-[3px] rounded-full bg-black-shade-900"></span>
          <p className="text-black-shade-900 text-[15px]">
            {post.reposts} repost
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-[8px] flex items-center gap-[24px]">
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-transparent transition-colors"
          onClick={handleLike}
          disabled={isLiking}
        >
          {isLiking ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.73672 12.6165C3.34297 12.0962 3.125 11.4587 3.125 10.7955C3.125 9.74311 3.71328 8.74701 4.66016 8.19155C4.90392 8.04857 5.18146 7.97331 5.46406 7.97358H11.0844L10.9437 5.09311C10.9109 4.39701 11.157 3.73608 11.6352 3.23217C11.8698 2.9838 12.1529 2.78619 12.4669 2.65154C12.7809 2.5169 13.1193 2.44809 13.4609 2.44936C14.6797 2.44936 15.7578 3.26967 16.0812 4.44389L18.0945 11.733H21.125C21.5398 11.733 21.875 12.0681 21.875 12.483V21.0142C21.875 21.429 21.5398 21.7642 21.125 21.7642H7.03203C6.81641 21.7642 6.60547 21.722 6.41094 21.6376C5.29531 21.1619 4.57578 20.072 4.57578 18.8626C4.57578 18.5673 4.61797 18.2767 4.70234 17.9955C4.30859 17.4751 4.09063 16.8376 4.09063 16.1744C4.09063 15.879 4.13281 15.5884 4.21719 15.3072C3.82344 14.7869 3.60547 14.1494 3.60547 13.4861C3.61016 13.1908 3.65234 12.8978 3.73672 12.6165ZM20.1875 20.0767V13.4205H18.2891V20.0767H20.1875ZM5.27187 11.8033L5.78516 12.2486L5.45937 12.8439C5.35205 13.04 5.29639 13.2602 5.29766 13.4837C5.29766 13.8705 5.46641 14.2384 5.75703 14.4915L6.27031 14.9369L5.94453 15.5322C5.8372 15.7283 5.78155 15.9485 5.78281 16.172C5.78281 16.5587 5.95156 16.9267 6.24219 17.1798L6.75547 17.6251L6.42969 18.2205C6.32236 18.4166 6.2667 18.6367 6.26797 18.8603C6.26797 19.3853 6.57734 19.8587 7.05547 20.0744H16.7891V13.3455L14.457 4.89623C14.3969 4.67967 14.2678 4.48861 14.0893 4.35201C13.9109 4.2154 13.6927 4.14069 13.468 4.1392C13.2898 4.1392 13.1141 4.19076 12.9734 4.29623C12.7414 4.46967 12.6172 4.73217 12.6313 5.01108L12.8563 9.66108H5.4875C5.07031 9.91655 4.8125 10.3478 4.8125 10.7955C4.8125 11.1822 4.98125 11.5478 5.27187 11.8033Z"
                fill={userReaction === "like" ? "#3B82F6" : "black"}
              />
            </svg>
          )}
          <span
            className={
              userReaction === "like" ? "text-blue-500 font-medium" : ""
            }
          >
            {userReaction === "like" ? "Liked" : "Like"}
          </span>
        </Button>

        <Button variant="ghost" className="cursor-pointer hover:bg-transparent">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.5 11.6076C21.5034 12.9274 21.1951 14.2295 20.6 15.4076C19.8944 16.8193 18.8098 18.0067 17.4674 18.8369C16.1251 19.667 14.5782 20.107 13 20.1076C11.6801 20.111 10.3781 19.8026 9.2 19.2076L3.5 21.1076L5.4 15.4076C4.80493 14.2295 4.49656 12.9274 4.5 11.6076C4.50061 10.0293 4.94061 8.48242 5.77072 7.14012C6.60083 5.79782 7.78825 4.71314 9.2 4.00757C10.3781 3.4125 11.6801 3.10413 13 3.10757H13.5C15.5843 3.22256 17.553 4.10233 19.0291 5.57843C20.5052 7.05453 21.385 9.02322 21.5 11.1076V11.6076Z"
              stroke="#1D2939"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Comment
        </Button>

        <Button variant="ghost" className="cursor-pointer hover:bg-transparent">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_426_5701)">
              <path
                d="M17.5 1.10754L21.5 5.10754M21.5 5.10754L17.5 9.10754M21.5 5.10754H7.5C6.43913 5.10754 5.42172 5.52897 4.67157 6.27912C3.92143 7.02926 3.5 8.04668 3.5 9.10754V11.1075M7.5 23.1075L3.5 19.1075M3.5 19.1075L7.5 15.1075M3.5 19.1075H17.5C18.5609 19.1075 19.5783 18.6861 20.3284 17.936C21.0786 17.1858 21.5 16.1684 21.5 15.1075V13.1075"
                stroke="#1D2939"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_426_5701">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0.5 0.107544)"
                />
              </clipPath>
            </defs>
          </svg>
          Repost
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
