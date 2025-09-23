"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCard from "../../../(components)/PostCard";
import StartAPost from "../../../(components)/StartAPost";
import {
  fetchFeed,
  deletePost,
  addComment,
  fetchComments,
  deleteComment,
  reactToComment,
  unreactToComment,
  unreactToPost,
  reactToPost,
} from "@/utilities/postHandler";
import { Post as APIPost, ApiComment } from "@/interface/posts";
import { useUser, useAccessToken, useAuthActions } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
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

export default function GroupPostContent({ groupId }: Readonly<GroupPostContentProps>) {
  const user = useUser();
  const accessToken = useAccessToken();
  const { initializeAuth } = useAuthActions();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Initialize auth on component mount
  useEffect(() => {
    initializeAuth();
    setIsAuthInitialized(true);
  }, [initializeAuth]);

  const currentUser: User = {
    id: user?.id?.toString() || "current-user",
    name:
      user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.first_name || "Current User",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Transform API post to local Post format
  const transformApiPost = (apiPost: APIPost): Post => {
    // Generate a default avatar if profile_pic is empty
    const getAvatarUrl = (profilePic: string, firstName: string) => {
      if (profilePic && profilePic.trim() !== "") {
        return profilePic;
      }
      // Generate a placeholder avatar based on first letter of name
      const initial = firstName?.charAt(0).toUpperCase() || "U";
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
        return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
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
        role:
          apiPost.user.user_type === "mentee"
            ? "Mentee"
            : apiPost.user.user_type === "mentor"
            ? "Mentor"
            : apiPost.user.role_of_interest?.[0]?.name || "Professional",
      },
      content: apiPost.content,
      media: [], // We'll need to handle media in the future
      likes: apiPost.reactions_count,
      likedByUser: apiPost.user_reaction === 'like', // Track user's like status from API
      comments: [], // We'll need to load comments separately
      reposts: 0, // Not available in current API
      timestamp: formatTimeAgo(apiPost.date_created),
    };
  };

  // Transform API comment to local Comment format
  const transformApiComment = (apiComment: ApiComment): Comment => {
    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    };

    // Generate a default avatar if profile_pic is empty
    const getAvatarUrl = (profilePic: string, firstName: string) => {
      if (profilePic && profilePic.trim() !== "") {
        return profilePic;
      }
      // Generate a placeholder avatar based on first letter of name
      const initial = firstName?.charAt(0).toUpperCase() || "U";
      return `https://ui-avatars.com/api/?name=${initial}&background=334AFF&color=fff&size=128`;
    };

    return {
      id: apiComment.id.toString(),
      user: {
        id: apiComment.user.id.toString(),
        name: `${apiComment.user.first_name} ${apiComment.user.last_name}`.trim(),
        avatar: getAvatarUrl(
          apiComment.user.profile_pic,
          apiComment.user.first_name
        ),
        role:
          apiComment.user.user_type === "mentee"
            ? "Mentee"
            : apiComment.user.user_type === "mentor"
            ? "Mentor"
            : apiComment.user.role_of_interest?.[0]?.name || "Professional",
      },
      text: apiComment.content,
      timestamp: formatTimeAgo(apiComment.date_created),
      likes: apiComment.reactions_count,
      likedByUser: false, // API doesn't provide user reaction for comments yet
      replies: [], // We'll handle nested comments separately
      showReplies: false,
    };
  };

  // Load posts from API
  const loadPosts = useCallback(
    async (cursor?: string) => {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
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
          token
        );

        const transformedPosts = response.items.map(transformApiPost);

        if (cursor) {
          // Appending more posts
          setPosts((prev) => [...prev, ...transformedPosts]);
        } else {
          // Initial load or refresh
          setPosts(transformedPosts);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load posts"
        );
      } finally {
        setIsLoadingPosts(false);
      }
    },
    [groupId, accessToken]
  );

  // Load comments for a specific post
  const loadCommentsForPost = async (postId: string) => {
    if (!accessToken) {
      toast.error("Please sign in to view comments.");
      return;
    }

    setLoadingComments((prev) => new Set(prev).add(postId));

    try {
      const response = await fetchComments(
        postId,
        { limit: 50 }, // Load up to 50 comments
        accessToken
      );

      const transformedComments = response.items.map(transformApiComment);

      // Update the specific post with comments
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: transformedComments } : post
        )
      );
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load comments"
      );
    } finally {
      setLoadingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // Load posts on component mount and when groupId changes, but only after auth is initialized
  useEffect(() => {
    if (isAuthInitialized) {
      setIsLoadingPosts(true);
      loadPosts();
    }
  }, [loadPosts, isAuthInitialized]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    postId: string;
    commentId: string;
  } | null>(null);
  const [commentMedia, setCommentMedia] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activePost, setActivePost] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState<Set<string>>(
    new Set()
  );
  const [addingComment, setAddingComment] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;
    if (!accessToken) {
      toast.error("Please sign in to add comments.");
      return;
    }

    setAddingComment((prev) => new Set(prev).add(postId));

    try {
      const payload = {
        content: newComment,
        ...(replyingTo && {
          parent_comment_id: parseInt(replyingTo.commentId),
        }),
      };

      const newApiComment = await addComment(postId, payload, accessToken);
      const newCommentObj = transformApiComment(newApiComment);

      // Update the posts state with the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            if (replyingTo) {
              // Handle replies - for now, add to the parent comment's replies
              const updatedComments = post.comments.map((comment) => {
                if (comment.id === replyingTo.commentId) {
                  return {
                    ...comment,
                    replies: [...comment.replies, newCommentObj],
                  };
                }
                return comment;
              });
              return { ...post, comments: updatedComments };
            } else {
              // Add as top-level comment
              return {
                ...post,
                comments: [...post.comments, newCommentObj],
              };
            }
          }
          return post;
        })
      );

      // Clear the input
      setNewComment("");
      setCommentMedia(null);
      setReplyingTo(null);

      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add comment"
      );
    } finally {
      setAddingComment((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!accessToken) {
      toast.error("Please sign in to delete comments.");
      return;
    }

    try {
      await deleteComment(commentId, accessToken);

      // Remove comment from local state
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            };
          }
          return post;
        })
      );

      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete comment"
      );
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId: string) => {
    if (!accessToken) {
      toast.error("Please sign in to delete posts.");
      return;
    }

    try {
      await deletePost(postId, accessToken);

      // Remove the post from the local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    }
  };

  // Handle clicking on a post to show/hide comments
  const handlePostClick = (postId: string | null) => {
    const newActivePost = activePost === postId ? null : postId;
    setActivePost(newActivePost);

    // Load comments when opening a post
    if (
      newActivePost &&
      !posts.find((p) => p.id === newActivePost)?.comments.length
    ) {
      loadCommentsForPost(newActivePost);
    }
  };

  const toggleLikePost = async (postId: string) => {
    // Try to get token from store first, then from cookies as fallback
    let token = accessToken;
    if (!token) {
      const { accessToken: cookieToken } = tokenUtils.getTokens();
      token = cookieToken;
    }

    if (!token) {
      toast.error("Please sign in to react to posts.");
      return;
    }

    // Find the current post to check its liked state
    const currentPost = posts.find((post) => post.id === postId);
    if (!currentPost) return;

    // Optimistically update the UI
    const isCurrentlyLiked = currentPost.likedByUser;
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
            likedByUser: !isCurrentlyLiked,
          };
        }
        return post;
      })
    );

    try {
      if (isCurrentlyLiked) {
        // Unlike the post
        await unreactToPost(postId, { type: "like" }, token);
      } else {
        // Like the post
        await reactToPost(postId, { type: "like" }, token);
      }
    } catch (error) {
      // Revert the optimistic update on error
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: isCurrentlyLiked ? post.likes + 1 : post.likes - 1,
              likedByUser: isCurrentlyLiked,
            };
          }
          return post;
        })
      );

      console.error("Error toggling post like:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update reaction"
      );
    }
  };

  const toggleLikeComment = async (
    postId: string,
    commentId: string,
    isReply = false,
    parentCommentId?: string
  ) => {
    // Try to get token from store first, then from cookies as fallback
    let token = accessToken;
    if (!token) {
      const { accessToken: cookieToken } = tokenUtils.getTokens();
      token = cookieToken;
    }

    if (!token) {
      toast.error("Please sign in to react to comments.");
      return;
    }

    // Find the current comment to check its liked state
    let currentComment;
    const currentPost = posts.find((post) => post.id === postId);
    if (!currentPost) return;

    if (isReply && parentCommentId) {
      const parentComment = currentPost.comments.find(
        (c) => c.id === parentCommentId
      );
      currentComment = parentComment?.replies.find((r) => r.id === commentId);
    } else {
      currentComment = currentPost.comments.find((c) => c.id === commentId);
    }

    if (!currentComment) return;

    const isCurrentlyLiked = currentComment.likedByUser;

    // Optimistically update the UI
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          if (isReply && parentCommentId) {
            // Handle reply like
            const updatedComments = post.comments.map((comment) => {
              if (comment.id === parentCommentId) {
                const updatedReplies = comment.replies.map((reply) => {
                  if (reply.id === commentId) {
                    return {
                      ...reply,
                      likes: isCurrentlyLiked
                        ? reply.likes - 1
                        : reply.likes + 1,
                      likedByUser: !isCurrentlyLiked,
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
                  likes: isCurrentlyLiked
                    ? comment.likes - 1
                    : comment.likes + 1,
                  likedByUser: !isCurrentlyLiked,
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

    try {
      if (isCurrentlyLiked) {
        // Unlike the comment
        await unreactToComment(commentId, { type: "like" }, token);
      } else {
        // Like the comment
        await reactToComment(commentId, { type: "like" }, token);
      }
    } catch (error) {
      // Revert the optimistic update on error
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            if (isReply && parentCommentId) {
              // Revert reply like
              const updatedComments = post.comments.map((comment) => {
                if (comment.id === parentCommentId) {
                  const updatedReplies = comment.replies.map((reply) => {
                    if (reply.id === commentId) {
                      return {
                        ...reply,
                        likes: isCurrentlyLiked
                          ? reply.likes + 1
                          : reply.likes - 1,
                        likedByUser: isCurrentlyLiked,
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
              // Revert top-level comment like
              const updatedComments = post.comments.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    likes: isCurrentlyLiked
                      ? comment.likes + 1
                      : comment.likes - 1,
                    likedByUser: isCurrentlyLiked,
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

      toast.error(
        error instanceof Error ? error.message : "Failed to update reaction"
      );
    }
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
          <StartAPost groupId={groupId} onPostCreated={handlePostCreated} />
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
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 text-sm">
                Be the first to share something with the group!
              </p>
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
          onSetActivePost={handlePostClick}
          onSetNewComment={setNewComment}
          onSetCommentMedia={setCommentMedia}
          onSetShowEmojiPicker={setShowEmojiPicker}
          onHandleAddComment={handleAddComment}
          onHandleMediaUpload={handleMediaUpload}
          onDeletePost={handleDeletePost}
          isLoadingComments={loadingComments.has(post.id)}
          isAddingComment={addingComment.has(post.id)}
          onDeleteComment={handleDeleteComment}
        />
      ))}
    </div>
  );
}
