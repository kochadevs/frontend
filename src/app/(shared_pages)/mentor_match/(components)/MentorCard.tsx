"use client";

import { Button } from "@/components/ui/button";
import { Star, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { Mentor } from "@/interface/mentors";
import { CustomAvatar } from "@/components/common/CustomAvatar";

export default function MentorCard({ mentor }: Readonly<{ mentor: Mentor }>){
   return(
     <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full">
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start gap-4 mb-2">
        <div className="flex-shrink-0">
          <CustomAvatar
            src={mentor?.profile_pic}
            name={`${mentor?.first_name} ${mentor?.last_name}`}
            className="w-16 h-16 border-2 border-white shadow-md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
            {mentor.first_name} {mentor.last_name || ""}
          </h3>
          <p className="text-gray-600 font-medium text-sm mb-2">
            {mentor.new_role_values?.[0]?.name || "Mentor"}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, index) => (
              <Star
                key={`yellow-${mentor.id}-${index}`}
                size={14}
                className="text-yellow-400 fill-yellow-400"
              />
            ))}
            {[...Array(2)].map((_, index) => (
              <Star
                key={`gray-${mentor.id}-${index}`}
                size={14}
                className="text-gray-200 fill-gray-200"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Location and Industry */}
      <div className="flex flex-col gap-2">
        {mentor.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} className="text-gray-400" />
            <span className="truncate">{mentor.location}</span>
          </div>
        )}
        {mentor.industry?.[0] && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 size={14} className="text-gray-400" />
            <span className="truncate">{mentor.industry[0].name}</span>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm mb-2">About</h4>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {mentor.about ||
            "Experienced mentor ready to guide you in your career journey."}
        </p>
      </div>

      {/* Skills Preview */}
      {mentor.skills && mentor.skills.length > 0 && (
        <div >
          <h4 className="font-semibold text-gray-900 text-sm mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {mentor.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
              >
                {skill.name}
              </span>
            ))}
            {mentor.skills.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{mentor.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-auto pt-4">
        <Link href={`/mentor_match/mentor/${mentor.id}`} className="block">
          <Button className="w-full bg-gradient-to-r from-[#334AFF] to-[#6C47FF] hover:from-[#251F99] hover:to-[#334AFF] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
   )
};