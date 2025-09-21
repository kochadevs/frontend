"use client";

import { useState, useEffect } from "react";
import { Mentor } from "@/interface/mentors";
import { getMentors } from "@/utilities/mentorHandler";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import MentorCard from "@/components/MentorCard";
import { Search, Users, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
  
  const accessToken = useAccessToken();

  const loadMentors = async () => {
    setIsLoading(true);
    try {
      // Try to get token from store first, then from cookies as fallback
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
      setMentors(mentorsData);
      setFilteredMentors(mentorsData);
      
      // Extract unique industries for filtering
      const industries = Array.from(new Set(
        mentorsData.flatMap(mentor => 
          mentor.industry?.map(ind => ind.name) || []
        )
      )).filter(Boolean);
      setAvailableIndustries(industries);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load mentors");
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
      filtered = filtered.filter(mentor => {
        const fullName = `${mentor.first_name} ${mentor.last_name}`.toLowerCase();
        const about = mentor.about?.toLowerCase() || "";
        const skills = mentor.skills?.map(s => s.name.toLowerCase()).join(" ") || "";
        const roles = mentor.role_of_interest?.map(r => r.name.toLowerCase()).join(" ") || "";
        
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || 
               about.includes(query) || 
               skills.includes(query) || 
               roles.includes(query);
      });
    }

    if (selectedIndustry) {
      filtered = filtered.filter(mentor =>
        mentor.industry?.some(ind => ind.name === selectedIndustry)
      );
    }

    setFilteredMentors(filtered);
  }, [mentors, searchQuery, selectedIndustry]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustry(null);
  };

  return (
    <div className="min-h-[85vh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#334AFF]/10 rounded-lg">
                <Users className="h-6 w-6 text-[#334AFF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Mentors</h1>
                <p className="text-sm text-gray-600">Connect with experienced professionals</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{filteredMentors.length} mentors found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search mentors by name, skills, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Clear Filters */}
            {(searchQuery || selectedIndustry) && (
              <Button variant="outline" onClick={clearFilters} className="shrink-0">
                Clear Filters
              </Button>
            )}
          </div>

          {/* Industry Filter */}
          {availableIndustries.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Filter by Industry:</p>
              <div className="flex flex-wrap gap-2">
                {availableIndustries.map((industry) => (
                  <Badge
                    key={industry}
                    variant={selectedIndustry === industry ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedIndustry === industry
                        ? "bg-[#334AFF] hover:bg-[#334AFF]/90"
                        : "hover:bg-[#334AFF]/10 hover:text-[#334AFF] hover:border-[#334AFF]/30"
                    }`}
                    onClick={() => setSelectedIndustry(
                      selectedIndustry === industry ? null : industry
                    )}
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
              <p className="text-gray-600">Loading mentors...</p>
            </div>
          </div>
        )}

        {/* No Mentors Found */}
        {!isLoading && filteredMentors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {mentors.length === 0 ? "No mentors available" : "No mentors match your search"}
              </h3>
              <p className="text-gray-600 mb-4">
                {mentors.length === 0 
                  ? "There are currently no mentors in the system."
                  : "Try adjusting your search criteria or clearing filters to see more results."
                }
              </p>
              {(searchQuery || selectedIndustry) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Mentors Grid */}
        {!isLoading && filteredMentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}