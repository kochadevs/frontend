"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps, OnboardingOption } from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { fetchIndustries } from "@/utilities/handlers/onboardingHandler";
import { toast } from "react-hot-toast";

const IndustrySelection: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
}) => {
  const { selectedIndustries, toggleIndustry, submitIndustries, isSubmitting } =
    useOnboardingStore();
  
  const [industries, setIndustries] = useState<OnboardingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadIndustries = async () => {
      try {
        const data = await fetchIndustries();
        setIndustries(data);
      } catch (error) {
        console.error('Error fetching industries:', error);
        toast.error('Failed to load industries');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadIndustries();
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      await submitIndustries();
      toast.success('Industries saved successfully!');
      handleNext();
    } catch (error) {
      console.error('Error submitting industries:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save industries');
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251F99]"></div>
        <p className="mt-4 text-[#667085]">Loading industries...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">
          What industries are exciting to you?
        </h1>
        <p className="text-[#344054] mb-8 text-[16px] font-semibold">
          First, what industries are exciting to you?
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => toggleIndustry(industry.id)}
            className={clsx(
              "px-4 py-2 rounded-md border text-sm transition-colors duration-200 cursor-pointer",
              selectedIndustries.includes(industry.id)
                ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99]"
                : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
            )}
          >
            {industry.name}
          </button>
        ))}
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
          className="flex w-[153px] justify-center rounded-md bg-[#334AFF] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveAndContinue}
          disabled={selectedIndustries.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & continue"}
        </Button>
      </div>
    </div>
  );
};

export default IndustrySelection;
