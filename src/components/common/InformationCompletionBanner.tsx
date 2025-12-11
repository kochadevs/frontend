/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { CompletionDataResponse } from "@/interface/InformationCompletion";
import { getInformationCompletionData } from "@/utilities/handlers/InformationCompletionHandler";
import { useAccessToken } from "@/store/authStore";
import toast from "react-hot-toast";
import { tokenUtils } from "@/utilities/cookies";

interface CircularProgressProps {
  percentage: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  label,
  size = 100,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  const getProgressColor = (percent: number) => {
    if (percent < 30) {
      return {
        gradient: `linear-gradient(135deg, #EF4444 0%, #DC2626 100%)`,
        shadow: "shadow-[0_2px_10px_rgba(239,68,68,0.2)]",
        textColor: "text-red-600",
      };
    } else if (percent < 70) {
      return {
        gradient: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`,
        shadow: "shadow-[0_2px_10px_rgba(245,158,11,0.2)]",
        textColor: "text-amber-600",
      };
    } else {
      return {
        gradient: `linear-gradient(135deg, #10B981 0%, #059669 100%)`,
        shadow: "shadow-[0_2px_10px_rgba(16,185,129,0.2)]",
        textColor: "text-emerald-600",
      };
    }
  };

  const progressColors = getProgressColor(percentage);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative transition-all duration-300 ease-out hover:scale-[1.02]"
        style={{ width: size, height: size }}
      >
        {/* Outer glow effect */}
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-40 transition-all duration-300 ${progressColors.shadow}`}
        ></div>

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle with subtle gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#bgGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            className="opacity-20"
          />

          {/* Progress circle with dynamic gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          <defs>
            {/* Background gradient */}
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3F4F6" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>

            {/* Dynamic progress gradient */}
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={
                  percentage < 30
                    ? "#EF4444"
                    : percentage < 70
                    ? "#F59E0B"
                    : "#10B981"
                }
              />
              <stop
                offset="100%"
                stopColor={
                  percentage < 30
                    ? "#DC2626"
                    : percentage < 70
                    ? "#D97706"
                    : "#059669"
                }
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Percentage text with animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-xl font-bold transition-all duration-300 ${progressColors.textColor}`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Label with animation */}
      <div className="mt-2 text-center">
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
};

const InformationCompletionBanner = () => {
  const [completionData, setCompletionData] =
    useState<CompletionDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAccessToken();

  const fetchCompletionData = async () => {
    try {
      setLoading(true);
      setError(null);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        const errorMessage = "Please sign in to view completion data.";
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const data = await getInformationCompletionData(token);
      setCompletionData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching completion data";
      setError(errorMessage);
      console.error("Error fetching completion data:", err);

      if (
        err instanceof Error &&
        err.message !== "Please sign in to view completion data."
      ) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletionData();
  }, [accessToken]);

  const handleRetry = () => {
    fetchCompletionData();
  };

  // Loading state with skeleton animation
  if (loading) {
    return (
      <div className="w-full px-6 py-4 bg-white border-b shadow-sm">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          {[...Array(3)].map((_, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-6 border-gray-200 animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-full mt-2 animate-pulse"></div>
              </div>
              {index < 2 && (
                <div className="w-px h-16 bg-gray-200 hidden md:block"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full px-6 py-4 bg-white border-b shadow-sm">
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
            <p className="text-red-700 text-sm font-medium">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!completionData) {
    return (
      <div className="w-full px-6 py-4 bg-white border-b shadow-sm">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-gray-500 text-sm">No completion data available</p>
        </div>
      </div>
    );
  }

  // Success state - display actual data from API
  return (
    <div className="w-full px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex flex-row justify-between items-center max-w-4xl mx-auto gap-6 md:gap-0">
        {/* Profile Completion */}
        <CircularProgress
          percentage={completionData.profile_completion_percentage}
          label="Profile Completion"
          size={100}
        />

        {/* Divider for desktop */}
        <div className="w-px h-16 bg-gray-200 hidden md:block"></div>

        {/* Annual Target */}
        <CircularProgress
          percentage={completionData.annual_target_completion_percentage}
          label="Annual Target"
          size={100}
        />

        {/* Divider for desktop */}
        <div className="w-px h-16 bg-gray-200 hidden md:block"></div>

        {/* Overall Progress */}
        <CircularProgress
          percentage={completionData.overall_completion_percentage}
          label="Overall Progress"
          size={100}
        />
      </div>
    </div>
  );
};

export default InformationCompletionBanner;
