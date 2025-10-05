"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { createPost } from "@/utilities/postHandler";
import { CreatePostPayload } from "@/interface/posts";
import { useUser, useAccessToken } from "@/store/authStore";

interface StartAPostProps {
  onPostCreated?: () => void;
  groupId?: string;
}

export default function StartAPost({ onPostCreated, groupId }: Readonly<StartAPostProps>) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();
  const accessToken = useAccessToken();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please write something before posting.");
      return;
    }

    if (!accessToken) {
      toast.error("Please sign in to create a post.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload: CreatePostPayload = {
        content: content.trim(),
        ...(groupId && { group_id: parseInt(groupId, 10) }),
      };

      await createPost(payload, accessToken);
      
      toast.success("Your post has been created successfully!");
      
      setContent("");
      setIsOpen(false);
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-[54px] text-[16px] border bg-white w-full flex items-center justify-start text-gray-300 hover:bg-transparent hover:text-gray-300"
          >
            Start a post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[595px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="border-b pb-[1rem]">
              <DialogTitle className="text-[#344054]">Start a post</DialogTitle>
            </DialogHeader>
          <div className="flex-col flex gap-3">
            <div className="flex items-center gap-[16px]">
              <Avatar className="w-[40px] h-[40px] object-center">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>

              <h2 className="text-gray-shade-700 text-[17px] font-[700]">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user?.first_name || "User"}
              </h2>
            </div>

            <div className="grid w-full gap-3 mb-2">
              <Label
                htmlFor="message"
                className="text-[15px] text-gray-shade-700 font-[600]"
              >
                Message
              </Label>
              <div className="flex-col flex gap-y-2 border rounded-[8px] p-1">
                <Textarea
                  placeholder="Type your message here."
                  id="message"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border-0 border-transparent shadow-none min-h-[130px] focus:!ring-0"
                  disabled={isSubmitting}
                />
                {/* icons */}
                <div className="flex items-center ">
                  <Button
                    variant="ghost"
                    className="bg-transparent hover:bg-transparent w-[32px] h-[32px] p-0"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M9 9H9.01M15 9H15.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                        stroke="#667085"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>

                  <Button
                    variant="ghost"
                    className="bg-transparent hover:bg-transparent w-[32px] h-[32px] p-0"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21ZM5 21L16 10L21 15M10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5Z"
                        stroke="#667085"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>

                  <Button
                    variant="ghost"
                    className="bg-transparent hover:bg-transparent w-[32px] h-[32px] p-0"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8M14 2L20 8M14 2V8H20M16 13H8M16 17H8M10 9H8"
                        stroke="#667085"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="bg-[#334AFF] hover:bg-[#334AFF]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
}
