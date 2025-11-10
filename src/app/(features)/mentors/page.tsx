"use client";

import { useState, useEffect } from "react";
import { Mentor } from "@/interface/mentors";
import { getMentors } from "@/utilities/handlers/mentorHandler";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import {
  Search,
  Users,
  Loader2,
  X,
  Target,
  Star,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MentorCard from "../mentor_match/(components)/MentorCard";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);

  const accessToken = useAccessToken();

  const loadMentors = async () => {
    setIsLoading(true);
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to view mentors.");
        setIsLoading(false);
        return;
      }

      const mentorsData = await getMentors(token);
      const actualMentors = mentorsData.filter(
        (mentor) => mentor.user_type === "mentor"
      );
      setMentors(actualMentors);
      setFilteredMentors(actualMentors);

      // Extract unique industries for filtering
      const industries = Array.from(
        new Set(
          actualMentors.flatMap(
            (mentor) => mentor.industry?.map((ind) => ind.name) || []
          )
        )
      ).filter(Boolean);
      setAvailableIndustries(industries);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load mentors"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, [accessToken]);

  // Filter mentors based on search query and selected industry
  useEffect(() => {
    let filtered = mentors;

    if (searchQuery.trim()) {
      filtered = filtered.filter((mentor) => {
        const fullName =
          `${mentor.first_name} ${mentor.last_name}`.toLowerCase();
        const about = mentor.about?.toLowerCase() || "";
        const skills =
          mentor.skills?.map((s) => s.name.toLowerCase()).join(" ") || "";
        const roles =
          mentor.role_of_interest?.map((r) => r.name.toLowerCase()).join(" ") ||
          "";
        const industry =
          mentor.industry?.map((i) => i.name.toLowerCase()).join(" ") || "";
        const location = mentor.location?.toLowerCase() || "";

        const query = searchQuery.toLowerCase();
        return (
          fullName.includes(query) ||
          about.includes(query) ||
          skills.includes(query) ||
          roles.includes(query) ||
          industry.includes(query) ||
          location.includes(query)
        );
      });
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter((mentor) =>
        mentor.industry?.some((ind) => ind.name === selectedIndustry)
      );
    }

    setFilteredMentors(filtered);
  }, [mentors, searchQuery, selectedIndustry]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("all");
  };

  const hasActiveFilters = searchQuery || selectedIndustry !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Blue Banner */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#251F99] to-[#6C47FF] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-4 w-4" />
                </div>
                <h1 className="text-2xl font-bold">Find Your Perfect Mentor</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium">Industry Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium">
                    Personalized Guidance
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium">Global Network</span>
                </div>
              </div>

              <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                Connect with industry-leading mentors who can guide your career
                journey. Get personalized advice, strategic insights, and
                actionable guidance from experienced professionals across
                various industries.
              </p>
            </div>

            {!isLoading && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {filteredMentors.length}
                </div>
                <div className="text-white/80 text-sm">
                  Mentor{filteredMentors.length !== 1 ? "s" : ""} Available
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Search and Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
            {/* Search Input */}
            <div className="w-[334px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search Mentors
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, skills, industry, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div className="w-full lg:w-64">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Filter by Industry
              </label>
              <Select
                value={selectedIndustry}
                onValueChange={setSelectedIndustry}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {availableIndustries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700"
                  >
                    Search: &quot;{searchQuery}&quot;
                  </Badge>
                )}
                {selectedIndustry !== "all" && (
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700"
                  >
                    Industry: {selectedIndustry}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
              <p className="text-gray-600">Loading mentors...</p>
            </div>
          </div>
        )}

        {/* No Mentors Found */}
        {!isLoading && filteredMentors.length === 0 && (
          <div className=" p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {mentors.length === 0
                  ? "No mentors available yet"
                  : "No mentors found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {mentors.length === 0
                  ? "We're working on adding mentors to our platform. Check back soon!"
                  : "Try adjusting your search criteria or clearing filters to see more results."}
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  className="bg-[#334AFF] hover:bg-[#251F99] text-white"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Mentors Grid */}
        {!isLoading && filteredMentors.length > 0 && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Mentors
                </h2>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {filteredMentors.length} found
                </Badge>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
