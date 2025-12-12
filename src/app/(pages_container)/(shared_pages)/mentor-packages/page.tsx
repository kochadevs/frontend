"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MentorPackage,
  CreateMentorPackageRequest,
} from "@/interface/mentorPackages";
import { Mentor } from "@/interface/mentors";
import {
  getMentorPackages,
  createMentorPackage,
  updateMentorPackage,
  deleteMentorPackage,
} from "@/utilities/handlers/mentorPackageHandler";
import { useAccessToken, useUser } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import PackageCard from "@/components/PackageCard";
import CreatePackageModal from "@/components/CreatePackageModal";
import EditPackageModal from "@/components/EditPackageModal";
import DeletePackageModal from "@/components/DeletePackageModal";
import { Package, Loader2, Rocket, Users, Target, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MentorPackagesPage() {
  const [packages, setPackages] = useState<MentorPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<MentorPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "active" | "inactive" | "mine"
  >("all");
  const [editingPackage, setEditingPackage] = useState<MentorPackage | null>(
    null
  );
  const [deletingPackage, setDeletingPackage] = useState<MentorPackage | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const accessToken = useAccessToken();
  const user = useUser();
  const isMentor = user?.user_type === "mentor";

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check if user data is available
      if (!user) {
        toast.error("User data not available. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to view mentor packages.");
        setIsLoading(false);
        return;
      }

      let packagesData: MentorPackage[];

      // Strictly call only one endpoint based on user type
      if (user.user_type === "mentor") {
        // For mentors: fetch only their own packages using mentor-specific endpoint
        packagesData = await getMentorPackages(token, user.id);
      } else {
        // For mentees: fetch all packages using general endpoint
        packagesData = await getMentorPackages(token);
      }

      setPackages(packagesData);
      setFilteredPackages(packagesData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load mentor packages"
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user]);

  const handleCreatePackage = async (
    packageData: CreateMentorPackageRequest
  ) => {
    // Check if user is a mentor
    if (!isMentor) {
      toast.error("Only mentors can create packages.");
      return;
    }

    setIsCreating(true);
    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to create a package.");
        return;
      }

      const newPackage = await createMentorPackage(packageData, token);
      setPackages((prev) => [newPackage, ...prev]);
      toast.success("Package created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create package"
      );
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePackage = async (
    packageId: number,
    packageData: CreateMentorPackageRequest
  ) => {
    // Check if user is a mentor
    if (!isMentor) {
      toast.error("Only mentors can update packages.");
      return;
    }

    setIsUpdating(true);
    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to update the package.");
        return;
      }

      const updatedPackage = await updateMentorPackage(
        packageId,
        packageData,
        token
      );
      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === packageId ? updatedPackage : pkg))
      );
      toast.success("Package updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update package"
      );
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePackage = async (packageId: number) => {
    // Check if user is a mentor
    if (!isMentor) {
      toast.error("Only mentors can delete packages.");
      return;
    }

    setIsDeleting(true);
    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        toast.error("Please sign in to delete the package.");
        return;
      }

      await deleteMentorPackage(packageId, token);
      setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
      toast.success("Package deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete package"
      );
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    // Only load packages when we have user data and access token
    if (user && accessToken) {
      loadPackages();
    }
  }, [accessToken, user, loadPackages]);

  // Filter packages based on search query and filter type
  useEffect(() => {
    let filtered = packages;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((pkg) => {
        const query = searchQuery.toLowerCase();
        return (
          pkg.name.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query)
        );
      });
    }

    // Apply status/ownership filter
    if (filterType === "active") {
      filtered = filtered.filter((pkg) => pkg.is_active);
    } else if (filterType === "inactive") {
      filtered = filtered.filter((pkg) => !pkg.is_active);
    } else if (filterType === "mine" && user?.id && !isMentor) {
      // "Mine" filter only applies to mentees viewing all packages
      filtered = filtered.filter((pkg) => pkg.user_id === user.id);
    }

    setFilteredPackages(filtered);
  }, [packages, searchQuery, filterType, user?.id, isMentor]);

  const handleEditPackage = (pkg: MentorPackage) => {
    setEditingPackage(pkg);
    setShowEditModal(true);
  };

  const handleDeletePackageClick = (pkg: MentorPackage) => {
    setDeletingPackage(pkg);
    setShowDeleteModal(true);
  };

  const handleBookingSuccess = () => {
    toast.success(
      "Booking successful! You'll receive a confirmation email shortly.",
      {
        duration: 5000,
        icon: "🎉",
      }
    );
  };

  // Create a simple mentor object from package data for booking
  const createMentorFromPackage = (pkg: MentorPackage): Mentor => {
    return {
      id: pkg.user_id,
      first_name: "Mentor",
      last_name: `#${pkg.user_id}`,
      email: "",
      gender: "",
      nationality: "",
      location: "",
      phone: "",
      is_active: true,
      email_verified: false,
      profile_pic: "",
      cover_photo: "",
      about: "",
      user_type: "mentor",
      social_links: {},
      availability: {},

      // Nested objects
      professional_background: {
        current_role: "",
        company: "",
        years_of_experience: 0,
        industry: [],
        skills: [],
      },
      goals: {
        career_goals: [],
        long_term_goals: "",
      },
      mentoring_preferences: {
        mentoring_frequency: [],
        mentoring_format: [],
        preferred_skills: [],
        preferred_industries: [],
      },

      // Direct arrays
      new_role_values: [],
      job_search_status: [],
      role_of_interest: [],

      // Other required fields
      code_of_conduct_accepted: false,
      onboarding_completed: false,
      is_onboarded: false,
    };
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
  };

  const getFilterCounts = () => {
    const active = packages.filter((pkg) => pkg.is_active).length;
    const inactive = packages.filter((pkg) => !pkg.is_active).length;
    // For mentors, "mine" doesn't make sense since they only see their own packages
    // For mentees, "mine" shows packages they might have created (if any)
    const mine =
      user?.id && !isMentor
        ? packages.filter((pkg) => pkg.user_id === user.id).length
        : 0;

    return { active, inactive, mine, total: packages.length };
  };

  const counts = getFilterCounts();

  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 relative">
      {/* Enhanced Banner Header */}
      <div className=" z-20 md:sticky md:top-0 bg-gradient-to-r from-[#251F99] to-[#6C47FF] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10  px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {isMentor ? "My Mentor Packages" : "Mentor Packages"}
                  </h1>
                  <p className="text-white/80 text-sm">
                    {isMentor
                      ? "Create and manage your mentorship packages"
                      : "Discover mentorship packages from experienced mentors"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium">Expert Mentors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium">Custom Packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium">Proven Results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              {/* Filter Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={filterType === "all" ? "secondary" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filterType === "all"
                      ? "bg-white text-[#334AFF] hover:bg-white/90"
                      : "bg-white/10 text-white hover:bg-white/20 border-white/30"
                  }`}
                  onClick={() => setFilterType("all")}
                >
                  All ({counts.total})
                </Badge>

                <Badge
                  variant={filterType === "active" ? "secondary" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filterType === "active"
                      ? "bg-white text-[#334AFF] hover:bg-white/90"
                      : "bg-white/10 text-white hover:bg-white/20 border-white/30"
                  }`}
                  onClick={() => setFilterType("active")}
                >
                  Active ({counts.active})
                </Badge>

                <Badge
                  variant={filterType === "inactive" ? "secondary" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filterType === "inactive"
                      ? "bg-white text-[#334AFF] hover:bg-white/90"
                      : "bg-white/10 text-white hover:bg-white/20 border-white/30"
                  }`}
                  onClick={() => setFilterType("inactive")}
                >
                  Inactive ({counts.inactive})
                </Badge>

                {user?.id && !isMentor && (
                  <Badge
                    variant={filterType === "mine" ? "secondary" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      filterType === "mine"
                        ? "bg-white text-[#334AFF] hover:bg-white/90"
                        : "bg-white/10 text-white hover:bg-white/20 border-white/30"
                    }`}
                    onClick={() => setFilterType("mine")}
                  >
                    My Packages ({counts.mine})
                  </Badge>
                )}
              </div>
            </div>

            {/* Create Package Button */}
            {isMentor && (
              <CreatePackageModal
                onCreatePackage={handleCreatePackage}
                isLoading={isCreating}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
              <p className="text-gray-600">Loading packages...</p>
            </div>
          </div>
        )}

        {/* No Packages Found */}
        {!isLoading && filteredPackages.length === 0 && (
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {packages.length === 0
                  ? "No packages available"
                  : "No packages match your filters"}
              </h3>
              <p className="text-gray-600 mb-4">
                {packages.length === 0
                  ? isMentor
                    ? "Create your first mentor package to start offering your mentorship services!"
                    : "No mentor packages are available at the moment. Check back soon!"
                  : "Try adjusting your search criteria or clearing filters to see more results."}
              </p>
              {(searchQuery || filterType !== "all") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mb-4"
                >
                  Clear All Filters
                </Button>
              )}
              {packages.length === 0 && isMentor && (
                <CreatePackageModal
                  onCreatePackage={handleCreatePackage}
                  isLoading={isCreating}
                />
              )}
            </div>
          </div>
        )}

        {/* Packages Grid */}
        {!isLoading && filteredPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                mentor={!isMentor ? createMentorFromPackage(pkg) : undefined}
                onEdit={handleEditPackage}
                onDelete={handleDeletePackageClick}
                onBookingSuccess={handleBookingSuccess}
                showActions={isMentor && pkg.user_id === user?.id}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Package Modal */}
      <EditPackageModal
        package={editingPackage}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPackage(null);
        }}
        onUpdatePackage={handleUpdatePackage}
        isLoading={isUpdating}
      />

      {/* Delete Package Modal */}
      <DeletePackageModal
        package={deletingPackage}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingPackage(null);
        }}
        onDeletePackage={handleDeletePackage}
        isLoading={isDeleting}
      />
    </div>
  );
}
