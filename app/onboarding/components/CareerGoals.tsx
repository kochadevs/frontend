import React, { useState } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/interface/onboarding";

interface Category {
  title: string;
  skills: string[];
}

const categories: Category[] = [
  {
    title: "Engineering and technical",
    skills: [
      "Adobe Illustrator",
      "Business Analytics",
      "Excel/Numbers/Sheets",
      "Git",
      "HTML/CSS",
      "Java",
      "MailChimp",
      "MATLAB",
      "Operations Research",
      "Python",
      "SEO",
      "Zendesk",
    ],
  },
];

const CareerGoals: React.FC<StepProps> = ({ handleNext, handlePrevious }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      return [...prev, skill];
    });
  };

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">
          What are your career goals?
        </h1>
        <p className="text-[#344054] mb-8 text-[16px] font-semibold">
          Select all that applies
        </p>
      </div>
      {categories.map((category) => (
        <div key={category.title} className="mb-8">
          <h2 className="text-sm font-medium text-[#111827] mb-3">
            {category.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={clsx(
                  "px-4 py-2 rounded-md border cursor-pointer text-sm transition-colors duration-200",
                  selectedSkills.includes(skill)
                    ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99] font-semibold"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      ))}

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
          className="flex w-[153px] justify-center rounded-md bg-linear-to-r from-[#334AFF] to-[#251F99] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px]"
          onClick={handleNext}
        >
          Save & continue
        </Button>
      </div>
    </div>
  );
};

export default CareerGoals;
