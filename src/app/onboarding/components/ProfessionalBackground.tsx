"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps, OnboardingOption } from "@/interface/onboarding";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/store/onboardingStore";
import {
  fetchIndustries,
  fetchSkills,
} from "@/utilities/handlers/onboardingHandler";
import { toast } from "react-hot-toast";

const ProfessionalBackground: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
}) => {
  const {
    professionalBackground,
    updateProfessionalBackground,
    submitProfessionalBackground,
    isSubmitting,
  } = useOnboardingStore();

  const [industries, setIndustries] = useState<OnboardingOption[]>([]);
  const [skills, setSkills] = useState<OnboardingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure arrays are always defined
  const currentIndustries = professionalBackground.industries || [];
  const currentSkills = professionalBackground.skills || [];

  // Load industries and skills
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [industriesData, skillsData] = await Promise.all([
          fetchIndustries(),
          fetchSkills(),
        ]);
        setIndustries(industriesData);
        setSkills(skillsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load form options");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (
    field: keyof typeof professionalBackground,
    value: string
  ) => {
    updateProfessionalBackground({ [field]: value });
  };

  const toggleIndustry = (industryId: number) => {
    const newIndustries = currentIndustries.includes(industryId)
      ? currentIndustries.filter((id) => id !== industryId)
      : [...currentIndustries, industryId];

    updateProfessionalBackground({ industries: newIndustries });
  };

  const toggleSkill = (skillId: number) => {
    const newSkills = currentSkills.includes(skillId)
      ? currentSkills.filter((id) => id !== skillId)
      : [...currentSkills, skillId];

    updateProfessionalBackground({ skills: newSkills });
  };

  const handleSaveAndContinue = async () => {
    // Validate required fields
    if (
      !professionalBackground.currentRole.trim() ||
      !professionalBackground.yearsOfExperience.trim() ||
      currentIndustries.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Submit all professional background data together
      await submitProfessionalBackground();

      toast.success("Professional background saved successfully!");
      handleNext();
    } catch (error) {
      console.error("Error submitting professional background:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save professional background"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251F99]"></div>
        <p className="mt-4 text-[#667085]">
          Loading professional information...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">
          Professional Background
        </h1>
        <p className="text-[#344054] text-[16px] font-semibold">
          Tell us about your professional experience
        </p>
      </div>

      {/* Current Role */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#374151] mb-2">
          Current Role <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={professionalBackground.currentRole}
          onChange={(e) => handleInputChange("currentRole", e.target.value)}
          placeholder="e.g. Software Engineer, Product Manager"
          className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#251F99] focus:border-transparent"
        />
      </div>

      {/* Company (Optional) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#374151] mb-2">
          Company <span className="text-gray-400">(Optional)</span>
        </label>
        <Input
          type="text"
          value={professionalBackground.company}
          onChange={(e) => handleInputChange("company", e.target.value)}
          placeholder="e.g. Google, Microsoft"
          className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#251F99] focus:border-transparent"
        />
      </div>

      {/* Years of Experience */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#374151] mb-2">
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={professionalBackground.yearsOfExperience}
          onChange={(e) =>
            handleInputChange("yearsOfExperience", e.target.value)
          }
          placeholder="e.g. 5, 2.5, 10+"
          className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#251F99] focus:border-transparent"
        />
      </div>

      {/* Industry (Multi-select) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Industry <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-[#6B7280] mb-3">Select all that apply</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {industries.map((industry) => (
            <label
              key={industry.id}
              className={clsx(
                "w-full text-left text-[14px] px-4 py-3 rounded-lg border transition-colors duration-200 flex items-center cursor-pointer",
                currentIndustries.includes(industry.id)
                  ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                  : "border-[#E5E7EB] hover:border-[#D1D5DB]"
              )}
            >
              <Checkbox
                checked={currentIndustries.includes(industry.id)}
                onCheckedChange={() => toggleIndustry(industry.id)}
                className="mr-3 data-[state=checked]:bg-[#251F99] data-[state=checked]:border-[#251F99]"
              />
              {industry.name}
            </label>
          ))}
        </div>
      </div>

      {/* Skills (Tag selector) */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Skills
        </label>
        <p className="text-sm text-[#6B7280] mb-3">Select relevant skills</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {currentSkills.map((skillId) => {
            const skill = skills.find((s) => s.id === skillId);
            return skill ? (
              <div
                key={skillId}
                className="bg-[#EEF4FF] text-[#251F99] px-3 py-1 rounded-full text-sm font-medium flex items-center"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => toggleSkill(skillId)}
                  className="ml-2 text-[#251F99] hover:text-[#334AFF]"
                >
                  ×
                </button>
              </div>
            ) : null;
          })}
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {skills
            .filter((skill) => !currentSkills.includes(skill.id))
            .map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className="text-left text-[14px] px-4 py-3 rounded-lg border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors duration-200"
              >
                {skill.name}
              </button>
            ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-end w-full gap-6 mt-8">
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
          disabled={
            !professionalBackground.currentRole.trim() ||
            !professionalBackground.yearsOfExperience.trim() ||
            currentIndustries.length === 0 ||
            isSubmitting
          }
        >
          {isSubmitting ? "Saving..." : "Save & continue"}
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalBackground;
