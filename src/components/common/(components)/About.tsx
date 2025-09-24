import { Card } from "@/components/ui/card";
import { Mentor } from "@/interface/mentors";

type AboutProps = {
  mentor?: Mentor | null;
};

export default function About({ mentor }: Readonly<AboutProps>) {
  return (
    <Card className="p-0 overflow-hidden gap-1">
      <div className="w-full h-[63px] flex items-center px-[38px] py-[16px] border-b">
        <h3 className="font-[600] text-[20px] text-[#475467]">About</h3>
      </div>
      <div className="px-[38px] py-[16px]">
        <p className="text-[#344054] font-[400] whitespace-pre-wrap">
          {mentor?.about ||
            "This mentor has not provided an about section yet. Please check back later for more information about their background, expertise, and mentoring approach."}
        </p>

        {mentor && (
          <div className="mt-6 space-y-3">
            {mentor.career_goals && mentor.career_goals.length > 0 && (
              <div>
                <h4 className="font-[600] text-[16px] text-[#475467] mb-2">
                  Career Goals
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.career_goals.slice(0, 5).map((goal) => (
                    <span
                      key={goal.id}
                      className="px-3 py-1 bg-[#EFF8FF] text-[#175CD3] rounded-full text-sm"
                    >
                      {goal.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
