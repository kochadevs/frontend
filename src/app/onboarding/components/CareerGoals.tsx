"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps, OnboardingOption } from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { fetchCareerGoals } from "@/utilities/onboardingHandler";
import { useAuthActions } from "@/store/authStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const CareerGoals: React.FC<StepProps> = ({ handlePrevious }) => {
  const router = useRouter();
  const { refreshUserProfile } = useAuthActions();
  const { careerGoals, toggleCareerGoal, submitCareerGoals, isSubmitting, clearAllData } =
    useOnboardingStore();
  
  const [goals, setGoals] = useState<OnboardingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCareerGoals = async () => {
      try {
        const data = await fetchCareerGoals();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching career goals:', error);
        toast.error('Failed to load career goals');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCareerGoals();
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      // Submit career goals to API
      await submitCareerGoals();
      
      // Refresh user profile to get updated onboarding data
      await refreshUserProfile();
      
      // Show success message
      toast.success('Onboarding completed successfully!');
      
      // Clear onboarding data since we're completed
      clearAllData();
      // Small delay to ensure everything is processed
      setTimeout(() => {
        router.push('/home');
      }, 1500);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete onboarding');
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251F99]"></div>
        <p className="mt-4 text-[#667085]">Loading career goals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">
          What are your career goals?
        </h1>
        <p className="text-[#344054] mb-8 text-[16px] font-semibold">
          Select all that applies
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-[#111827] mb-3">
          Available Career Goals
        </h2>
        <div className="flex flex-wrap gap-2">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleCareerGoal(goal.id)}
              className={clsx(
                "px-4 py-2 rounded-md border cursor-pointer text-sm transition-colors duration-200",
                careerGoals.includes(goal.id)
                  ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                  : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
              )}
            >
              {goal.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end w-full gap-6 mt-64">
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
          disabled={careerGoals.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Completing..." : "Complete Onboarding"}
        </Button>
      </div>
    </div>
  );
};

export default CareerGoals;
