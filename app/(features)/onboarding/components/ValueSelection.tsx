"use client";
import React, { useState } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/interface/onboarding";

interface Value {
  id: string;
  label: string;
}

const values: Value[] = [
  { id: "diversity", label: "Diversity & inclusion" },
  { id: "leadership", label: "Progressive leadership" },
  { id: "independence", label: "Independence & autonomy" },
  { id: "mentorship", label: "Mentorship & career development" },
  { id: "recognition", label: "Recognition & reward" },
  { id: "responsibility", label: "Social responsibility & sustainability" },
  { id: "mobility", label: "Role mobility" },
  { id: "balance", label: "Work-life balance" },
  { id: "transparency", label: "Transparency & communication" },
  { id: "impact", label: "Impactful work" },
];

const ValueSelection: React.FC<StepProps> = ({
  handleNext,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleValue = (id: string) => {
    setSelectedValues((prev) => {
      if (prev.includes(id)) {
        return prev.filter((v) => v !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="w-full text-center flex flex-col items-center justify-between h-full">
      <div>
        <h1 className="text-[36px] font-bold text-[#2E3646] mb-2">
          What do you value in your new role?
        </h1>
        <p className="text-[#344054] mb-8 text-[16px] font-semibold">
          Select up to 3
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {values.map((value) => (
          <button
            key={value.id}
            onClick={() => toggleValue(value.id)}
            className={clsx(
              "px-4 py-2 rounded-md border text-sm transition-colors duration-200 cursor-pointer",
              selectedValues.includes(value.id)
                ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99]"
                : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
            )}
          >
            {value.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end mt-64 w-full">
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

export default ValueSelection;
