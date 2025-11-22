"use client";
import React, { useState } from "react";
import CareerGoals from "./components/CareerGoals";
import NavigationBar from "@/components/common/NavigationBar";
import ProfessionalBackground from "./components/ProfessionalBackground";
import MentoringPreferences from "./components/MentoringPreferences";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Calculate progress based on current step (no decimals)
  const progress = Math.round((step / totalSteps) * 100);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="pt-[2rem]">
      <div className="fixed top-0 w-full z-50">
        <NavigationBar />
      </div>

      <main className="pt-[4rem] max-w-[723px] mx-auto mb-[3rem] px-8">
        <header className="w-full items-center justify-between h-[20px] mb-[3rem]">
          <div className="w-full h-[8px] rounded-full bg-[#EAECF0]">
            <div
              className="h-full rounded-full bg-[#251F99] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-[14px] ml-2">{progress}%</span>
        </header>

        {step === 1 && (
          <ProfessionalBackground
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}

        {step === 2 && (
          <CareerGoals
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}

        {step === 3 && (
          <MentoringPreferences
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}
      </main>
    </div>
  );
};

export default Onboarding;
