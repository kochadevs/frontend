/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { ResumeData } from "@/interface/createResume";
import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";


const CreateResume = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "OLIVIA RHYE",
    summary:
      "Results-driven professional with 3+ years in Tech, excelling in key skills, e.g., project management, strategic planning. Committed to delivering impactful solutions and driving [organizational/team/client] success.",
    skills: [
      "Shopfloor - SCADA",
      "IT - Communications",
      "Data Analytics",
      "IT - Infrastructure",
      "Databases",
      "Enterprise - PLM",
    ],
    languages: [
      "English",
      "Spanish",
      "Hindi",
      "Chinese",
      "Portuguese",
      "Arabic",
    ],
    workExperience: [
      {
        company: "AmalTech Ghana",
        position: "Junior Associate",
        period: "October 2023 to present",
        description:
          "Contributed to the development of high-quality backend solutions across AmalTech survey builder system, focusing on Java and TypeScript based implementations with Spring Boot",
      },
    ],
    education: [
      {
        institution: "Oxford University",
        degree: "Bachelor's Computer Science",
        period: "2017 to 2021",
      },
      {
        institution: "Oxford University",
        degree: "Bachelor's Computer Science",
        period: "2017 to 2021",
      },
      {
        institution: "Oxford University",
        degree: "Bachelor's Computer Science",
        period: "2017 to 2021",
      },
    ],
    certifications: [
      {
        name: "Graphic Design",
        issuer: "Udemy",
        period: "2017 to 2021",
      },
      {
        name: "Graduate Training Programme",
        issuer: "Amaltech Training",
        period: "2023 to 2024",
      },
      {
        name: "Google UX design",
        issuer: "Coursera",
        period: "2024 to 2025",
      },
    ],
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [keywords] = useState(6);
  const [tailorJob] = useState("UX Designer");

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDraggedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDraggedFile(e.target.files[0].name);
    }
  };

  const handleInputChange = (field: keyof ResumeData, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <main className="min-h-screen pb-[4rem]">
      <div className="py-[10px] 2xl:px-20 px-10 h-[40px] bg-white border-b fixed w-full z-50">
        <Breadcrumb
          start={{
            name: "Documents",
            href: "/documents",
            current: false,
          }}
          steps={[
            {
              name: "Create Resume",
              href: `/documents/create-resume`,
              current: true,
            },
          ]}
        />
      </div>
      <div className="container mx-auto pt-20 pb-6  px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ResumeForm
            resumeData={resumeData}
            activeSection={activeSection}
            draggedFile={draggedFile}
            tailorJob={tailorJob}
            toggleSection={toggleSection}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
            handleInputChange={handleInputChange}
          />
          <ResumePreview resumeData={resumeData} keywords={keywords} />
        </div>
      </div>
    </main>
  );
};

export default CreateResume;
