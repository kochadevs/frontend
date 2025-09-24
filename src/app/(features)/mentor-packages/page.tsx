"use client";

import { useState, useEffect } from "react";
import { MentorPackage, CreateMentorPackageRequest } from "@/interface/mentorPackages";
import { Mentor } from "@/interface/mentors";
import { getMentorPackages, createMentorPackage, updateMentorPackage, deleteMentorPackage } from "@/utilities/mentorPackageHandler";
import { useAccessToken, useUser } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import PackageCard from "@/components/PackageCard";
import CreatePackageModal from "@/components/CreatePackageModal";
import EditPackageModal from "@/components/EditPackageModal";
import DeletePackageModal from "@/components/DeletePackageModal";
import { Package, Loader2 } from "lucide-react";
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
  const [filterType, setFilterType] = useState<"all" | "active" | "inactive" | "mine">("all");
  const [editingPackage, setEditingPackage] = useState<MentorPackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<MentorPackage | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const accessToken = useAccessToken();
  const user = useUser();
  const isMentor = user?.user_type === "mentor";

  const loadPackages = async () => {
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
      toast.error(error instanceof Error ? error.message : "Failed to load mentor packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePackage = async (packageData: CreateMentorPackageRequest) => {
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
      setPackages(prev => [newPackage, ...prev]);
      toast.success("Package created successfully!");
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create package");
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePackage = async (packageId: number, packageData: CreateMentorPackageRequest) => {
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

      const updatedPackage = await updateMentorPackage(packageId, packageData, token);
      setPackages(prev => prev.map(pkg => pkg.id === packageId ? updatedPackage : pkg));
      toast.success("Package updated successfully!");
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update package");
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
      setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
      toast.success("Package deleted successfully!");
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete package");
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
  }, [accessToken, user?.id, user?.user_type]);

  // Filter packages based on search query and filter type
  useEffect(() => {
    let filtered = packages;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(pkg => {
        const query = searchQuery.toLowerCase();
        return pkg.name.toLowerCase().includes(query) || 
               pkg.description.toLowerCase().includes(query);
      });
    }

    // Apply status/ownership filter
    if (filterType === "active") {
      filtered = filtered.filter(pkg => pkg.is_active);
    } else if (filterType === "inactive") {
      filtered = filtered.filter(pkg => !pkg.is_active);
    } else if (filterType === "mine" && user?.id && !isMentor) {
      // "Mine" filter only applies to mentees viewing all packages
      filtered = filtered.filter(pkg => pkg.user_id === user.id);
    }

    setFilteredPackages(filtered);
  }, [packages, searchQuery, filterType, user?.id]);

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
      first_name: "Mentor", // We'll use generic names since we don't have full mentor data
      last_name: `#${pkg.user_id}`,
      email: "",
      gender: "",
      nationality: "",
      location: "",
      is_active: true,
      profile_pic: "",
      about: "",
      user_type: "mentor",
      new_role_values: [],
      job_search_status: [],
      role_of_interest: [],
      industry: [],
      skills: [],
      career_goals: []
    };
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
  };

  const getFilterCounts = () => {
    const active = packages.filter(pkg => pkg.is_active).length;
    const inactive = packages.filter(pkg => !pkg.is_active).length;
    // For mentors, "mine" doesn't make sense since they only see their own packages
    // For mentees, "mine" shows packages they might have created (if any)
    const mine = user?.id && !isMentor ? packages.filter(pkg => pkg.user_id === user.id).length : 0;
    
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#334AFF]/10 rounded-lg">
                <Package className="h-6 w-6 text-[#334AFF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isMentor ? "My Mentor Packages" : "Mentor Packages"}
                </h1>
                <p className="text-sm text-gray-600">
                  {isMentor 
                    ? "Create and manage your mentorship packages"
                    : "Discover mentorship packages from experienced mentors"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>
                    {filteredPackages.length} {isMentor ? "my" : ""} packages {isMentor ? "" : "found"}
                  </span>
                </div>
              )}
              
              {isMentor && (
                <CreatePackageModal 
                  onCreatePackage={handleCreatePackage} 
                  isLoading={isCreating}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search packages by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Clear Filters */}
            {(searchQuery || filterType !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="shrink-0">
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filterType === "all" ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                filterType === "all"
                  ? "bg-[#334AFF] hover:bg-[#334AFF]/90"
                  : "hover:bg-[#334AFF]/10 hover:text-[#334AFF] hover:border-[#334AFF]/30"
              }`}
              onClick={() => setFilterType("all")}
            >
              All ({counts.total})
            </Badge>
            
            <Badge
              variant={filterType === "active" ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                filterType === "active"
                  ? "bg-[#334AFF] hover:bg-[#334AFF]/90"
                  : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
              }`}
              onClick={() => setFilterType("active")}
            >
              Active ({counts.active})
            </Badge>
            
            <Badge
              variant={filterType === "inactive" ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                filterType === "inactive"
                  ? "bg-[#334AFF] hover:bg-[#334AFF]/90"
                  : "hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setFilterType("inactive")}
            >
              Inactive ({counts.inactive})
            </Badge>
            
            {user?.id && !isMentor && (
              <Badge
                variant={filterType === "mine" ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  filterType === "mine"
                    ? "bg-[#334AFF] hover:bg-[#334AFF]/90"
                    : "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                }`}
                onClick={() => setFilterType("mine")}
              >
                My Packages ({counts.mine})
              </Badge>
            )}
          </div>
        </div>

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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {packages.length === 0 ? "No packages available" : "No packages match your filters"}
              </h3>
              <p className="text-gray-600 mb-4">
                {packages.length === 0 
                  ? (isMentor 
                      ? "Create your first mentor package to start offering your mentorship services!"
                      : "No mentor packages are available at the moment. Check back soon!")
                  : "Try adjusting your search criteria or clearing filters to see more results."
                }
              </p>
              {(searchQuery || filterType !== "all") && (
                <Button variant="outline" onClick={clearFilters} className="mb-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
