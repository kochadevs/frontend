"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { RefObject } from "react";
import dynamic from "next/dynamic";

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
}: Readonly<PostCardProps>) {
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
            <p className="font-medium">{comment.user.name}</p>
            <p>{comment.text}</p>
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
    <Card className="p-0 gap-1 overflow-hidden">
      <header className="p-[16px] flex items-start justify-between">
        <div className="flex items-start gap-[16px]">
          <Avatar className="w-[40px] h-[40px] object-center">
            <AvatarImage
              src={post.user.avatar}
              className="w-full h-full object-cover"
            />
            <AvatarFallback>ProfileIcon</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-[#344054] text-[17px]">
              {post.user.name}
            </h2>
            {post.user.role && (
              <p className="text-black-shade-900 text-[15px]">
                {post.user.role}
              </p>
            )}
            <span className="text-black-shade-900 text-[13px]">
              {post.timestamp}
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

      {/* Post content */}
      <div className="p-[16px]">
        <p>{post.content}</p>
      </div>

      {/* Media */}
      {renderMedia(post.media)}

      {/* Likes/comments summary */}
      <div className="p-[16px] flex items-center justify-between border-b mx-1.5">
        <div className="flex items-center gap-[16px]">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <div className="flex items-center gap-[16px]">
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/leerob.png"
                    alt="@leerob"
                  />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-black-shade-900 text-[15px]">
                  Jane Cooper and {post.likes - 3} others
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <p className="text-black-shade-900 text-[15px]">
            {post.comments.reduce(
              (acc, comment) => acc + 1 + comment.replies.length,
              0
            )}{" "}
            comments
          </p>
          <span className="w-[3px] h-[3px] rounded-full bg-black-shade-900"></span>
          <p className="text-black-shade-900 text-[15px]">
            {post.reposts} repost
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-[16px] flex items-center gap-[24px]">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => onToggleLikePost(post.id)}
        >
          <span className={post.likedByUser ? "text-blue-500" : ""}>Like</span>
        </Button>

        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() =>
            onSetActivePost(activePost === post.id ? null : post.id)
          }
        >
          Comment
        </Button>

        <Button variant="ghost" className="cursor-pointer">
          Repost
        </Button>
      </div>

      {/* Comments section */}
      {activePost === post.id && (
        <div className="p-4 border-t">
          {/* Existing comments */}
          {post.comments.map((comment) => renderComment(comment))}

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
                  disabled={!newComment.trim() && !commentMedia}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
