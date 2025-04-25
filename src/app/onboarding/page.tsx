"use client";
import React, { useState } from "react";
import ValueSelection from "./components/ValueSelection";
import JobSearchStatus from "./components/JobSearchStatus";
import RoleSelection from "./components/RoleSelection";
import IndustrySelection from "./components/IndustrySelection";
import SkillsSelection from "./components/SkillsSelection";
import CareerGoals from "./components/CareerGoals";
import NavigationBar from "@/components/common/NavigationBar";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Calculate progress based on current step (no decimals)
  const progress = Math.round((step / totalSteps) * 100);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div>
      <NavigationBar />

      <main className="pt-[4rem] max-w-[723px] mx-auto mb-[3rem] px-8">
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

        {step == 4 && (
          <IndustrySelection
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}

        {step == 5 && (
          <SkillsSelection
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}

        {step == 6 && (
          <CareerGoals
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}
      </main>
    </div>
  );
};

export default Onboarding;
