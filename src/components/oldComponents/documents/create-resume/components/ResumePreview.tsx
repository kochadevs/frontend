"use client";
import React from "react";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { ResumeData } from "@/interface/createResume";
import { Button } from "@/components/ui/button";

interface ResumePreviewProps {
  resumeData: ResumeData;
  keywords: number;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  keywords,
}) => {
  return (
    <div className="w-full flex flex-col space-y-6">
      <div className="min-h-[77px] bg-[#DBEAFF] flex items-center justify-between md:flex-row flex-col p-[16px] gap-2">
        <h1 className="text-[#251F99] font-[600] text-[32px]">KOCHA AI</h1>

        <div className="text-[#334AFF] md:text-center">
          <h2 className="text-[24px] font-[600]">{keywords} of 10 Keywords</h2>
          <p className="text-[13px] font-[500]"> Are present in your resume</p>
        </div>

        <Button className="bg-white hover:bg-gray-100 z-20 boarder">
          <svg
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.5 11V14.3333C16.5 14.7754 16.3244 15.1993 16.0118 15.5118C15.6993 15.8244 15.2754 16 14.8333 16H3.16667C2.72464 16 2.30072 15.8244 1.98816 15.5118C1.67559 15.1993 1.5 14.7754 1.5 14.3333V11M4.83333 6.83333L9 11M9 11L13.1667 6.83333M9 11V1"
              stroke="#344054"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <div className="bg-[#DBEAFF] p-[18px]">
        <div className="bg-white shadow-lg p-6 relative overflow-hidden">
          <div className="bg-[#334AFF] h-[34px] text-white absolute font-[600] text-[14px] top-10 right-0 transform rotate-45 translate-x-12 -translate-y-2 py-1 px-16">
            PREVIEW
          </div>

          <div className="text-center w-full mb-10">
            <h1 className="font-[600] text-[24px] text-[#08283B] mb-4">
              {resumeData.name}
            </h1>
          </div>

          <div className="grid 2xl:grid-cols-3 grid-cols-1 gap-6">
            <div className="col-span-2">
              <div className="mb-4">
                <h2 className="text-[14px] font-[600] border-b-2 border-b-black pb-1 mb-2 text-[#08283B]">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-[15px] text-[#474D66]">
                  {resumeData.summary}
                </p>
              </div>
              <div className="mb-4">
                <h2 className="text-[14px] font-[600] border-b-2 border-b-black pb-1 mb-2 text-[#08283B]">
                  WORK EXPERIENCE
                </h2>
                {resumeData.workExperience.map((job, index) => (
                  <div
                    key={job.company + index}
                    className="text-[15px] text-[#474D66] mb-3"
                  >
                    <div className="flex justify-between text-sm">
                      <div className="font-medium">
                        {job.company} ({job.period})
                      </div>
                    </div>
                    <div className="text-sm font-medium">{job.position}</div>
                    <ul className="list-disc ml-5 text-sm">
                      <li>{job.description}</li>
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h2 className="text-[14px] font-[600] border-b-2 border-b-black pb-1 mb-2 text-[#08283B]">
                  EDUCATION
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div
                    key={edu.institution + index}
                    className="mb-2 flex justify-between text-[15px] text-[#474D66]"
                  >
                    <div>
                      <div className="font-medium">{edu.institution}</div>
                      <div>{edu.degree}</div>
                    </div>
                    <div>({edu.period})</div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h2 className="text-[14px] font-[600] border-b-2 border-b-black pb-1 mb-2 text-[#08283B]">
                  CERTIFICATION
                </h2>
                {resumeData.certifications.map((cert, index) => (
                  <div
                    key={cert.issuer + index}
                    className="mb-2 flex justify-between text-sm text-[15px] text-[#474D66]"
                  >
                    <div>
                      <div className="font-medium">{cert.name}</div>
                      <div className="flex items-center">
                        {cert.issuer}
                        {(cert.name === "Graduate Training Programme" ||
                          cert.name === "Google UX design") && (
                          <ArrowUpTrayIcon className="w-4 h-4 ml-1 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div>({cert.period})</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <div className="mb-4">
                <h2 className="text-[14px] font-[600] border-b-2 border-b-black pb-1 mb-2 text-[#08283B]">
                  SKILLS
                </h2>
                <ul className="list-disc ml-5 text-[15px] text-[#474D66]">
                  {resumeData.skills.map((skill, index) => (
                    <li key={skill + index}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h2 className="text-[14px] font-[600] border-b-2 border-b-black pb-1 mb-2 text-[#08283B]">
                  LANGUAGE
                </h2>
                <ul className="list-disc ml-5 text-sm text-[15px] text-[#474D66]">
                  {resumeData.languages.map((language, index) => (
                    <li key={language + index}>{language}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded flex items-center">
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
