import React, { useState } from "react";
import { clsx } from "clsx";
import { StepProps } from "@/interface/onboarding";
import { Button } from "@/components/ui/button";

interface Role {
  id: string;
  label: string;
}

interface Category {
  title: string;
  roles: Role[];
}

const categories: Category[] = [
  {
    title: "Engineering and Technical",
    roles: [
      { id: "aerospace", label: "Aerospace Engineering" },
      { id: "ai_ml", label: "AI & Machine Learning" },
      { id: "architecture", label: "Architecture & Civil Engineering" },
      { id: "data_analytics", label: "Data & Analytics" },
      { id: "developer_relations", label: "Developer Relations" },
      { id: "devops", label: "DevOps & Infrastructure" },
      { id: "electrical", label: "Electrical Engineering" },
      { id: "engineering_management", label: "Engineering Management" },
      { id: "hardware", label: "Hardware Engineering" },
      { id: "it_security", label: "IT & Security" },
      { id: "mechanical", label: "Mechanical Engineering" },
      { id: "process", label: "Process Engineering" },
      { id: "qa", label: "QA & Testing" },
      { id: "quantitative", label: "Quantitative Finance" },
      { id: "quantum", label: "Quantum Computing" },
      { id: "sales_engineering", label: "Sales & Solution Engineering" },
      { id: "software", label: "Software Engineering" },
    ],
  },
  {
    title: "Finance & Operations & Strategy",
    roles: [
      { id: "accounting", label: "Accounting" },
      { id: "business_strategy", label: "Business & Strategy" },
      { id: "consulting", label: "Consulting" },
      { id: "finance_banking", label: "Finance & Banking" },
      { id: "growth_marketing", label: "Growth & Marketing" },
      { id: "operations_logistics", label: "Operations & Logistics" },
      { id: "product", label: "Product" },
      { id: "real_estate", label: "Real Estate" },
      { id: "retail", label: "Retail" },
      { id: "sales_account", label: "Sales & Account Management" },
    ],
  },
  {
    title: "Creative & Design",
    roles: [
      { id: "art_graphics", label: "Art, Graphics & Animation" },
      { id: "audio_sound", label: "Audio & Sound Design" },
      { id: "content_writing", label: "Content & Writing" },
      { id: "creative_production", label: "Creative Production" },
      { id: "journalism", label: "Journalism" },
      { id: "social_media", label: "Social Media" },
      { id: "ui_ux", label: "UI/UX & Design" },
    ],
  },
  {
    title: "Education & Training",
    roles: [
      { id: "education", label: "Education" },
      { id: "training", label: "Training" },
    ],
  },
  {
    title: "Legal & Support & Administration",
    roles: [
      { id: "admin_executive", label: "Administrative & Executive Assistance" },
      { id: "clerical_data", label: "Clerical & Data Entry" },
      { id: "customer_experience", label: "Customer Experience & Support" },
      { id: "legal_compliance", label: "Legal & Compliance" },
      { id: "people_hr", label: "People & HR" },
      { id: "security_services", label: "Security & Protective Services" },
    ],
  },
];

const RoleSelection: React.FC<StepProps> = ({
  handleNext,
  handlePrevious,
})  => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(id)) {
        return prev.filter((v) => v !== id);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, id];
    });
  };

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
        {categories.map((category) => (
          <div key={category.title}>
            <h2 className="text-sm font-medium text-[#111827] mb-3">
              {category.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {category.roles.map((role) => (
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
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        ))}
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
          className="flex w-[153px] justify-center rounded-md bg-linear-to-r from-[#334AFF] to-[#251F99] px-3 py-1.5 text-[16px] font-semibold text-white hover:text-[#fff]/70 shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px]"
          onClick={handleNext}
        >
          Save & continue
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
