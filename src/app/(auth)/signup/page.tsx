// app/signup/page.tsx
"use client";

import { useState } from "react";
import WelcomeScreen from "./(signup_views)/Welcome_Screen";
import SignupForm from "./(signup_views)/SignUpForm";
import NavigationBar from "@/components/common/NavigationBar";

export default function Signup() {
  const [currentStep, setCurrentStep] = useState<"welcome" | "signup">(
    "welcome"
  );
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  const handleWelcomeNext = (userType: string) => {
    setSelectedUserType(userType);
    setCurrentStep("signup");
  };

  const handleBackToWelcome = () => {
    setCurrentStep("welcome");
    setSelectedUserType("");
  };

  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <NavigationBar />
      </div>
      {currentStep === "welcome" && (
        <WelcomeScreen onNext={handleWelcomeNext} />
      )}
      {currentStep === "signup" && (
        <SignupForm userType={selectedUserType} onBack={handleBackToWelcome} />
      )}
    </div>
  );
}
