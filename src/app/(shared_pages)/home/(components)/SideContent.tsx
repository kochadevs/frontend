import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMentors } from "@/utilities/handlers/mentorHandler";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import { Mentor, MentorSkill } from "@/interface/mentors";
import { useAccessToken } from "@/store/authStore";

export default function SideContent() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAccessToken();

  const loadMentors = useCallback(async () => {
    try {
      setIsLoading(true);

      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        console.warn("No access token available to fetch mentors");
        return;
      }

      const allMentors = await getMentors(token);
      // Get first 6 mentors
      setMentors(allMentors.slice(0, 6));
    } catch (error) {
      console.error("Error loading mentors:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load mentors"
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getSkillsPreview = (skills: MentorSkill[]) => {
    if (!skills.length) return "No skills listed";
    const skillNames = skills.slice(0, 3).map((skill) => skill.name);
    return skillNames.join(", ") + (skills.length > 3 ? "..." : "");
  };

  return (
    <div className="w-full space-y-6 py-3">
      {/* Mentors Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Featured Mentors
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No mentors available</p>
            <p className="text-gray-400 text-xs mt-1">
              Check back later for mentor updates
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={mentor.profile_pic}
                    alt={`${mentor.first_name} ${mentor.last_name}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {getInitials(mentor.first_name, mentor.last_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {mentor.first_name} {mentor.last_name}
                  </h3>
                  <p className="text-gray-500 text-xs truncate">
                    {mentor.industry.length > 0
                      ? mentor.industry[0].name
                      : "No industry specified"}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 truncate">
                    {getSkillsPreview(mentor.skills)}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs whitespace-nowrap"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Additional content can go here */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Community Events</h3>
        <div className="space-y-3">
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No upcoming events</p>
            <p className="text-gray-400 text-xs mt-1">
              Check back later for events
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
