/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import {
  User,
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
} from "lucide-react";
import { UserProfile } from "@/interface/auth/login";
import { fetchUserProfile } from "@/utilities/handlers/authHandler";
import Loader from "@/components/common/Loader";

const ProfileView = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAccessToken();

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

      const data = await fetchUserProfile(token);
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
  }, [accessToken]);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.about || "No about information provided."}
                </p>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <div className="grid grid-cols-1 gap-6">
              {/* Career Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Long-term Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.long_term_goals || "No long-term goals specified."}
                  </p>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Years of Experience
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.years_of_experience} years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Current Role
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.current_role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills & Interests */}
            <div className="grid grid-cols-1  gap-6">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills listed.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Career Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Career Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.career_goals?.length > 0 ? (
                      profile.career_goals.map((goal) => (
                        <Badge key={goal.id} variant="outline">
                          {goal.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No career goals specified.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Industry & Role Interests */}
            <div className="grid grid-cols-1 gap-6">
              {/* Industries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Industries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.industry?.length > 0 ? (
                      profile.industry.map((industry) => (
                        <Badge key={industry.id} variant="secondary">
                          {industry.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No industries selected.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

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
                        <Badge key={role.id} variant="outline">
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
            </div>
          </div>

          {/* Right Column - Contact & Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.email}
                    </p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.phone}
                      </p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.location}
                    </p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.nationality}
                    </p>
                    <p className="text-xs text-gray-500">Nationality</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.gender}
                    </p>
                    <p className="text-xs text-gray-500">Gender</p>
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
                    Frequency
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.mentoring_frequency?.length > 0 ? (
                      profile.mentoring_frequency.map((freq) => (
                        <Badge key={freq.id} variant="outline">
                          {freq.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Format
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.mentoring_format?.length > 0 ? (
                      profile.mentoring_format.map((format) => (
                        <Badge key={format.id} variant="secondary">
                          {format.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

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
                {/* <div className="hidden">
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(profile.date_created)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(profile.last_modified)}
                  </p>
                </div> */}
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
                  <p className="text-sm font-medium text-gray-500">
                    Code of Conduct
                  </p>
                  <div className="flex items-center gap-2">
                    {profile.code_of_conduct_accepted ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Accepted
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
