"use client";
import React, { useState, useMemo } from "react";
import CareerGoals from "./components/CareerGoals";
import NavigationBar from "@/components/common/NavigationBar";
import ProfessionalBackground from "./components/ProfessionalBackground";
import MentoringPreferences from "./components/MentoringPreferences";
import Review from "./components/Review"; // Import the new Review component
import { useAuthStore } from "@/store/authStore";

interface StepConfig {
  component: React.ComponentType<StepProps>;
  title: string;
}

interface StepProps {
  handleNext: () => void;
  handlePrevious: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const user = useAuthStore((state) => state.user);

  const { totalSteps, stepComponents } = useMemo(() => {
    const userType = user?.user_type;
    const config: { totalSteps: number; stepComponents: StepConfig[] } = {
      totalSteps: 1,
      stepComponents: [],
    };

    switch (userType) {
      case "mentee":
        config.totalSteps = 4; // Increased from 3 to 4
        config.stepComponents = [
          {
            component: ProfessionalBackground,
            title: "Professional Background",
          },
          { component: CareerGoals, title: "Career Goals" },
          { component: MentoringPreferences, title: "Mentor Preferences" },
          { component: Review, title: "Review Information" }, // Added Review as last step
        ];
        break;
      case "mentor":
        config.totalSteps = 3; // Increased from 2 to 3
        config.stepComponents = [
          {
            component: ProfessionalBackground,
            title: "Professional Background",
          },
          { component: MentoringPreferences, title: "Mentoring Preferences" },
          { component: Review, title: "Review Information" }, // Added Review as last step
        ];
        break;
      case "regular":
      default:
        config.totalSteps = 2; // Increased from 1 to 2
        config.stepComponents = [
          {
            component: ProfessionalBackground,
            title: "Professional Background",
          },
          { component: Review, title: "Review Information" }, // Added Review as last step
        ];
        break;
    }

    return config;
  }, [user?.user_type]);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Function to handle going back to a specific step for editing
  const handleEditStep = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const CurrentStepComponent = stepComponents[step - 1]?.component;

  return (
    <div className="pt-[2rem]">
      <div className="fixed top-0 w-full z-50">
        <NavigationBar />
      </div>

      <main className="pt-[4rem] max-w-[723px] mx-auto mb-[3rem] px-8">
        {totalSteps > 1 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {stepComponents[step - 1]?.title}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#334AFF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {CurrentStepComponent && (
          <CurrentStepComponent
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            isLastStep={step === totalSteps}
            isFirstStep={step === 1}
            currentStep={step}
            totalSteps={totalSteps}
            // Pass edit function only to Review component
            {...(step === totalSteps && { handleEditStep })}
          />
        )}
      </main>
    </div>
  );
};

export default Onboarding;
