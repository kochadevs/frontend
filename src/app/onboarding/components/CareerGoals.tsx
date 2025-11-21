"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthActions } from "@/store/authStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CareerGoalsData {
  shortTermGoal: string;
  longTermGoal: string;
}

const CareerGoals: React.FC<StepProps> = ({ handlePrevious }) => {
  const router = useRouter();
  const { refreshUserProfile } = useAuthActions();
  const { submitCareerGoals, isSubmitting, clearAllData } =
    useOnboardingStore();

  const [formData, setFormData] = useState<CareerGoalsData>({
    shortTermGoal: "",
    longTermGoal: "",
  });

  const shortTermGoals = [
    { value: "job_search", label: "Job Search" },
    { value: "career_switch", label: "Career Switch" },
    { value: "career_guidance", label: "Career Guidance/Progression" },
    { value: "upskilling", label: "Upskilling" },
  ];

  const handleInputChange = (field: keyof CareerGoalsData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAndContinue = async () => {
    // Validate required fields
    if (!formData.shortTermGoal.trim() || !formData.longTermGoal.trim()) {
      toast.error("Please fill in both short term and long term goals");
      return;
    }

    try {
      // Submit career goals to API
      await submitCareerGoals();

      // Refresh user profile to get updated onboarding data
      await refreshUserProfile();

      // Show success message
      toast.success("Onboarding completed successfully!");

      // Clear onboarding data since we're completed
      clearAllData();

      // Small delay to ensure everything is processed
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to complete onboarding"
      );
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">Goals</h1>
        <p className="text-[#344054] text-[16px] font-semibold">
          Tell us about your career aspirations
        </p>
      </div>

      {/* Short Term Goals - Card Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Short Term Goals <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-[#6B7280] mb-4">
          What are your immediate career objectives?
        </p>

        <Select
          value={formData.shortTermGoal}
          onValueChange={(value) => handleInputChange("shortTermGoal", value)}
        >
          <SelectTrigger className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#251F99] focus:border-transparent">
            <SelectValue placeholder="Select your short term goal" />
          </SelectTrigger>
          <SelectContent>
            {shortTermGoals.map((goal) => (
              <SelectItem
                key={goal.value}
                value={goal.value}
                className="cursor-pointer py-3"
              >
                {goal.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Alternative: Card-style selection (uncomment if preferred over dropdown) */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {shortTermGoals.map((goal) => (
            <button
              key={goal.value}
              onClick={() => handleInputChange('shortTermGoal', goal.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                formData.shortTermGoal === goal.value
                  ? "border-[#251F99] bg-[#EEF4FF] text-[#251F99] font-semibold"
                  : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB] hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{goal.label}</div>
            </button>
          ))}
        </div> */}
      </div>

      {/* Long Term Goals - Free Text */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Long Term Goals <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-[#6B7280] mb-4">
          Where do you see yourself in 5-10 years?
        </p>

        <Textarea
          value={formData.longTermGoal}
          onChange={(e) => handleInputChange("longTermGoal", e.target.value)}
          placeholder="Describe your long-term career aspirations, such as reaching a leadership position, starting your own business, specializing in a particular field, etc."
          className="w-full min-h-[120px] px-3 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#251F99] focus:border-transparent resize-none"
        />

        <p className="text-xs text-[#6B7280] mt-2">
          Be specific about your career vision and objectives
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-end w-full gap-6 mt-16">
        <Button
          variant="ghost"
          className="cursor-pointer px-4 py-2 border border-[#D0D5DD] text-[#6B7280] hover:text-[#374151]"
          onClick={handlePrevious}
        >
          Previous
        </Button>

        <Button
          variant="ghost"
          type="submit"
          className="flex min-w-[153px] justify-center rounded-md bg-[#334AFF] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveAndContinue}
          disabled={
            !formData.shortTermGoal.trim() ||
            !formData.longTermGoal.trim() ||
            isSubmitting
          }
        >
          {isSubmitting ? "Completing..." : "Complete Onboarding"}
        </Button>
      </div>
    </div>
  );
};

export default CareerGoals;
