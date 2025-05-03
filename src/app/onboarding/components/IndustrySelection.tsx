"use client";
import React from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";

const industries = [
  "Aerospace",
  "AI & Machine Learning",
  "Automotive & Transportation",
  "Biotechnology",
  "Consulting",
  "Consumer Goods",
  "Consumer Software",
  "Crypto & Web3",
  "Cybersecurity",
  "Defense",
  "Data & Analytics",
  "Design",
  "Education",
  "Energy",
  "Enterprise Software",
  "Entertainment",
  "Financial Services",
  "Fintech",
  "Food & Agriculture",
  "Gaming",
  "Government & Public Sector",
  "Hardware",
  "Healthcare",
  "Industrial & Manufacturing",
  "Legal",
  "Quantitative Finance",
  "Real Estate",
  "Robotics & Automation",
  "Social Impact",
  "Venture Capital",
  "VR & AR",
];

const IndustrySelection: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
}) => {
  const { selectedIndustries, toggleIndustry, saveOnboardingData } =
    useOnboardingStore();

  const handleSaveAndContinue = async () => {
    await saveOnboardingData();
    handleNext();
  };

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
            key={industry}
            onClick={() => toggleIndustry(industry)}
            className={clsx(
              "px-4 py-2 rounded-md border text-sm transition-colors duration-200 cursor-pointer",
              selectedIndustries.includes(industry)
                ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99]"
                : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
            )}
          >
            {industry}
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
          className="flex w-[153px] justify-center rounded-md bg-[#334AFF] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px]"
          onClick={handleSaveAndContinue}
          disabled={selectedIndustries.length === 0}
        >
          Save & continue
        </Button>
      </div>
    </div>
  );
};

export default IndustrySelection;
