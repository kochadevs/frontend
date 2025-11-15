import { Card } from "@/components/ui/card";
import { Mentor } from "@/interface/mentors";
import {  User } from "lucide-react";

type AboutProps = {
  mentor?: Mentor | null;
};

export default function About({ mentor }: Readonly<AboutProps>) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 ">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">About</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        {/* About Text */}
        <div className="mb-8">
          {mentor?.about ? (
            <p className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap">
              {mentor.about}
            </p>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                This mentor has not provided an about section yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
