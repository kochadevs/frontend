"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchCareerGoals } from "@/utilities/handlers/onboardingHandler";

interface CareerGoalsData {
  shortTermGoals: number[];
  longTermGoal: string;
}

interface CareerGoalOption {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

const CareerGoals: React.FC<StepProps> = ({ handlePrevious, handleNext }) => {
  const { careerGoals, updateCareerGoals, submitCareerGoals, isSubmitting } =
    useOnboardingStore();

  const [formData, setFormData] = useState<CareerGoalsData>({
    shortTermGoals: careerGoals.shortTermGoals || [],
    longTermGoal: careerGoals.longTermGoal || "",
  });

  const [shortTermGoals, setShortTermGoals] = useState<CareerGoalOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch career goals from API
  useEffect(() => {
    const loadCareerGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        const careerGoalsData = await fetchCareerGoals();
        setShortTermGoals(careerGoalsData || []);
      } catch (err) {
        console.error("Error fetching career goals:", err);
        setError("Failed to load career goals");
        toast.error("Failed to load career goals options");
      } finally {
        setLoading(false);
      }
    };

    loadCareerGoals();
  }, []);

  const handleShortTermGoalChange = (value: string) => {
    const goalId = parseInt(value);
    setFormData((prev) => ({
      ...prev,
      shortTermGoals: [goalId], // Store as array with single element
    }));

    // Also update the store immediately with the array
    updateCareerGoals({ shortTermGoals: [goalId] });
  };

  const handleLongTermGoalChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      longTermGoal: value,
    }));

    // Also update the store immediately
    updateCareerGoals({ longTermGoal: value });
  };

  // Helper to get the selected goal name for display
  const getSelectedGoalName = () => {
    if (!formData.shortTermGoals.length) return "";
    const selectedGoal = shortTermGoals.find(
      (goal) => goal.id === formData.shortTermGoals[0]
    );
    return selectedGoal?.name || "";
  };

  const handleSaveAndContinue = async () => {
    // Validate required fields
    if (!formData.shortTermGoals.length || !formData.longTermGoal.trim()) {
      toast.error("Please fill in both short term and long term goals");
      return;
    }

    try {
      // Ensure all data is saved to store
      updateCareerGoals(formData);

      // Submit career goals (this now just stores data locally)
      await submitCareerGoals();

      // Show success message
      toast.success("Career goals saved successfully!");

      handleNext();
    } catch (error) {
      console.error("Error saving career goals:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save career goals"
      );
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center mb-8">
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

        {loading ? (
          <div className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#334AFF]"></div>
            <span className="ml-2 text-sm text-gray-500">Loading goals...</span>
          </div>
        ) : error ? (
          <div className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg flex items-center justify-center text-red-500 text-sm">
            Failed to load goals. Please try again.
          </div>
        ) : (
          <Select
            value={formData.shortTermGoals[0]?.toString() || ""} // Get first element from array
            onValueChange={handleShortTermGoalChange}
          >
            <SelectTrigger className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#251F99] focus:border-transparent">
              <SelectValue placeholder="Select your short term goal">
                {getSelectedGoalName()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {shortTermGoals.map((goal) => (
                <SelectItem
                  key={goal.id}
                  value={goal.id.toString()}
                  className="cursor-pointer py-3"
                >
                  {goal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
          onChange={(e) => handleLongTermGoalChange(e.target.value)}
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
            !formData.shortTermGoals.length ||
            !formData.longTermGoal.trim() ||
            isSubmitting ||
            loading
          }
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
};

export default CareerGoals;
