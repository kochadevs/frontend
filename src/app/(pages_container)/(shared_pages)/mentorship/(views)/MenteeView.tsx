"use client";
import { useUser } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  MapPin,
  Building,
  Briefcase,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import { UserProfile } from "@/interface/auth/login";

export default function MenteeView() {
  const user = useUser() as UserProfile | null;

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#251F99] mb-4"></div>
        <p className="text-gray-600">Loading mentee profile...</p>
      </div>
    );
  }

  // Helper to check if career goals exist
  const hasCareerGoals =
    user.goals?.career_goals && user.goals.career_goals.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mentee Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user.first_name}! Here&apos;s an overview of your mentorship
          journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Career Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Short Term Goals (Career Goals) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Short Term Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasCareerGoals ? (
                <div className="flex flex-wrap gap-3">
                  {user.goals.career_goals.map((goal) => (
                    <Badge
                      key={goal.id}
                      className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-4 py-2 text-sm"
                    >
                      <CheckCircle className="w-3 h-3 mr-2" />
                      {goal.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No short term goals specified yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add your career goals to help mentors understand your
                    objectives
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Long Term Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Long Term Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.goals?.long_term_goals ? (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-gray-800 whitespace-pre-line">
                    {user.goals.long_term_goals}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No long term goals specified yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Define your long-term vision to guide your mentorship
                    journey
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Professional Background
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Current Role
                      </p>
                      <p className="font-medium text-gray-900">
                        {user.professional_background?.current_role ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Experience
                      </p>
                      <p className="font-medium text-gray-900">
                        {user.professional_background?.years_of_experience || 0}{" "}
                        years
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="font-medium text-gray-900">
                        {user.location || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Company
                      </p>
                      <p className="font-medium text-gray-900">
                        {user.professional_background?.company ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Mentor Preferences */}
        <div className="space-y-6">
          {/* Mentor Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Mentor Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Industry Preferences */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Industries
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.mentoring_preferences?.preferred_industries &&
                  user.mentoring_preferences.preferred_industries.length > 0 ? (
                    user.mentoring_preferences.preferred_industries.map(
                      (ind) => (
                        <Badge
                          key={ind.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {ind.name}
                        </Badge>
                      )
                    )
                  ) : (
                    <p className="text-sm text-gray-500">Any industry</p>
                  )}
                </div>
              </div>

              {/* Role Interests */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Role Interests
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.role_of_interest && user.role_of_interest.length > 0 ? (
                    user.role_of_interest.map((role) => (
                      <Badge
                        key={role.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Any role</p>
                  )}
                </div>
              </div>

              {/* Mentoring Frequency */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preferred Frequency
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.mentoring_preferences?.mentoring_frequency &&
                  user.mentoring_preferences.mentoring_frequency.length > 0 ? (
                    user.mentoring_preferences.mentoring_frequency.map(
                      (freq) => (
                        <Badge
                          key={freq.id}
                          className="bg-blue-50 text-blue-700 text-xs"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          {freq.name}
                        </Badge>
                      )
                    )
                  ) : (
                    <p className="text-sm text-gray-500">Flexible</p>
                  )}
                </div>
              </div>

              {/* Mentoring Format */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preferred Format
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.mentoring_preferences?.mentoring_format &&
                  user.mentoring_preferences.mentoring_format.length > 0 ? (
                    user.mentoring_preferences.mentoring_format.map(
                      (format) => (
                        <Badge
                          key={format.id}
                          className="bg-green-50 text-green-700 text-xs"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {format.name}
                        </Badge>
                      )
                    )
                  ) : (
                    <p className="text-sm text-gray-500">Any format</p>
                  )}
                </div>
              </div>

              {/* Job Search Status */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Job Search Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.job_search_status &&
                  user.job_search_status.length > 0 ? (
                    user.job_search_status.map((status) => (
                      <Badge
                        key={status.id}
                        className="bg-purple-50 text-purple-700 text-xs"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {status.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Not specified</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Values */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Skills & Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Professional Skills */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {user.professional_background?.skills &&
                  user.professional_background.skills.length > 0 ? (
                    user.professional_background.skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {skill.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Preferred Skills */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preferred Skills to Learn
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.mentoring_preferences?.preferred_skills &&
                  user.mentoring_preferences.preferred_skills.length > 0 ? (
                    user.mentoring_preferences.preferred_skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Not specified</p>
                  )}
                </div>
              </div>

              {/* Role Values */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Role Values
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.new_role_values && user.new_role_values.length > 0 ? (
                    user.new_role_values.map((value) => (
                      <Badge
                        key={value.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {value.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Not specified</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Goals Set</span>
                    <span className="font-medium text-gray-900">
                      {hasCareerGoals ? user.goals.career_goals.length : 0}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          hasCareerGoals
                            ? Math.min(user.goals.career_goals.length * 20, 100)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Preferences Defined</span>
                    <span className="font-medium text-gray-900">
                      {
                        [
                          user.mentoring_preferences?.preferred_industries
                            ?.length || 0,
                          user.role_of_interest?.length || 0,
                          user.mentoring_preferences?.mentoring_frequency
                            ?.length || 0,
                          user.mentoring_preferences?.mentoring_format
                            ?.length || 0,
                        ].filter((count) => count > 0).length
                      }
                      /4
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          ([
                            user.mentoring_preferences?.preferred_industries
                              ?.length || 0,
                            user.role_of_interest?.length || 0,
                            user.mentoring_preferences?.mentoring_frequency
                              ?.length || 0,
                            user.mentoring_preferences?.mentoring_format
                              ?.length || 0,
                          ].filter((count) => count > 0).length /
                            4) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
