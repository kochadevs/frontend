"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { RefObject, useState } from "react";
import dynamic from "next/dynamic";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import DeleteCommentModal from "@/components/modals/DeleteCommentModal";

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

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

type PostCardProps = {
  post: Post;
  currentUser: User;
  activePost: string | null;
  newComment: string;
  replyingTo: { postId: string; commentId: string } | null;
  commentMedia: string | null;
  showEmojiPicker: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onToggleLikePost: (postId: string) => void;
  onToggleLikeComment: (
    postId: string,
    commentId: string,
    isReply?: boolean,
    parentCommentId?: string
  ) => void;
  onToggleShowReplies: (postId: string, commentId: string) => void;
  onSetReplyingTo: (
    value: { postId: string; commentId: string } | null
  ) => void;
  onSetActivePost: (postId: string | null) => void;
  onSetNewComment: (value: string) => void;
  onSetCommentMedia: (value: string | null) => void;
  onSetShowEmojiPicker: (value: boolean) => void;
  onHandleAddComment: (postId: string) => void;
  onHandleMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePost: (postId: string) => void;
  isLoadingComments?: boolean;
  isAddingComment?: boolean;
  onDeleteComment?: (commentId: string, postId: string) => void;
};

export default function PostCard({
  post,
  currentUser,
  activePost,
  newComment,
  replyingTo,
  commentMedia,
  showEmojiPicker,
  fileInputRef,
  onToggleLikePost,
  onToggleLikeComment,
  onToggleShowReplies,
  onSetReplyingTo,
  onSetActivePost,
  onSetNewComment,
  onSetCommentMedia,
  onSetShowEmojiPicker,
  onHandleAddComment,
  onHandleMediaUpload,
  onDeletePost,
  isLoadingComments = false,
  isAddingComment = false,
  onDeleteComment,
}: Readonly<PostCardProps>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{
    id: string;
    postId: string;
    author: string;
  } | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDeletePost(post.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCommentConfirm = async () => {
    if (!commentToDelete || !onDeleteComment) return;

    setIsDeletingComment(true);
    try {
      await onDeleteComment(commentToDelete.id, commentToDelete.postId);
    } finally {
      setIsDeletingComment(false);
      setCommentToDelete(null);
    }
  };

  const renderMedia = (media: MediaItem[], maxDisplay = 4) => {
    if (media.length === 0) return null;

    if (media.length === 1) {
      const item = media[0];
      return (
        <div className="w-full h-[430px] relative">
          {item.type === "image" ? (
            <Image
              src={item.url}
              alt="Post media"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video controls className="w-full h-full object-cover">
              <source src={item.url} type="video/mp4" />
            </video>
          )}
        </div>
      );
    }

    const displayedMedia = media.slice(0, maxDisplay);
    const remainingCount = media.length - maxDisplay;

    return (
      <div
        className={`grid gap-1 ${
          displayedMedia.length > 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {displayedMedia.map((item, index) => (
          <div
            key={index}
            className={`relative ${
              displayedMedia.length === 3 && index === 0
                ? "row-span-2 h-full"
                : "h-[215px]"
            }`}
          >
            {item.type === "image" ? (
              <Image
                src={item.url}
                alt="Post media"
                fill
                className="object-cover"
                priority={index < 2}
              />
            ) : (
              <video controls className="w-full h-full object-cover">
                <source src={item.url} type="video/mp4" />
              </video>
            )}
            {index === maxDisplay - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-[#00000042] bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderComment = (
    comment: Comment,
    isReply = false,
    parentCommentId?: string
  ) => {
    return (
      <div
        key={comment.id}
        className={`flex gap-3 mb-4 ${isReply ? "ml-10" : ""}`}
      >
        <Avatar>
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-[14px]">{comment.user.name}</p>
            </div>
            <p className="text-[14px] text-gray-800">{comment.text}</p>
            {comment.media && (
              <div className="mt-2 max-w-[200px]">
                <Image
                  src={comment.media}
                  alt="Comment media"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1">
            <button
              onClick={() =>
                onToggleLikeComment(
                  post.id,
                  comment.id,
                  isReply,
                  parentCommentId
                )
              }
              className={`text-sm ${
                comment.likedByUser
                  ? "text-blue-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              {comment.likes > 0
                ? `${comment.likes} Like${comment.likes !== 1 ? "s" : ""}`
                : "Like"}
            </button>
            {!isReply && (
              <button
                onClick={() => {
                  onSetReplyingTo({ postId: post.id, commentId: comment.id });
                  onSetActivePost(post.id);
                }}
                className="text-sm text-gray-500"
              >
                Reply
              </button>
            )}
            {!isReply && comment.replies.length > 0 && (
              <button
                onClick={() => onToggleShowReplies(post.id, comment.id)}
                className="text-sm text-gray-500"
              >
                {comment.showReplies
                  ? "Hide replies"
                  : `View replies (${comment.replies.length})`}
              </button>
            )}
            <p className="text-xs text-gray-500">{comment.timestamp}</p>
            {/* Delete button for comment owner */}
            {currentUser.id === comment.user.id && onDeleteComment && (
              <button
                onClick={() => {
                  setCommentToDelete({
                    id: comment.id,
                    postId: post.id,
                    author: comment.user.name,
                  });
                  setShowDeleteCommentModal(true);
                }}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.showReplies &&
            comment.replies.map((reply) =>
              renderComment(reply, true, comment.id)
            )}

          {/* Reply input */}
          {replyingTo?.commentId === comment.id && (
            <div className="flex gap-3 mt-4">
              <Avatar>
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  value={newComment}
                  onChange={(e) => onSetNewComment(e.target.value)}
                  placeholder={`Reply to ${comment.user.name}...`}
                  className="pr-10"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={() => onSetShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    😊
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    📷
                  </button>
                </div>
                {commentMedia && (
                  <div className="mt-2 relative">
                    <Image
                      src={commentMedia}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                    <button
                      onClick={() => onSetCommentMedia(null)}
                      className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onHandleAddComment(post.id)}
                    disabled={!newComment.trim() && !commentMedia}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-0 gap-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200 bg-white">
      <header className="p-[16px] flex items-start justify-between">
        <div className="flex items-start gap-[12px]">
          <Avatar className="w-[48px] h-[48px] object-center ring-2 ring-gray-100">
            <AvatarImage
              src={post.user.avatar}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-[#334AFF] to-[#251F99] text-white font-semibold">
              {post.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-[#1a1a1a] text-[16px] hover:text-[#334AFF] cursor-pointer transition-colors">
                {post.user.name}
              </h2>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-gray-600 text-[13px]">
                {post.timestamp}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <svg
                className="w-3 h-3 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-500 text-[12px]">Global</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01"
              />
            </svg>
          </Button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              ></div>

              {/* Dropdown Content */}
              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] py-1">
                {/* Only show delete option if current user is the post author */}
                {currentUser.id === post.user.id && (
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm transition-colors"
                    disabled={isDeleting}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Post
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  Report Post
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Post content */}
      <div className="px-[16px]">
        <p className="text-[#1a1a1a] text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {renderMedia(post.media)}

      {/* Likes/comments summary */}
      <div className="px-[16px] py-[12px] flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          {post.likes > 0 && (
            <>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-[#334AFF] rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </div>
              </div>
              <span className="text-gray-700 text-[14px] hover:underline cursor-pointer">
                {post.likes} {post.likes === 1 ? "like" : "likes"}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-gray-600 text-[14px]">
          {post.comments.reduce(
            (acc, comment) => acc + 1 + comment.replies.length,
            0
          ) > 0 && (
            <span className="hover:underline cursor-pointer">
              {post.comments.reduce(
                (acc, comment) => acc + 1 + comment.replies.length,
                0
              )}{" "}
              {post.comments.reduce(
                (acc, comment) => acc + 1 + comment.replies.length,
                0
              ) === 1
                ? "comment"
                : "comments"}
            </span>
          )}
          {post.reposts > 0 && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="hover:underline cursor-pointer">
                {post.reposts} {post.reposts === 1 ? "repost" : "reposts"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-[16px] py-[8px] flex items-center justify-around border-b border-gray-100">
        <Button
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
            post.likedByUser
              ? "text-[#334AFF] hover:bg-blue-50"
              : "text-gray-600"
          }`}
          onClick={() => onToggleLikePost(post.id)}
        >
          <svg
            className="w-5 h-5"
            fill={post.likedByUser ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span className="font-medium">Like</span>
        </Button>

        <Button
          variant="ghost"
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          onClick={() =>
            onSetActivePost(activePost === post.id ? null : post.id)
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="font-medium">Comment</span>
        </Button>

        <Button
          variant="ghost"
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          <span className="font-medium">Share</span>
        </Button>
      </div>

      {/* Comments section */}
      {activePost === post.id && (
        <div className="p-4 border-t">
          {/* Loading comments */}
          {isLoadingComments && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#334AFF]"></div>
                <span className="text-gray-600 text-sm">
                  Loading comments...
                </span>
              </div>
            </div>
          )}

          {/* Existing comments */}
          {!isLoadingComments &&
            post.comments.map((comment) => renderComment(comment))}

          {/* No comments message */}
          {!isLoadingComments && post.comments.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}

          {/* New comment input */}
          {!replyingTo && (
            <div className="flex gap-3 mt-4">
              <Avatar>
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  value={newComment}
                  onChange={(e) => onSetNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="pr-10"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={() => onSetShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    😊
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    📷
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onHandleMediaUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {showEmojiPicker && (
                  <div className="absolute right-0 bottom-12 z-10">
                    <EmojiPicker
                      onEmojiClick={(emojiData: { emoji: string }) => {
                        onSetNewComment(newComment + emojiData.emoji);
                        onSetShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
                {commentMedia && (
                  <div className="mt-2 relative">
                    <Image
                      src={commentMedia}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                    <button
                      onClick={() => onSetCommentMedia(null)}
                      className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                )}
                <Button
                  className="mt-2"
                  onClick={() => onHandleAddComment(post.id)}
                  disabled={
                    (!newComment.trim() && !commentMedia) || isAddingComment
                  }
                >
                  {isAddingComment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </div>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Delete Comment Modal */}
      <DeleteCommentModal
        isOpen={showDeleteCommentModal}
        onClose={() => {
          setShowDeleteCommentModal(false);
          setCommentToDelete(null);
        }}
        onConfirm={handleDeleteCommentConfirm}
        isLoading={isDeletingComment}
        commentAuthor={commentToDelete?.author}
      />
    </Card>
  );
}
