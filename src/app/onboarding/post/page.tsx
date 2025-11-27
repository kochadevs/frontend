/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useUser, useAccessToken } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Edit3, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import NavigationBar from "@/components/common/NavigationBar";
import Loader from "@/components/common/Loader";
import { OnboardingWelcomePost } from "@/utilities/handlers/onboardingHandler";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";
import { useRouter } from "next/navigation";

interface OnboardingPostProps {
  handleNext: () => void;
  handlePrevious?: () => void;
}

export default function OnboardingPost({
  handlePrevious,
}: Readonly<OnboardingPostProps>) {
  const user = useUser();
  const router = useRouter();
  const accessToken = useAccessToken();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Generate welcome message based on user profile
  const generateWelcomeMessage = () => {
    if (!user) return "";

    const firstName = user.first_name || "there";
    const about = user.about || "excited to be part of this community";
    const currentRole = user.current_role || "professional";
    const company = user.company ? ` at ${user.company}` : "";
    const userType = user.user_type || "member";

    const baseMessages = [
      `Hello everyone! 👋 My name is ${firstName} and I'm ${about}. I'm a ${currentRole}${company} and I'm thrilled to join the Kocha community!`,

      `Hey community! 🎉 I'm ${firstName}, ${about}. As a ${currentRole}${company}, I'm looking forward to connecting, learning, and growing with all of you here at Kocha.`,

      `Greetings! I'm ${firstName} ${about}. I work as a ${currentRole}${company} and I'm excited to be part of this amazing community. Can't wait to start engaging with everyone!`,

      `Hi everyone! I'm ${firstName}. ${about} I'm a ${currentRole}${company} and I'm really excited to join the Kocha community and contribute to our collective growth.`,
    ];

    // Select a random base message
    const randomMessage =
      baseMessages[Math.floor(Math.random() * baseMessages.length)];

    // Add user type specific ending
    let ending = "";
    if (userType === "mentor") {
      ending =
        " I'm here to share my experience and help others in their journey. Looking forward to meaningful conversations!";
    } else if (userType === "mentee") {
      ending =
        " I'm here to learn, grow, and connect with experienced professionals. Excited for this journey!";
    } else {
      ending =
        " Looking forward to connecting with like-minded professionals and being part of this vibrant community!";
    }

    return randomMessage + ending;
  };

  useEffect(() => {
    if (user) {
      const generatedMessage = generateWelcomeMessage();
      setWelcomeMessage(generatedMessage);
    }
  }, [user]);

  const handlePostToCommunity = async () => {
    if (!welcomeMessage.trim()) {
      toast.error("Please write a welcome message");
      return;
    }

    if (!accessToken) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      setIsSubmitting(true);

      await OnboardingWelcomePost({ content: welcomeMessage }, accessToken);
      toast.success("Welcome post published successfully! 🎉");
      router.push("/home");
    } catch (error: any) {
      handleErrorMessage(error, "Failed to create welcome post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerateMessage = () => {
    const newMessage = generateWelcomeMessage();
    setWelcomeMessage(newMessage);
    toast.success("New welcome message generated!");
  };

  if (!user) {
    return <Loader text="Loading your profile..." />;
  }

  return (
    <div className="pt-[6rem]">
      <div className="fixed top-0 w-full z-50">
        <NavigationBar />
      </div>
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Sparkles className="h-12 w-12 text-[#334AFF]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Kocha! 🎉
          </h1>
          <p className="text-muted-foreground text-lg">
            Introduce yourself to the community with a welcome post
          </p>
        </div>

        {/* Welcome Message Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-[#334AFF]" />
                Your Welcome Post
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateMessage}
                className="h-8"
                disabled={isSubmitting}
              >
                Regenerate
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We&apos;ve generated a welcome message based on your profile. Feel
              free to customize it or write your own!
            </p>

            <Textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Write your welcome message here..."
              className="min-h-[150px] resize-none"
              onFocus={() => setIsCustomizing(true)}
              onBlur={() => setIsCustomizing(false)}
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {isCustomizing
                  ? "Customizing your message..."
                  : "Click to edit and make it your own!"}
              </span>
              <span>{welcomeMessage.length} characters</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between pt-6">
          {handlePrevious && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="h-12 gap-2 w-[120px]"
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}

          <div className="flex gap-4 ml-auto">
            <Button
              onClick={handlePostToCommunity}
              disabled={!welcomeMessage.trim() || isSubmitting}
              className="w-[180px] bg-[#334AFF] hover:bg-[#251F99] h-12 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Posting...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Post to Community
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-800 mb-2">
              💡 Tips for a great introduction:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Share what you&apos;re passionate about in your field</li>
              <li>• Mention what you hope to achieve in the community</li>
              <li>
                • Include what you can offer or what you&apos;re looking to
                learn
              </li>
              <li>• Keep it friendly and authentic!</li>
            </ul>
          </CardContent>
        </Card>

        {/* Loading State Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-[#0000006b] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#334AFF]"></div>
                <span>Posting your welcome message...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
