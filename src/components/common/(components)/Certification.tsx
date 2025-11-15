import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function Certification() {
  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Award className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Certifications
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Professional certifications and credentials
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No certifications yet
        </h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Professional certifications will appear here once they are added to
          the profile.
        </p>
      </div>
    </Card>
  );
}
