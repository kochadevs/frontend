"use client";
import React from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/interface/onboarding";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingStore } from "@/store/onboardingStore";

interface Option {
  id: string;
  label: string;
}

const options: Option[] = [
  { id: "actively_looking", label: "Actively looking" },
  { id: "open_to_offers", label: "Not looking but open to offers" },
  { id: "not_looking", label: "Not looking and closed to offers" },
];

const JobSearchStatus: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
}) => {
  const { jobSearchStatus, toggleJobSearchStatus, saveOnboardingData } =
    useOnboardingStore();

  const handleSaveAndContinue = async () => {
    await saveOnboardingData();
    handleNext();
  };

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">
          What is the status of your job search?
        </h1>
        <p className="text-[#344054] mb-8 text-[16px] font-semibold">
          Select all that applies
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={clsx(
              "w-full text-left text-[14px] px-4 py-3 rounded-lg border transition-colors duration-200 flex items-center cursor-pointer",
              jobSearchStatus.includes(option.id)
                ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                : "border-[#E5E7EB] hover:border-[#D1D5DB]"
            )}
          >
            <Checkbox
              checked={jobSearchStatus.includes(option.id)}
              onCheckedChange={() => toggleJobSearchStatus(option.id)}
              className="mr-3 data-[state=checked]:bg-[#251F99] data-[state=checked]:border-[#251F99]"
            />
            {option.label}
          </label>
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
          className="flex w-[153px] justify-center rounded-md bg-[#334AFF] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px]"
          onClick={handleSaveAndContinue}
          disabled={jobSearchStatus.length === 0}
        >
          Save & continue
        </Button>
      </div>
    </div>
  );
};

export default JobSearchStatus;
