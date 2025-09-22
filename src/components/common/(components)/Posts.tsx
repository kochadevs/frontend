"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import HorizontalPostScroller from "./HorizontalPostScroller";
import { Card } from "@/components/ui/card";
import { fetchFeed } from "@/utilities/postHandler";
import { Post as ApiPost } from "@/interface/posts";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Mentor } from "@/interface/mentors";

// Transform API post to card format
const transformApiPostToCard = (apiPost: ApiPost): any => {
  const timeAgo = new Date(apiPost.date_created).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  return {
    id: apiPost.id.toString(),
    author: {
      name: `${apiPost.user.first_name} ${apiPost.user.last_name || ''}`.trim(),
      role: apiPost.user.new_role_values?.[0]?.name || "Professional",
      avatar: apiPost.user.profile_pic || "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    timeAgo,
    content: apiPost.content,
    image: "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3xxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Default image since API might not have images
    likes: {
      count: apiPost.reactions_count || 0,
      avatars: [
        "https://github.com/shadcn.png",
        "https://github.com/leerob.png",
        "https://github.com/evilrabbit.png",
      ],
    },
    comments: apiPost.comments_count || 0,
    reposts: 0, // API doesn't seem to have repost count
    user_reaction: apiPost.user_reaction
  };
};

type PostsProps = {
  mentor?: Mentor | null;
};

export default function Posts({ mentor }: PostsProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAccessToken();

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get token
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }
      
      if (!token) {
        setError("Please sign in to view posts.");
        return;
      }

      // Fetch posts from API - limit to 10 for the profile view
      const feedResponse = await fetchFeed({ limit: 10 }, token);
      
      // Transform API posts to card format
      const transformedPosts = feedResponse.items.map(transformApiPostToCard);
      
      // If we're on a mentor profile, filter posts by that mentor (optional)
      // For now, we'll show all posts but you could filter by mentor.id if needed
      setPosts(transformedPosts);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load posts";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [accessToken]);

  return (
    <Card className="gap-0 p-0">
      <header className="flex items-center h-[62px] border-b px-6">
        <h2 className="text-gray-600 font-[600] text-[20px]">Post(s)</h2>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
            <p className="text-gray-600">Loading posts...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={loadPosts}
              variant="outline"
              className="border-[#334AFF] text-[#334AFF] hover:bg-[#334AFF] hover:text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No posts available.</p>
            <p className="text-sm text-gray-500">Check back later for new posts!</p>
          </div>
        </div>
      )}

      {/* Posts List */}
      {!isLoading && !error && posts.length > 0 && (
        <>
          <HorizontalPostScroller posts={posts} />
          <Button
            variant="ghost"
            className="border-y h-[52px] w-full rounded-0 flex items-center justify-center text-gray-700 mt-[2rem]"
          >
            Show all posts
          </Button>
        </>
      )}
    </Card>
  );
}
