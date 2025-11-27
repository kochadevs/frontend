"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  StepProps,
  OnboardingOption,
  MentoringFrequency,
} from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import {
  fetchSkills,
  fetchIndustries,
  fetchMentoringFrequency,
} from "@/utilities/handlers/onboardingHandler";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { clsx } from "clsx";

const MentoringPreferences: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
}) => {
  const {
    mentoringPreferences,
    updateMentoringPreferences,
    submitMentoringPreferences,
    isSubmitting,
  } = useOnboardingStore();

  const [skills, setSkills] = useState<OnboardingOption[]>([]);
  const [industries, setIndustries] = useState<OnboardingOption[]>([]);
  const [frequencyOptions, setFrequencyOptions] = useState<MentoringFrequency>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "mandarin", label: "Mandarin" },
    { value: "hindi", label: "Hindi" },
    { value: "arabic", label: "Arabic" },
  ];

  // Load skills, industries, and frequency options
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [skillsData, industriesData, frequencyData] = await Promise.all([
          fetchSkills(),
          fetchIndustries(),
          fetchMentoringFrequency(),
        ]);
        setSkills(skillsData);
        setIndustries(industriesData);

        // Assuming fetchMentoringFrequency returns an array of OnboardingOption
        setFrequencyOptions(frequencyData as MentoringFrequency);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load mentoring options");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFrequencyChange = (value: string) => {
    const frequencyId = parseInt(value);
    // Store as array with single element (since it's a single select)
    updateMentoringPreferences({ frequency: [frequencyId] });
  };

  const handleLanguageChange = (value: string) => {
    updateMentoringPreferences({ language: value });
  };

  const toggleSkill = (skillId: number) => {
    const currentSkills = mentoringPreferences.skills || [];
    const newSkills = currentSkills.includes(skillId)
      ? currentSkills.filter((id: number) => id !== skillId)
      : [...currentSkills, skillId];

    updateMentoringPreferences({ skills: newSkills });
  };

  const toggleIndustry = (industryId: number) => {
    const currentIndustries = mentoringPreferences.industries || [];
    const newIndustries = currentIndustries.includes(industryId)
      ? currentIndustries.filter((id: number) => id !== industryId)
      : [...currentIndustries, industryId];

    updateMentoringPreferences({ industries: newIndustries });
  };

  // Helper to get the selected frequency name for display
  const getSelectedFrequencyName = () => {
    if (!mentoringPreferences.frequency.length) return "";
    const selectedFrequency = frequencyOptions.find(
      (freq) => freq.id === mentoringPreferences.frequency[0]
    );
    return selectedFrequency?.name || "";
  };

  const handleSaveAndContinue = async () => {
    // Validate required fields
    if (
      !mentoringPreferences.frequency.length ||
      !mentoringPreferences.language
    ) {
      toast.error("Please select frequency and language preferences");
      return;
    }

    try {
      await submitMentoringPreferences();
      toast.success("Mentoring preferences saved successfully!");
      handleNext();
    } catch (error) {
      console.error("Error submitting mentoring preferences:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save mentoring preferences"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251F99]"></div>
        <p className="mt-4 text-[#667085]">Loading mentoring options...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center mb-8">
        <p className="text-[#344054] text-[16px] font-semibold">
          Tell us about your preferred mentoring style
        </p>
      </div>

      {/* Frequency */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Preferred Frequency <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-[#6B7280] mb-4">
          How often would you like to connect with a mentor?
        </p>
        <Select
          value={mentoringPreferences.frequency[0]?.toString() || ""} // Get first element from array
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#251F99] focus:border-transparent">
            <SelectValue placeholder="Select frequency">
              {getSelectedFrequencyName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {frequencyOptions.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id.toString()} // Use the ID as value
                className="cursor-pointer py-3"
              >
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Preferred Language <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-[#6B7280] mb-4">
          What language would you prefer for mentoring sessions?
        </p>
        <Select
          value={mentoringPreferences.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="w-full h-12 px-4 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#251F99] focus:border-transparent">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer py-3"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Skills to Focus On
        </label>
        <p className="text-sm text-[#6B7280] mb-4">
          Select skills you&apos;d like to develop through mentoring
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {skills.map((skill) => (
            <label
              key={skill.id}
              className={clsx(
                "w-full text-left text-[14px] px-4 py-3 rounded-lg border transition-colors duration-200 flex items-center cursor-pointer",
                (mentoringPreferences.skills || []).includes(skill.id)
                  ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                  : "border-[#E5E7EB] hover:border-[#D1D5DB]"
              )}
            >
              <Checkbox
                checked={(mentoringPreferences.skills || []).includes(skill.id)}
                onCheckedChange={() => toggleSkill(skill.id)}
                className="mr-3 data-[state=checked]:bg-[#251F99] data-[state=checked]:border-[#251F99]"
              />
              {skill.name}
            </label>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#374151] mb-3">
          Industries of Interest
        </label>
        <p className="text-sm text-[#6B7280] mb-4">
          Select industries you&apos;d like mentoring guidance in
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {industries.map((industry) => (
            <label
              key={industry.id}
              className={clsx(
                "w-full text-left text-[14px] px-4 py-3 rounded-lg border transition-colors duration-200 flex items-center cursor-pointer",
                (mentoringPreferences.industries || []).includes(industry.id)
                  ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                  : "border-[#E5E7EB] hover:border-[#D1D5DB]"
              )}
            >
              <Checkbox
                checked={(mentoringPreferences.industries || []).includes(
                  industry.id
                )}
                onCheckedChange={() => toggleIndustry(industry.id)}
                className="mr-3 data-[state=checked]:bg-[#251F99] data-[state=checked]:border-[#251F99]"
              />
              {industry.name}
            </label>
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
            !mentoringPreferences.frequency.length ||
            !mentoringPreferences.language ||
            isSubmitting
          }
        >
          {isSubmitting ? "Saving..." : "Save & continue"}
        </Button>
      </div>
    </div>
  );
};

export default MentoringPreferences;
