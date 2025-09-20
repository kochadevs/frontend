"use client";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCard from "../../../(components)/PostCard";
import StartAPost from "../../../(components)/StartAPost";
import { fetchFeed } from "@/utilities/postHandler";
import { Post as APIPost } from "@/interface/posts";
import { useUser, useAccessToken } from "@/store/authStore";
import { toast } from "react-hot-toast";


// Dynamically import EmojiPicker to avoid SSR issues

type MediaItem = {
  type: "image" | "video";
  url: string;
};

type User = {
  id: string;
  name: string;
  avatar: string;
  role?: string;
};

type Comment = {
  id: string;
  user: User;
  text: string;
  media?: string;
  timestamp: string;
  likes: number;
  likedByUser: boolean;
  replies: Comment[];
  showReplies: boolean;
};

type Post = {
  id: string;
  user: User;
  content: string;
  media: MediaItem[];
  likes: number;
  likedByUser: boolean;
  comments: Comment[];
  reposts: number;
  timestamp: string;
};

interface GroupPostContentProps {
  groupId: string;
}

export default function GroupPostContent({ groupId }: GroupPostContentProps) {
  const user = useUser();
  const accessToken = useAccessToken();
  
  const currentUser: User = {
    id: user?.id?.toString() || "current-user",
    name: user?.first_name && user?.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name || "Current User",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Transform API post to local Post format
  const transformApiPost = (apiPost: APIPost): Post => {
    // Generate a default avatar if profile_pic is empty
    const getAvatarUrl = (profilePic: string, firstName: string) => {
      if (profilePic && profilePic.trim() !== '') {
        return profilePic;
      }
      // Generate a placeholder avatar based on first letter of name
      const initial = firstName?.charAt(0).toUpperCase() || 'U';
      return `https://ui-avatars.com/api/?name=${initial}&background=334AFF&color=fff&size=128`;
    };

    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    };

    return {
      id: apiPost.id.toString(),
      user: {
        id: apiPost.user.id.toString(),
        name: `${apiPost.user.first_name} ${apiPost.user.last_name}`.trim(),
        avatar: getAvatarUrl(apiPost.user.profile_pic, apiPost.user.first_name),
        role: apiPost.user.user_type === 'mentee' ? 'Mentee' : 
              apiPost.user.user_type === 'mentor' ? 'Mentor' : 
              apiPost.user.role_of_interest?.[0]?.name || 'Professional',
      },
      content: apiPost.content,
      media: [], // We'll need to handle media in the future
      likes: apiPost.reactions_count,
      likedByUser: false, // We'll need to track this from user data
      comments: [], // We'll need to load comments separately
      reposts: 0, // Not available in current API
      timestamp: formatTimeAgo(apiPost.date_created),
    };
  };

  // Load posts from API
  const loadPosts = async (cursor?: string) => {
    if (!accessToken) {
      toast.error("Please sign in to view posts.");
      setIsLoadingPosts(false);
      return;
    }

    try {
      const response = await fetchFeed(
        {
          limit: 20,
          group_id: parseInt(groupId),
          ...(cursor && { cursor }),
        },
        accessToken
      );

      const transformedPosts = response.items.map(transformApiPost);
      
      if (cursor) {
        // Appending more posts
        setPosts(prev => [...prev, ...transformedPosts]);
      } else {
        // Initial load or refresh
        setPosts(transformedPosts);
      }
      
      setNextCursor(response.next_cursor || null);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load posts");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Load posts on component mount and when groupId changes
  useEffect(() => {
    setIsLoadingPosts(true);
    loadPosts();
  }, [groupId, accessToken]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    postId: string;
    commentId: string;
  } | null>(null);
  const [commentMedia, setCommentMedia] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activePost, setActivePost] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddComment = (postId: string) => {
    if (!newComment.trim() && !commentMedia) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newCommentObj: Comment = {
            id: `c${Date.now()}`,
            user: currentUser,
            text: newComment,
            timestamp: "Just now",
            likes: 0,
            likedByUser: false,
            replies: [],
            showReplies: false,
          };

          if (commentMedia) {
            newCommentObj.media = commentMedia;
          }

          // If replying to a comment
          if (replyingTo) {
            const updatedComments = post.comments.map((comment) => {
              if (comment.id === replyingTo.commentId) {
                return {
                  ...comment,
                  replies: [...comment.replies, newCommentObj],
                };
              }
              return comment;
            });

            return {
              ...post,
              comments: updatedComments,
            };
          }

          // If adding a top-level comment
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
          };
        }
        return post;
      })
    );

    setNewComment("");
    setCommentMedia(null);
    setReplyingTo(null);
  };

  const toggleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
            likedByUser: !post.likedByUser,
          };
        }
        return post;
      })
    );
  };

  const toggleLikeComment = (
    postId: string,
    commentId: string,
    isReply = false,
    parentCommentId?: string
  ) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (isReply && parentCommentId) {
            // Handle reply like
            const updatedComments = post.comments.map((comment) => {
              if (comment.id === parentCommentId) {
                const updatedReplies = comment.replies.map((reply) => {
                  if (reply.id === commentId) {
                    return {
                      ...reply,
                      likes: reply.likedByUser
                        ? reply.likes - 1
                        : reply.likes + 1,
                      likedByUser: !reply.likedByUser,
                    };
                  }
                  return reply;
                });
                return {
                  ...comment,
                  replies: updatedReplies,
                };
              }
              return comment;
            });
            return {
              ...post,
              comments: updatedComments,
            };
          } else {
            // Handle top-level comment like
            const updatedComments = post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: comment.likedByUser
                    ? comment.likes - 1
                    : comment.likes + 1,
                  likedByUser: !comment.likedByUser,
                };
              }
              return comment;
            });
            return {
              ...post,
              comments: updatedComments,
            };
          }
        }
        return post;
      })
    );
  };

  const toggleShowReplies = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                showReplies: !comment.showReplies,
              };
            }
            return comment;
          });
          return {
            ...post,
            comments: updatedComments,
          };
        }
        return post;
      })
    );
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCommentMedia(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostCreated = () => {
    // Refresh posts after a new post is created
    console.log('New post created, refreshing posts...');
    setIsLoadingPosts(true);
    loadPosts();
  };

  return (
    <div className="w-full flex flex-col gap-y-[1.5rem]">
      {/* Post creation input */}
      <div className="bg-white p-[16px] border rounded-[8px] flex items-center gap-[16px]">
        <Avatar className="w-[55px] h-[55px] object-center">
          <AvatarImage
            src={currentUser.avatar}
            className="w-full h-full object-cover"
          />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <StartAPost 
            groupId={groupId}
            onPostCreated={handlePostCreated}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoadingPosts && posts.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#334AFF]"></div>
            <p className="text-gray-600 text-sm">Loading posts...</p>
          </div>
        </div>
      )}

      {/* No posts message */}
      {!isLoadingPosts && posts.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 text-sm">Be the first to share something with the group!</p>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          activePost={activePost}
          newComment={newComment}
          replyingTo={replyingTo}
          commentMedia={commentMedia}
          showEmojiPicker={showEmojiPicker}
          fileInputRef={fileInputRef}
          onToggleLikePost={toggleLikePost}
          onToggleLikeComment={toggleLikeComment}
          onToggleShowReplies={toggleShowReplies}
          onSetReplyingTo={setReplyingTo}
          onSetActivePost={setActivePost}
          onSetNewComment={setNewComment}
          onSetCommentMedia={setCommentMedia}
          onSetShowEmojiPicker={setShowEmojiPicker}
          onHandleAddComment={handleAddComment}
          onHandleMediaUpload={handleMediaUpload}
        />
      ))}
    </div>
  );
}
