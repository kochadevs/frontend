import React, { useState, useMemo } from "react";
import { clsx } from "clsx";
import { ChevronDown, Search } from "lucide-react";
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
      "ReactJs",
      "NextJs",
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

const SkillsSelection: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      return [...prev, skill];
    });
  };

  // Filter skills based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    return categories
      .map((category) => ({
        ...category,
        skills: category.skills.filter((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.skills.length > 0);
  }, [categories, searchTerm]);

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
              {filteredCategories.map((category) => (
                <div key={category.title} className="mb-4">
                  <h3 className="text-sm font-medium text-[#111827] px-2 py-1">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 p-2">
                    {category.skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          toggleSkill(skill);
                          setIsOpen(false);
                        }}
                        className={clsx(
                          "px-3 py-1 rounded-md border text-sm cursor-pointer",
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

              {filteredCategories.length === 0 && (
                <p className="text-center text-[#6B7280] py-4">
                  No skills found
                </p>
              )}
            </div>
          </div>
        )}
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
                  "px-4 py-2 rounded-md border text-sm transition-colors duration-200 cursor-pointer",
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

export default SkillsSelection;
