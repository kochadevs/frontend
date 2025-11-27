// app/signup/(signup_views)/Welcome_Screen.tsx
"use client";
import { useState } from "react";

interface WelcomeScreenProps {
  onNext: (userType: string) => void;
}

export default function WelcomeScreen({
  onNext,
}: Readonly<WelcomeScreenProps>) {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const options = [
    {
      id: "mentor",
      title: "Become a mentor",
      description: "Share your knowledge and guide others in their journey",
    },
    {
      id: "mentee",
      title: "Find a mentor",
      description: "Get personalized guidance from experienced mentors",
    },
    {
      id: "regular",
      title: "Join Community",
      description: "Connect with like-minded individuals and grow together",
    },
  ];

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-y-scroll py-8">
      <div className="md:w-[599px] w-full md:px-2 px-4">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-[30px] font-[700] tracking-tight text-[#2E3646]">
            Welcome to Kocha
          </h2>
          <p className="text-[#667085] text-center text-[16px]">
            Choose your path to get started
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className={`w-full px-6 py-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOption === option.id
                  ? "border-[#334AFF] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                    selectedOption === option.id
                      ? "border-[#334AFF] bg-[#334AFF]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === option.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2E3646] text-lg">
                    {option.title}
                  </h3>
                  <p className="text-[#667085] text-sm mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="flex w-full justify-center rounded-md bg-[#334AFF] px-3 py-1.5 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
