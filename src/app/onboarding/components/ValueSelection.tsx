"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps, OnboardingOption } from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { fetchNewRoleValues } from "@/utilities/handlers/onboardingHandler";
import { toast } from "react-hot-toast";

const ValueSelection: React.FC<StepProps> = ({ handleNext }) => {
  const { selectedValues, toggleValue, submitNewRoleValues, isSubmitting } =
    useOnboardingStore();
  
  const [values, setValues] = useState<OnboardingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadValues = async () => {
      try {
        const data = await fetchNewRoleValues();
        setValues(data);
      } catch (error) {
        console.error('Error fetching role values:', error);
        toast.error('Failed to load role values');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadValues();
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      await submitNewRoleValues();
      toast.success('Role values saved successfully!');
      handleNext();
    } catch (error) {
      console.error('Error submitting role values:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save role values');
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251F99]"></div>
        <p className="mt-4 text-[#667085]">Loading role values...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 text-center flex flex-col items-center justify-between h-full">
      <div>
        <h1 className="text-[36px] font-bold text-[#2E3646] mb-2">
          What do you value in your new role?
        </h1>
        <p className="text-[#344054] mb-4 text-[16px] font-semibold">
          Select up to 3
        </p>
        <p className="text-[#667085] mb-8 text-[14px]">
          {selectedValues.length}/3 selected
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {values.map((value) => {
          const isSelected = selectedValues.includes(value.id);
          const canSelect = selectedValues.length < 3 || isSelected;
          
          return (
            <button
              key={value.id}
              onClick={() => toggleValue(value.id)}
              disabled={!canSelect}
              className={clsx(
                "px-4 py-2 rounded-md border text-sm transition-colors duration-200",
                isSelected
                  ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] cursor-pointer"
                  : canSelect
                  ? "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB] cursor-pointer"
                  : "border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed opacity-50"
              )}
            >
              {value.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end mt-64 w-full">
        <Button
          variant="ghost"
          type="submit"
          className="flex w-[153px] justify-center rounded-md bg-[#334AFF] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveAndContinue}
          disabled={selectedValues.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & continue"}
        </Button>
      </div>
    </div>
  );
};

export default ValueSelection;
