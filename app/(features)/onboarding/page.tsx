"use client"
import OnBoardingNavbar from "@/app/components/common/OnBoardingNavbar";
import React, { useState } from "react";
import ValueSelection from "./components/ValueSelection";
import JobSearchStatus from "./components/JobSearchStatus";
import RoleSelection from "./components/RoleSelection";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(10); // Start at 10%

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
    setProgress((prev) => Math.min(prev + 15, 100));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setProgress((prev) => Math.max(prev - 15, 0));
  };

  return (
    <div>
      <OnBoardingNavbar />

      <main className="pt-[4rem] max-w-[723px] mx-auto mb-[3rem]">
        <header className="w-full flex items-center justify-between h-[20px] mb-[3rem]">
          <div className="w-full h-[8px] rounded-full bg-[#EAECF0]">
            <div
              className="h-full rounded-full bg-[#251F99] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-[14px] ml-2">{progress}%</span>
        </header>

        {step == 1 && (
          <ValueSelection
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}

        {step == 2 && (
          <JobSearchStatus
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}

        {step == 3 && (
          <RoleSelection
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}
      </main>
    </div>
  );
};

export default Onboarding;