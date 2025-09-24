"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mentor } from "@/interface/mentors";
import { useState } from "react";

type SkillProps = {
  mentor?: Mentor | null;
};

export default function Skill({ mentor }: SkillProps) {
  const [showAll, setShowAll] = useState(false);
  const skills = mentor?.skills || [];
  const displayedSkills = showAll ? skills : skills.slice(0, 10);
  return (
    <Card className="w-full gap-0 p-0">
      <div className="px-[48px] mb-2 border-b h-[62px] flex items-center justify-start">
        <h2 className="text-gray-700 text-[20px] font-[600]">Skill(s)</h2>
      </div>
      <div className="px-[48px] flex items-start flex-wrap gap-4 py-6 min-h-[100px]">
        {displayedSkills.length > 0 ? (
          displayedSkills.map((skill) => (
            <div
              key={skill.id}
              className="flex w-fit items-center justify-center text-[#374151] bg-[#F2F4F7] px-[10px] py-[4px] rounded-[5px]"
            >
              {skill.name}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full">
            <p className="text-gray-500 text-center">No skills listed yet.</p>
          </div>
        )}
      </div>
      {skills.length > 10 && (
        <Button 
          variant="outline" 
          className="w-full h-[52px]"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : `Show all skills (${skills.length})`}
        </Button>
      )}
    </Card>
  );
}
