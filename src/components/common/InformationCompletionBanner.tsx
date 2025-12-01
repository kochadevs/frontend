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
  size = 120,
  strokeWidth = 15,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle with gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#251F99" />
              <stop offset="100%" stopColor="#6C47FF" />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
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

      // Try to get token from store first, then from cookies as fallback
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

      // Use the imported API function
      const data = await getInformationCompletionData(token);
      setCompletionData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching completion data";
      setError(errorMessage);
      console.error("Error fetching completion data:", err);

      // Show toast for API errors
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
  }, [accessToken]); // Added accessToken as dependency to refetch when token changes

  const handleRetry = () => {
    fetchCompletionData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full px-24 py-6 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-[15px] border-gray-200 animate-pulse"></div>
            <span className="mt-2 text-sm font-medium text-gray-400">
              Loading...
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-[15px] border-gray-200 animate-pulse"></div>
            <span className="mt-2 text-sm font-medium text-gray-400">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full px-24 py-6 bg-white shadow-sm">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
            <p className="text-red-700 mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
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
      <div className="w-full px-24 py-6 bg-white shadow-sm">
        <div className="text-center text-gray-500">
          No completion data available
        </div>
      </div>
    );
  }

  // Success state - display actual data from API
  return (
    <div className="w-full px-24 py-6 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <CircularProgress
          percentage={completionData.profile_completion_percentage}
          label="Profile Completion"
        />
        <CircularProgress
          percentage={completionData.annual_target_completion_percentage}
          label="Annual Target"
        />
      </div>
      {/* Optional: Show overall completion */}
      {completionData.overall_completion_percentage > 0 && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Overall Completion:{" "}
            <span className="font-semibold text-[#251F99]">
              {completionData.overall_completion_percentage}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default InformationCompletionBanner;
