"use client";
import React, { useMemo, useState, useEffect } from "react";
import { clsx } from "clsx";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepProps, OnboardingOption } from "@/interface/onboarding";
import { useOnboardingStore } from "@/store/onboardingStore";
import { fetchSkills } from "@/utilities/onboardingHandler";
import { toast } from "react-hot-toast";

const SkillsSelection: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
}) => {
  const { selectedSkills, toggleSkill, submitSkills, isSubmitting } =
    useOnboardingStore();

  const [skills, setSkills] = useState<OnboardingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSkills();
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      await submitSkills();
      toast.success('Skills saved successfully!');
      handleNext();
    } catch (error) {
      console.error('Error submitting skills:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save skills');
    }
  };

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills;

    return skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skills, searchTerm]);
  
  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251F99]"></div>
        <p className="mt-4 text-[#667085]">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">
          What skills do you have or enjoy working with?
        </h1>
        <p className="text-[#344054] mb-8 text-[16px] font-semibold">
          Select all that applies
        </p>
      </div>

      <div className="relative mb-8">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full cursor-pointer flex items-center justify-between px-3 py-2 border rounded-md bg-white text-[#374151]"
        >
          <span className="text-[#6B7280]">Search all skills</span>
          <ChevronDown
            className={`h-5 w-5 text-[#6B7280] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto mt-2">
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 p-2">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => {
                        toggleSkill(skill.id);
                        setIsOpen(false);
                      }}
                      className={clsx(
                        "px-3 py-1 rounded-md border text-sm cursor-pointer",
                        selectedSkills.includes(skill.id)
                          ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                          : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                      )}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              {filteredSkills.length === 0 && (
                <p className="text-center text-[#6B7280] py-4">
                  No skills found
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-[#111827] mb-3">
          Available Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => toggleSkill(skill.id)}
              className={clsx(
                "px-4 py-2 rounded-md border text-sm transition-colors duration-200 cursor-pointer",
                selectedSkills.includes(skill.id)
                  ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                  : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
              )}
            >
              {skill.name}
            </button>
          ))}
        </div>
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
          className="flex w-[153px] justify-center rounded-md bg-[#334AFF] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveAndContinue}
          disabled={selectedSkills.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & continue"}
        </Button>
      </div>
    </div>
  );
};

export default SkillsSelection;
