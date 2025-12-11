/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccessToken, useUser } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { UserProfile } from "@/interface/auth/login";
import { fetchUserProfile } from "@/utilities/handlers/authHandler";
import Loader from "@/components/common/Loader";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Building,
  Target,
  GraduationCap,
  Calendar,
  Award,
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  CalendarDays,
  Clock4,
} from "lucide-react";

const ProfileView = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAccessToken();
  const user = useUser();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      if (!user?.id) {
        throw new Error("User ID not found.");
      }

      const data = await fetchUserProfile(token, user.id);
      setProfile(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [accessToken, user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader text="Loading my Profile...." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button onClick={fetchProfile}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">No profile data found.</p>
            <Button onClick={fetchProfile}>Load Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              {/* Profile Picture and About Information */}
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Circular Profile Picture */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-300">
                    {profile.profile_pic ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={profile.profile_pic}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          fill
                          className="object-cover"
                          sizes="160px"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <span className="text-4xl font-bold text-blue-600">
                          {profile.first_name?.[0] || ""}
                          {profile.last_name?.[0] || ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* About Content */}
                <div className="flex-1">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-gray-700 whitespace-pre-line min-h-[100px]">
                      {profile.about || "No about information provided."}
                    </p>
                  </CardContent>
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Background
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Current Role
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.professional_background?.current_role ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Company
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.professional_background?.company ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Years of Experience
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.professional_background?.years_of_experience ||
                          0}{" "}
                        years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Industry Experience
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.professional_background?.industry?.length || 0}{" "}
                        industries
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Career Goals & Aspirations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Long-term Goals
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">
                      {profile.goals?.long_term_goals ||
                        "No long-term goals specified."}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Immediate Career Goals
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.goals?.career_goals?.length > 0 ? (
                        profile.goals.career_goals.map((goal) => (
                          <Badge key={goal.id} variant="secondary">
                            {goal.name}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No career goals specified.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills & Interests */}
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.professional_background?.skills?.length > 0 ? (
                      profile.professional_background.skills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="mb-1"
                        >
                          {skill.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills listed.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {profile.user_type === "mentee" &&
                profile.mentoring_preferences?.preferred_skills?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Skills to Learn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentoring_preferences.preferred_skills.map(
                          (skill) => (
                            <Badge
                              key={skill.id}
                              variant="outline"
                              className="mb-1"
                            >
                              {skill.name}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Industry & Role Interests */}
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {profile.user_type === "mentor"
                      ? "Industry Expertise"
                      : "Industry Interests"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.professional_background?.industry?.length > 0 ? (
                      profile.professional_background.industry.map(
                        (industry) => (
                          <Badge
                            key={industry.id}
                            variant="secondary"
                            className="mb-1"
                          >
                            {industry.name}
                          </Badge>
                        )
                      )
                    ) : (
                      <p className="text-gray-500">No industries selected.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {profile.user_type === "mentee" &&
                profile.mentoring_preferences?.preferred_industries?.length >
                  0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Preferred Mentoring Industries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentoring_preferences.preferred_industries.map(
                          (industry) => (
                            <Badge
                              key={industry.id}
                              variant="outline"
                              className="mb-1"
                            >
                              {industry.name}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Roles of Interest */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Roles of Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.role_of_interest?.length > 0 ? (
                    profile.role_of_interest.map((role) => (
                      <Badge key={role.id} variant="secondary" className="mb-1">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No roles of interest specified.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            {profile.availability &&
              Object.keys(profile.availability).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(profile.availability).map(
                        ([day, times]) => (
                          <div
                            key={day}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900 capitalize">
                                {day}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock4 className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {Array.isArray(times)
                                  ? times.join(", ")
                                  : typeof times === "string"
                                  ? times
                                  : "Available"}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.email}
                    </p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.phone}
                      </p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.location}
                    </p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.nationality}
                    </p>
                    <p className="text-xs text-gray-500">Nationality</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Search Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Job Search Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.job_search_status?.length > 0 ? (
                    profile.job_search_status.map((status) => (
                      <Badge
                        key={status.id}
                        className="bg-blue-100 text-blue-800"
                      >
                        {status.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No job search status specified.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mentoring Preferences */}
            {profile.user_type === "mentee" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Mentoring Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Preferred Frequency
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.mentoring_preferences?.mentoring_frequency
                        ?.length > 0 ? (
                        profile.mentoring_preferences.mentoring_frequency.map(
                          (freq) => (
                            <Badge key={freq.id} variant="outline">
                              {freq.name}
                            </Badge>
                          )
                        )
                      ) : (
                        <p className="text-sm text-gray-500">Not specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Preferred Format
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.mentoring_preferences?.mentoring_format?.length >
                      0 ? (
                        profile.mentoring_preferences.mentoring_format.map(
                          (format) => (
                            <Badge key={format.id} variant="secondary">
                              {format.name}
                            </Badge>
                          )
                        )
                      ) : (
                        <p className="text-sm text-gray-500">Not specified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New Role Values */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Role Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.new_role_values?.length > 0 ? (
                    profile.new_role_values.map((value) => (
                      <Badge key={value.id} variant="outline">
                        {value.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No role values specified.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Onboarding
                  </p>
                  <div className="flex items-center gap-2">
                    {profile.onboarding_completed ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">User Type</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      {profile.user_type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    {profile.is_active ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Verification
                  </p>
                  <div className="flex items-center gap-2">
                    {profile.email_verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Profile Status
                  </p>
                  <div className="flex items-center gap-2">
                    {profile.is_onboarded ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Fully Onboarded
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Setup Incomplete
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <Button className="bg-[#251F99] hover:bg-[#251F99]/90">
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
