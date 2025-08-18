/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ResumeData } from "@/interface/createResume";
import { Button } from "@/components/ui/button";

interface ResumeFormProps {
  resumeData: ResumeData;
  activeSection: string | null;
  draggedFile: string | null;
  tailorJob: string;
  toggleSection: (section: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (field: keyof ResumeData, value: any) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({
  resumeData,
  activeSection,
  draggedFile,
  tailorJob,
  toggleSection,
  handleDragOver,
  handleDrop,
  handleFileSelect,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-[32px] font-bold flex items-center text-[#2E3646]">
          <span>{resumeData.name.split(" ")[0]}</span>
          <span className="ml-2">{resumeData.name.split(" ")[1]}</span>
        </h1>
        <Button className="bg-white hover:bg-gray-100 z-20 boarder">
          <svg
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 15.6662H16.5M12.75 1.9162C13.0815 1.58468 13.5312 1.39844 14 1.39844C14.2321 1.39844 14.462 1.44416 14.6765 1.533C14.891 1.62184 15.0858 1.75205 15.25 1.9162C15.4142 2.08036 15.5444 2.27523 15.6332 2.48971C15.722 2.70418 15.7678 2.93406 15.7678 3.1662C15.7678 3.39835 15.722 3.62822 15.6332 3.8427C15.5444 4.05718 15.4142 4.25205 15.25 4.4162L4.83333 14.8329L1.5 15.6662L2.33333 12.3329L12.75 1.9162Z"
              stroke="#344054"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <div>
        <p className="mb-4 text-[#2032E2] font-[500] text-[16px]">
          Drag and drop a CV to auto-fill the template or enter details
          manually.
        </p>
        <div
          className="border-2 border-dashed border-[#2032E2] rounded-md p-6 text-center h-[170px] flex items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {draggedFile ? (
            <p className="text-gray-700">{draggedFile}</p>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="file-upload"
                  className="text-[#2032E2] cursor-pointer text-[16px] font-[500]"
                >
                  Choose a file
                  <span className="text-[#474D66]"> or drop it here</span>
                </label>

                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <p className="text-[14px] text-[#474D66] mt-2 font-[400]">
                  10MB size limit
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 p-4 border rounded-md">
        <div className="flex items-start space-x-2">
          <div className="flex items-center justify-center bg-[#2032E2] rounded-full w-[16px] h-[16px] mt-2">
            <svg
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.33341 1.5L3.75008 6.08333L1.66675 4"
                stroke="white"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <label
              htmlFor="tailor"
              className="text-[#2E3646] text-[18px] font-[600]"
            >
              Tailor your resume to a job
            </label>
            <div className="w-[88px] h-[22px] rounded-full bg-[#F4F3FF] text-[#6941C6] font-[500] text-[14px] flex items-center justify-center">
              {tailorJob}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="ml-auto px-3 py-1 border rounded text-[16px] text-[#2E3646] font-[600]"
        >
          Tailor to a job
        </Button>
      </div>

      {/* Summary Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 cursor-pointer bg-white h-[68px]">
          <div className="flex items-center">
            <h5 className="mr-2 text-[#2E3646] text-[18px] font-[600]">
              Professional Summary
            </h5>
            <div className="flex items-center space-x-2">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => toggleSection("summary")}
              >
                <path
                  d="M9 15.6662H16.5M12.75 1.9162C13.0815 1.58468 13.5312 1.39844 14 1.39844C14.2321 1.39844 14.462 1.44416 14.6765 1.533C14.891 1.62184 15.0858 1.75205 15.25 1.9162C15.4142 2.08036 15.5444 2.27523 15.6332 2.48971C15.722 2.70418 15.7678 2.93406 15.7678 3.1662C15.7678 3.39835 15.722 3.62822 15.6332 3.8427C15.5444 4.05718 15.4142 4.25205 15.25 4.4162L4.83333 14.8329L1.5 15.6662L2.33333 12.3329L12.75 1.9162Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 15.0003C12.7615 15.0003 15.0001 12.7617 15.0001 10.0003C15.0001 7.2389 12.7615 5.00033 10.0001 5.00033C7.23866 5.00033 5.00008 7.2389 5.00008 10.0003C5.00008 12.7617 7.23866 15.0003 10.0001 15.0003Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 11.667C10.9206 11.667 11.6667 10.9208 11.6667 10.0003C11.6667 9.07985 10.9206 8.33366 10.0001 8.33366C9.07961 8.33366 8.33342 9.07985 8.33342 10.0003C8.33342 10.9208 9.07961 11.667 10.0001 11.667Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              activeSection === "summary" ? "rotate-180" : ""
            }`}
            onClick={() => toggleSection("summary")}
          />
        </div>
        {activeSection === "summary" && (
          <div className="p-4 bg-gray-50">
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={resumeData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Work Experience Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 cursor-pointer bg-white h-[68px]">
          <div className="flex items-center">
            <h5 className="text-[#2E3646] text-[18px] font-[600] mr-2">
              Work experience
            </h5>
            <div className="flex items-center space-x-2">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => toggleSection("work")}
              >
                <path
                  d="M9 15.6662H16.5M12.75 1.9162C13.0815 1.58468 13.5312 1.39844 14 1.39844C14.2321 1.39844 14.462 1.44416 14.6765 1.533C14.891 1.62184 15.0858 1.75205 15.25 1.9162C15.4142 2.08036 15.5444 2.27523 15.6332 2.48971C15.722 2.70418 15.7678 2.93406 15.7678 3.1662C15.7678 3.39835 15.722 3.62822 15.6332 3.8427C15.5444 4.05718 15.4142 4.25205 15.25 4.4162L4.83333 14.8329L1.5 15.6662L2.33333 12.3329L12.75 1.9162Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 15.0003C12.7615 15.0003 15.0001 12.7617 15.0001 10.0003C15.0001 7.2389 12.7615 5.00033 10.0001 5.00033C7.23866 5.00033 5.00008 7.2389 5.00008 10.0003C5.00008 12.7617 7.23866 15.0003 10.0001 15.0003Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 11.667C10.9206 11.667 11.6667 10.9208 11.6667 10.0003C11.6667 9.07985 10.9206 8.33366 10.0001 8.33366C9.07961 8.33366 8.33342 9.07985 8.33342 10.0003C8.33342 10.9208 9.07961 11.667 10.0001 11.667Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <ChevronDownIcon
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              activeSection === "work" ? "rotate-180" : ""
            }`}
            onClick={() => toggleSection("work")}
          />
        </div>
        {activeSection === "work" && (
          <div className="p-4 bg-gray-50 space-y-4">
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...resumeData.workExperience];
                    updated[index].company = e.target.value;
                    handleInputChange("workExperience", updated);
                  }}
                  placeholder="Company"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={exp.position}
                  onChange={(e) => {
                    const updated = [...resumeData.workExperience];
                    updated[index].position = e.target.value;
                    handleInputChange("workExperience", updated);
                  }}
                  placeholder="Position"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={exp.period}
                  onChange={(e) => {
                    const updated = [...resumeData.workExperience];
                    updated[index].period = e.target.value;
                    handleInputChange("workExperience", updated);
                  }}
                  placeholder="Period"
                />
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...resumeData.workExperience];
                    updated[index].description = e.target.value;
                    handleInputChange("workExperience", updated);
                  }}
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 cursor-pointer bg-white h-[68px]">
          <div className="flex items-center">
            <h5 className="text-[#2E3646] text-[18px] font-[600] mr-2">
              Education
            </h5>
            <div className="flex items-center space-x-2">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => toggleSection("education")}
              >
                <path
                  d="M9 15.6662H16.5M12.75 1.9162C13.0815 1.58468 13.5312 1.39844 14 1.39844C14.2321 1.39844 14.462 1.44416 14.6765 1.533C14.891 1.62184 15.0858 1.75205 15.25 1.9162C15.4142 2.08036 15.5444 2.27523 15.6332 2.48971C15.722 2.70418 15.7678 2.93406 15.7678 3.1662C15.7678 3.39835 15.722 3.62822 15.6332 3.8427C15.5444 4.05718 15.4142 4.25205 15.25 4.4162L4.83333 14.8329L1.5 15.6662L2.33333 12.3329L12.75 1.9162Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 15.0003C12.7615 15.0003 15.0001 12.7617 15.0001 10.0003C15.0001 7.2389 12.7615 5.00033 10.0001 5.00033C7.23866 5.00033 5.00008 7.2389 5.00008 10.0003C5.00008 12.7617 7.23866 15.0003 10.0001 15.0003Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 11.667C10.9206 11.667 11.6667 10.9208 11.6667 10.0003C11.6667 9.07985 10.9206 8.33366 10.0001 8.33366C9.07961 8.33366 8.33342 9.07985 8.33342 10.0003C8.33342 10.9208 9.07961 11.667 10.0001 11.667Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <ChevronDownIcon
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              activeSection === "education" ? "rotate-180" : ""
            }`}
            onClick={() => toggleSection("education")}
          />
        </div>
        {activeSection === "education" && (
          <div className="p-4 bg-gray-50 space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...resumeData.education];
                    updated[index].institution = e.target.value;
                    handleInputChange("education", updated);
                  }}
                  placeholder="Institution"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...resumeData.education];
                    updated[index].degree = e.target.value;
                    handleInputChange("education", updated);
                  }}
                  placeholder="Degree"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={edu.period}
                  onChange={(e) => {
                    const updated = [...resumeData.education];
                    updated[index].period = e.target.value;
                    handleInputChange("education", updated);
                  }}
                  placeholder="Period"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 cursor-pointer bg-white h-[68px]">
          <div className="flex items-center">
            <h5 className="text-[#2E3646] text-[18px] font-[600] mr-2">
              Certifications
            </h5>
            <div className="flex items-center space-x-2">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => toggleSection("certifications")}
              >
                <path
                  d="M9 15.6662H16.5M12.75 1.9162C13.0815 1.58468 13.5312 1.39844 14 1.39844C14.2321 1.39844 14.462 1.44416 14.6765 1.533C14.891 1.62184 15.0858 1.75205 15.25 1.9162C15.4142 2.08036 15.5444 2.27523 15.6332 2.48971C15.722 2.70418 15.7678 2.93406 15.7678 3.1662C15.7678 3.39835 15.722 3.62822 15.6332 3.8427C15.5444 4.05718 15.4142 4.25205 15.25 4.4162L4.83333 14.8329L1.5 15.6662L2.33333 12.3329L12.75 1.9162Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 15.0003C12.7615 15.0003 15.0001 12.7617 15.0001 10.0003C15.0001 7.2389 12.7615 5.00033 10.0001 5.00033C7.23866 5.00033 5.00008 7.2389 5.00008 10.0003C5.00008 12.7617 7.23866 15.0003 10.0001 15.0003Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 11.667C10.9206 11.667 11.6667 10.9208 11.6667 10.0003C11.6667 9.07985 10.9206 8.33366 10.0001 8.33366C9.07961 8.33366 8.33342 9.07985 8.33342 10.0003C8.33342 10.9208 9.07961 11.667 10.0001 11.667Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <ChevronDownIcon
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              activeSection === "certifications" ? "rotate-180" : ""
            }`}
            onClick={() => toggleSection("certifications")}
          />
        </div>
        {activeSection === "certifications" && (
          <div className="p-4 bg-gray-50 space-y-4">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={cert.name}
                  onChange={(e) => {
                    const updated = [...resumeData.certifications];
                    updated[index].name = e.target.value;
                    handleInputChange("certifications", updated);
                  }}
                  placeholder="Certification Name"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={cert.issuer}
                  onChange={(e) => {
                    const updated = [...resumeData.certifications];
                    updated[index].issuer = e.target.value;
                    handleInputChange("certifications", updated);
                  }}
                  placeholder="Issuer"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={cert.period}
                  onChange={(e) => {
                    const updated = [...resumeData.certifications];
                    updated[index].period = e.target.value;
                    handleInputChange("certifications", updated);
                  }}
                  placeholder="Period"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 cursor-pointer bg-white h-[68px]">
          <div className="flex items-center">
            <h5 className="text-[#2E3646] text-[18px] font-[600] mr-2">
              Languages
            </h5>
            <div className="flex items-center space-x-2">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => toggleSection("languages")}
              >
                <path
                  d="M9 15.6662H16.5M12.75 1.9162C13.0815 1.58468 13.5312 1.39844 14 1.39844C14.2321 1.39844 14.462 1.44416 14.6765 1.533C14.891 1.62184 15.0858 1.75205 15.25 1.9162C15.4142 2.08036 15.5444 2.27523 15.6332 2.48971C15.722 2.70418 15.7678 2.93406 15.7678 3.1662C15.7678 3.39835 15.722 3.62822 15.6332 3.8427C15.5444 4.05718 15.4142 4.25205 15.25 4.4162L4.83333 14.8329L1.5 15.6662L2.33333 12.3329L12.75 1.9162Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 15.0003C12.7615 15.0003 15.0001 12.7617 15.0001 10.0003C15.0001 7.2389 12.7615 5.00033 10.0001 5.00033C7.23866 5.00033 5.00008 7.2389 5.00008 10.0003C5.00008 12.7617 7.23866 15.0003 10.0001 15.0003Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 11.667C10.9206 11.667 11.6667 10.9208 11.6667 10.0003C11.6667 9.07985 10.9206 8.33366 10.0001 8.33366C9.07961 8.33366 8.33342 9.07985 8.33342 10.0003C8.33342 10.9208 9.07961 11.667 10.0001 11.667Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <ChevronDownIcon
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              activeSection === "languages" ? "rotate-180" : ""
            }`}
            onClick={() => toggleSection("languages")}
          />
        </div>
        {activeSection === "languages" && (
          <div className="p-4 bg-gray-50">
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={resumeData.languages.join(", ")}
              onChange={(e) =>
                handleInputChange("languages", e.target.value.split(", "))
              }
              placeholder="Enter languages separated by commas"
            />
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 cursor-pointer bg-white h-[68px]">
          <div className="flex items-center">
            <h5 className="text-[#2E3646] text-[18px] font-[600] mr-2">
              Skills
            </h5>
            <div className="flex items-center space-x-2">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => toggleSection("skills")}
              >
                <path
                  d="M9 15.6662H16.5M12.75 1.9162C13.0815 1.58468 13.5312 1.39844 14 1.39844C14.2321 1.39844 14.462 1.44416 14.6765 1.533C14.891 1.62184 15.0858 1.75205 15.25 1.9162C15.4142 2.08036 15.5444 2.27523 15.6332 2.48971C15.722 2.70418 15.7678 2.93406 15.7678 3.1662C15.7678 3.39835 15.722 3.62822 15.6332 3.8427C15.5444 4.05718 15.4142 4.25205 15.25 4.4162L4.83333 14.8329L1.5 15.6662L2.33333 12.3329L12.75 1.9162Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 15.0003C12.7615 15.0003 15.0001 12.7617 15.0001 10.0003C15.0001 7.2389 12.7615 5.00033 10.0001 5.00033C7.23866 5.00033 5.00008 7.2389 5.00008 10.0003C5.00008 12.7617 7.23866 15.0003 10.0001 15.0003Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 11.667C10.9206 11.667 11.6667 10.9208 11.6667 10.0003C11.6667 9.07985 10.9206 8.33366 10.0001 8.33366C9.07961 8.33366 8.33342 9.07985 8.33342 10.0003C8.33342 10.9208 9.07961 11.667 10.0001 11.667Z"
                  stroke="#667085"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <ChevronDownIcon
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              activeSection === "skills" ? "rotate-180" : ""
            }`}
            onClick={() => toggleSection("skills")}
          />
        </div>
        {activeSection === "skills" && (
          <div className="p-4 bg-gray-50">
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={resumeData.skills.join(", ")}
              onChange={(e) =>
                handleInputChange("skills", e.target.value.split(", "))
              }
              placeholder="Enter skills separated by commas"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
