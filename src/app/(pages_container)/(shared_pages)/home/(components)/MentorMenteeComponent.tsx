import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMentors } from "@/utilities/handlers/mentorHandler";
import { toast } from "react-hot-toast";
import { useAccessToken, useUser } from "@/store/authStore";
import Link from "next/link";
import { UserProfile, Skill } from "@/interface/auth/login";
import { getMentees } from "@/utilities/handlers/menteeHandler";
import { waitForAuthHydration } from "@/utilities/authUtils";

interface MentorMenteeComponentProps {
  maxItems?: number;
  showConnectButton?: boolean;
  showViewAll?: boolean;
}

export default function MentorMenteeComponent({
  maxItems = 6,
  showConnectButton = true,
  showViewAll = true,
}: Readonly<MentorMenteeComponentProps>) {
  const [data, setData] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMentees, setIsFetchingMentees] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const accessToken = useAccessToken();
  const user = useUser();

  // Determine title based on what we're fetching
  const displayTitle = isFetchingMentees ? "Mentees" : "Featured Mentors";
  const viewAllLink = isFetchingMentees ? "/mentees" : "/mentor_match";

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Wait for auth store to hydrate before proceeding (including user data)
      const authResult = await waitForAuthHydration(accessToken, user);

      if (!authResult.isReady) {
        setAuthError(authResult.error || "Authentication system not ready");
        return;
      }

      if (!authResult.token) {
        setAuthError(authResult.error || "Authentication required");
        console.warn("No access token available to fetch data");
        return;
      }

      // Now we can safely check user type
      const userType = authResult.user?.user_type?.toLowerCase();
      const shouldFetchMentees = userType === "mentor";

      // Update fetching state for UI
      setIsFetchingMentees(shouldFetchMentees);
      setUserType(userType || null);

      let result: UserProfile[] = [];

      if (shouldFetchMentees) {
        // If user is a mentor, fetch their mentees
        const mentees = await getMentees(authResult.token);
        result = mentees.slice(0, maxItems);
      } else {
        // If user is a mentee or other, fetch mentors
        const mentors = await getMentors(authResult.token);
        result = mentors.slice(0, maxItems);
      }

      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user, maxItems]);

  useEffect(() => {
    // Always try to load data, but it will wait for hydration
    loadData();
  }, [loadData]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper function to get skills from UserProfile
  const getSkills = (item: UserProfile): Skill[] => {
    return item.professional_background?.skills || [];
  };

  const getSkillsPreview = (skills: Skill[]) => {
    if (!skills.length) return "No skills listed";
    const skillNames = skills.slice(0, 3).map((skill) => skill.name);
    return skillNames.join(", ") + (skills.length > 3 ? "..." : "");
  };

  // Helper function to get industry from UserProfile
  const getIndustry = (item: UserProfile): string => {
    const industries = item.professional_background?.industry || [];
    return industries.length > 0 ? industries[0].name : "No industry specified";
  };

  // Get user type for display
  const getUserType = (item: UserProfile): string => {
    return item.user_type || (isFetchingMentees ? "Mentee" : "Mentor");
  };

  // Get role/position for display
  const getUserRole = (item: UserProfile): string => {
    return item.professional_background?.current_role || "No role specified";
  };

  // Get company for display
  const getCompany = (item: UserProfile): string => {
    return item.professional_background?.company || "No company specified";
  };

  // Show auth error if present
  if (authError) {
    return (
      <Card className="p-6">
        <div className="text-center py-6">
          <p className="text-red-500 text-sm">{authError}</p>
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // Show loading state if we don't know what to fetch yet
  if (isLoading && userType === null && !authError) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(Math.min(3, maxItems))].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{displayTitle}</h2>
        {showViewAll && data.length > 0 && (
          <Link href={viewAllLink}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              View All
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(Math.min(3, maxItems))].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            {isFetchingMentees
              ? "No mentees assigned yet"
              : "No mentors available"}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {isFetchingMentees
              ? "Check back later for mentee assignments"
              : "Check back later for mentor updates"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1 items-start  p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={item.profile_pic}
                    alt={`${item.first_name} ${item.last_name}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {getInitials(item.first_name, item.last_name)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {item.first_name} {item.last_name}
                </h3>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="truncate">{getUserRole(item)}</span>
                  <span>•</span>
                  <span className="truncate">{getCompany(item)}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {getIndustry(item)}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs font-medium text-blue-600 capitalize">
                    {getUserType(item)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1 truncate">
                  {getSkillsPreview(getSkills(item))}
                </p>
              </div>

              {showConnectButton && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs whitespace-nowrap"
                >
                  {isFetchingMentees ? "Message" : "Connect"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick stats */}
      {data.length > 0 && (
        <div className=" pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total {displayTitle.toLowerCase()}
            </span>
            <span className="font-semibold text-gray-900">{data.length}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
