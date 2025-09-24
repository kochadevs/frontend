"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mentor } from "@/interface/mentors";
import { MapPin, User } from "lucide-react";

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const getAvatarUrl = (profilePic: string, firstName: string) => {
    if (profilePic && profilePic.trim() !== '') {
      return profilePic;
    }
    // Generate a placeholder avatar based on first letter of name
    const initial = firstName?.charAt(0).toUpperCase() || 'M';
    return `https://ui-avatars.com/api/?name=${initial}&background=334AFF&color=fff&size=128`;
  };

  const fullName = `${mentor.first_name} ${mentor.last_name}`.trim();
  const avatarUrl = getAvatarUrl(mentor.profile_pic, mentor.first_name);

  // Get primary role/industry for display
  const primaryRole = mentor.role_of_interest?.[0]?.name || mentor.new_role_values?.[0]?.name;
  const primaryIndustry = mentor.industry?.[0]?.name;

  return (
    <Card className="group overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#334AFF]/20">
      <CardContent className="p-6">
        {/* Header with avatar and basic info */}
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="h-16 w-16 ring-2 ring-gray-100">
            <AvatarImage 
              src={avatarUrl} 
              alt={fullName}
              className="object-cover" 
            />
            <AvatarFallback className="bg-[#334AFF] text-white text-lg font-semibold">
              {mentor.first_name?.charAt(0) || 'M'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-[#334AFF] transition-colors">
              {fullName}
            </h3>
            
            {primaryRole && (
              <p className="text-sm text-gray-600 truncate">
                {primaryRole}
              </p>
            )}
            
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {mentor.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{mentor.location}</span>
                </div>
              )}
              
              {mentor.user_type && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="capitalize">{mentor.user_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About section */}
        {mentor.about && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              {mentor.about}
            </p>
          </div>
        )}

        {/* Industry badge */}
        {primaryIndustry && (
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className="bg-[#334AFF]/10 text-[#334AFF] border-[#334AFF]/20 hover:bg-[#334AFF]/20"
            >
              {primaryIndustry}
            </Badge>
          </div>
        )}

        {/* Skills section */}
        {mentor.skills && mentor.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {mentor.skills.slice(0, 3).map((skill) => (
                <Badge 
                  key={skill.id} 
                  variant="outline" 
                  className="text-xs px-2 py-1 border-gray-300 text-gray-600"
                >
                  {skill.name}
                </Badge>
              ))}
              {mentor.skills.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-1 border-gray-300 text-gray-500"
                >
                  +{mentor.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Career goals */}
        {mentor.career_goals && mentor.career_goals.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Career Goals</p>
            <div className="flex flex-wrap gap-1">
              {mentor.career_goals.slice(0, 2).map((goal) => (
                <Badge 
                  key={goal.id} 
                  variant="outline" 
                  className="text-xs px-2 py-1 border-green-300 text-green-700 bg-green-50"
                >
                  {goal.name}
                </Badge>
              ))}
              {mentor.career_goals.length > 2 && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-1 border-green-300 text-green-600"
                >
                  +{mentor.career_goals.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs hover:bg-[#334AFF]/10 hover:text-[#334AFF] hover:border-[#334AFF]/30"
          >
            View Profile
          </Button>
          
          <Button 
            size="sm" 
            className="flex-1 text-xs bg-[#334AFF] hover:bg-[#334AFF]/90"
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}