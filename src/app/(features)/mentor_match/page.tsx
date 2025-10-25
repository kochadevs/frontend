"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Mentors from "./(components)/Mentors";
import { useUser } from "@/store/authStore";
import { Loader2, X, Rocket, Users, Target, Star } from "lucide-react";
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
      <div className="relative bg-gradient-to-r from-[#334AFF] to-[#6C47FF] p-6 md:p-8 text-white overflow-hidden">
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
        <div className="flex items-center justify-between sticky top-10">
          {/* Search */}
          <div className="relative w-full md:w-[320px] overflow-hidden bg-white rounded-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
              >
                <path
                  d="M13 13.0005L9.53537 9.53585M9.53537 9.53585C10.4731 8.59814 10.9999 7.32632 10.9999 6.00019C10.9999 4.67406 10.4731 3.40224 9.53537 2.46452C8.59765 1.5268 7.32583 1 5.9997 1C4.67357 1 3.40175 1.5268 2.46403 2.46452C1.52632 3.40224 0.999512 4.67406 0.999512 6.00019C0.999512 7.32632 1.52632 8.59814 2.46403 9.53585C3.40175 10.4736 4.67357 11.0004 5.9997 11.0004C7.32583 11.0004 8.59765 10.4736 9.53537 9.53585Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Mentors />
      </div>
    </main>
  );
}
