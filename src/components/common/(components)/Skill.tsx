"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mentor } from "@/interface/mentors";
import { useState } from "react";
import { Code, ChevronDown, ChevronUp } from "lucide-react";

type SkillProps = {
  mentor?: Mentor | null;
};

export default function Skill({ mentor }: Readonly<SkillProps>) {
  const [showAll, setShowAll] = useState(false);
  const skills = mentor?.professional_background.skills || [];
  const displayedSkills = showAll ? skills : skills.slice(0, 12);

  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Code className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Skills & Expertise
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {skills.length} skill{skills.length !== 1 ? "s" : ""} listed
            </p>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="p-6 bg-white">
        {displayedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {displayedSkills.map((skill) => (
              <div
                key={skill.id}
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 cursor-default"
              >
                {skill.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Code className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-1">No skills listed yet</p>
            <p className="text-gray-400 text-xs">
              Skills will appear here once added
            </p>
          </div>
        )}
      </div>

      {/* Show More/Less Button */}
      {skills.length > 12 && (
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <Button
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
            onClick={() => setShowAll(!showAll)}
          >
            <span className="flex items-center gap-2">
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  View all {skills.length} skills
                </>
              )}
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
}
