"use client";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCard from "../../../(components)/PostCard";
import StartAPost from "../../../(components)/StartAPost";


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

export default function GroupPostContent() {
  const currentUser: User = {
    id: "current-user",
    name: "Current User",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: {
        id: "user-1",
        name: "Phoenix Baker",
        avatar:
          "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        role: "Fashion Influencer",
      },
      content:
        "😔 I've been dealing with imposter syndrome at work, and it's impacting my confidence. Have you ever experienced this? How did you overcome it? 🌟...more",
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1755090030899-800ee2e4aa06?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      likes: 47,
      likedByUser: false,
      comments: [
        {
          id: "c1",
          user: {
            id: "user-2",
            name: "Jane Cooper",
            avatar: "https://github.com/shadcn.png",
          },
          text: "Amazing collaboration!",
          timestamp: "2h ago",
          likes: 5,
          likedByUser: false,
          replies: [
            {
              id: "c1r1",
              user: {
                id: "user-3",
                name: "Alex Morgan",
                avatar: "https://github.com/vercel.png",
              },
              text: "I agree! The photos look stunning.",
              timestamp: "1h ago",
              likes: 2,
              likedByUser: false,
              replies: [],
              showReplies: false,
            },
          ],
          showReplies: false,
        },
      ],
      reposts: 2,
      timestamp: "14h ago",
    },
  ]);

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
          <StartAPost />
        </div>
      </div>

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
