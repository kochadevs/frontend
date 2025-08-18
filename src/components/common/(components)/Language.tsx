import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const skills = [
  "Spanish",
  "Hindi",
  "English",
  ".Net stack",
  "Chinese",
  "Portuguese",
  "Arabic",
];

export default function Language() {
  return (
    <Card className="w-full gap-0 p-0">
      <div className="px-[48px] mb-2 border-b h-[62px] flex items-center justify-start">
        <h2 className="text-gray-700 text-[20px] font-[600]">Language(s)</h2>
      </div>
      <div className="px-[48px] flex items-start flex-wrap gap-4 py-6">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex w-fit items-center justify-center text-[#374151] bg-[#F2F4F7] px-[10px] py-[4px] rounded-[5px]"
          >
            {skill}
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full h-[52px]">
        Show all languages
      </Button>
    </Card>
  );
}
