import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type CareerGoal = {
  id: number;
  name: string;
};

type CareerGoalsProps = {
  careerGoals?: CareerGoal[];
};

export default function CareerGoals({ careerGoals = [] }: Readonly<CareerGoalsProps>) {
  const [showAll, setShowAll] = useState(false);
  const displayedGoals = showAll ? careerGoals : careerGoals.slice(0, 8);

  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Career Goals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {careerGoals.length} goal{careerGoals.length !== 1 ? "s" : ""}{" "}
              identified
            </p>
          </div>
        </div>
      </div>

      {/* Career Goals Grid */}
      <div className="p-6 bg-white">
        {displayedGoals.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {displayedGoals.map((goal) => (
              <div
                key={goal.id}
                className="px-4 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 cursor-default"
              >
                {goal.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-1">
              No career goals listed yet
            </p>
            <p className="text-gray-400 text-xs">
              Career goals will appear here once added
            </p>
          </div>
        )}
      </div>

      {/* Show More/Less Button */}
      {careerGoals.length > 8 && (
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
                  View all {careerGoals.length} career goals
                </>
              )}
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
}
