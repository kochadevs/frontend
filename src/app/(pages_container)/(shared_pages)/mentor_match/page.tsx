"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Mentors from "./(components)/Mentors";
import { useUser } from "@/store/authStore";
import { Loader2, Rocket, Users, Target, Star } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MentorMatch() {
  const user = useUser();
  const router = useRouter();
  const isMentor = user?.user_type === "mentor";

  useEffect(() => {
    if (user && isMentor) {
      toast.error("Mentors cannot access the Mentor Match feature.");
      router.push("/home");
    }
  }, [user, isMentor, router]);

  // Show loading while checking user type
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content for mentors (they will be redirected)
  if (isMentor) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex-col flex gap-y-[30px]">
      {/* Enhanced Banner */}
      <div className="md:sticky md:top-0 z-30 bg-gradient-to-r from-[#251F99] to-[#6C47FF] p-6 md:p-8 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">
                Find Your Perfect Mentor
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium">Industry Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium">
                  Personalized Guidance
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium">Proven Success</span>
              </div>
            </div>

            <p className="text-white/90 text-sm leading-relaxed max-w-3xl">
              Connect with industry-leading mentors who understand your career
              aspirations. Get personalized guidance, strategic insights, and
              actionable advice from experienced professionals who have walked
              your path. Transform your potential into success with mentorship
              that matters.
            </p>
          </div>
        </div>
      </div>

      <div className="p-[20px] flex flex-col gap-y-[30px]">
        <Mentors />
      </div>
    </main>
  );
}
