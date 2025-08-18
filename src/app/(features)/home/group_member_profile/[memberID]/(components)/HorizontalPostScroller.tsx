"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PostCard from "@/components/common/PostCard";

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
}

interface HorizontalPostScrollerProps {
  posts: Post[];
}

const HorizontalPostScroller: React.FC<HorizontalPostScrollerProps> = ({
  posts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Left arrow button */}
      <Button
        variant="outline"
        className="absolute w-[44px] h-[44px] rounded-full shadow-md -left-[20px] top-1/2 transform -translate-y-1/2"
        onClick={scrollLeft}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Right arrow button */}
      <Button
        variant="outline"
        className="absolute w-[44px] h-[44px] rounded-full shadow-md -right-[20px] top-1/2 transform -translate-y-1/2"
        onClick={scrollRight}
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default HorizontalPostScroller;
