"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { getMentors } from "@/utilities/handlers/mentorHandler";
import { Mentor } from "@/interface/mentors";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MentorCard from "./MentorCard";

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const accessToken = useAccessToken();

  const loadMentors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        setError("Please sign in to view mentors.");
        setIsLoading(false);
        return;
      }

      const mentorsData = await getMentors(token);
      const actualMentors = mentorsData.filter(
        (mentor) => mentor.user_type === "mentor"
      );
      setMentors(actualMentors);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load mentors";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique industries for filter
  const industries = useMemo(() => {
    const allIndustries = mentors.flatMap(
      (mentor) => mentor.industry?.map((ind) => ind.name) || []
    );
    return [...new Set(allIndustries)].sort();
  }, [mentors]);

  // Filter mentors based on search and industry
  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const matchesSearch =
        searchQuery === "" ||
        mentor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.about?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.skills?.some((skill) =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        mentor.industry?.some((ind) =>
          ind.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        mentor.new_role_values?.some((role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesIndustry =
        selectedIndustry === "all" ||
        mentor.industry?.some((ind) => ind.name === selectedIndustry);

      return matchesSearch && matchesIndustry;
    });
  }, [mentors, searchQuery, selectedIndustry]);

  useEffect(() => {
    loadMentors();
  }, [accessToken]);


  return (
    <div className="bg-transparent">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recommended Mentors
          </h2>
          <p className="text-gray-600">
            Connect with experienced professionals to guide your career journey
          </p>
        </div>

        <Link href="/mentors">
          <Button
            variant="outline"
            className="border-[#334AFF] text-[#334AFF] hover:bg-[#334AFF] hover:text-white transition-colors duration-200"
          >
            View All Mentors
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Input with shadcn Input component */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search mentors by name, skills, industry, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-10"
          />
        </div>

        {/* Industry Filter */}
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      {!isLoading && !error && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
          {(searchQuery || selectedIndustry !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedIndustry("all");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={loadMentors}
              className="bg-[#334AFF] hover:bg-[#251F99] text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredMentors.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No mentors found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedIndustry !== "all"
                ? "Try adjusting your search or filters to find more mentors."
                : "No mentors are available at the moment. Check back soon!"}
            </p>
            {(searchQuery || selectedIndustry !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustry("all");
                }}
                variant="outline"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Mentors Grid */}
      {!isLoading && !error && filteredMentors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}
    </div>
  );
}
