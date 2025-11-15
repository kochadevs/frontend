"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { StepProps, RoleInterestOption } from "@/interface/onboarding";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { fetchRoleInterest } from "@/utilities/handlers/onboardingHandler";
import { toast } from "react-hot-toast";

interface CategorizedRoles {
  [category: string]: RoleInterestOption[];
}

const RoleSelection: React.FC<StepProps> = ({ handleNext, handlePrevious }) => {
  const { selectedRoles, toggleRole, submitRoleInterest, isSubmitting } =
    useOnboardingStore();

  const [categorizedRoles, setCategorizedRoles] = useState<CategorizedRoles>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoleInterest();

        // Group roles by category
        const grouped = data.reduce(
          (acc: CategorizedRoles, role: RoleInterestOption) => {
            if (!acc[role.category]) {
              acc[role.category] = [];
            }
            acc[role.category].push(role);
            return acc;
          },
          {}
        );

        setCategorizedRoles(grouped);
      } catch (error) {
        console.error("Error fetching role interests:", error);
        toast.error("Failed to load role interests");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      await submitRoleInterest();
      toast.success("Role interests saved successfully!");
      handleNext();
    } catch (error) {
      console.error("Error submitting role interests:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save role interests"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251F99]"></div>
        <p className="mt-4 text-[#667085]">Loading role interests...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#2E3646] mb-2">
          What kind of roles are you interested in?
        </h1>
        <p className="text-[#344054] mb-8 text-[16px] font-semibold">
          Select up to 5
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(categorizedRoles).map(
          ([categoryName, categoryRoles]) => (
            <div key={categoryName}>
              <h2 className="text-sm font-medium text-[#111827] mb-3">
                {categoryName}
              </h2>
              <div className="flex flex-wrap gap-2">
                {categoryRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={clsx(
                      "px-4 py-2 rounded-md border text-sm transition-colors duration-200 cursor-pointer",
                      selectedRoles.includes(role.id)
                        ? "bg-[#EEF4FF] border-[#251F99] text-[#251F99]"
                        : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                    )}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex items-center justify-end w-full gap-6 mt-40">
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
          disabled={selectedRoles.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & continue"}
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
