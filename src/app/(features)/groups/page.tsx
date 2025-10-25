"use client";

import React, { useState, useEffect } from "react";
import { Group } from "@/interface/groups";
import { fetchAllGroups } from "@/utilities/handlers/groupHandler";
import GroupCard from "@/components/groups/GroupCard";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useAuthStore, useAuthActions } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import CreateGroupModal from "@/components/modals/CreateGroupModal";

export default function AllGroupsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { initializeAuth } = useAuthActions();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initialize auth from cookies if not already authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      initializeAuth();
    }
  }, [isAuthenticated, accessToken, initializeAuth]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoading(true);
        setAuthError(null);

        // Try to get token from store first, then from cookies as fallback
        let token = accessToken;
        if (!token) {
          const { accessToken: cookieToken } = tokenUtils.getTokens();
          token = cookieToken;
        }

        if (!token) {
          setAuthError("Please log in to view groups");
          return;
        }

        const groupsData = await fetchAllGroups(token);
        setGroups(groupsData);
        setFilteredGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups:", error);
        if (error instanceof Error && error.message.includes("401")) {
          setAuthError("Your session has expired. Please log in again.");
        } else {
          toast.error(
            error instanceof Error ? error.message : "Failed to load groups"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only load groups if we have authentication
    if (isAuthenticated || accessToken) {
      loadGroups();
    }
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    // Filter groups based on search query
    const filtered = groups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  const handleGroupCreated = () => {
    // Refresh the groups list after creating a new group
    handleRefresh();
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        setAuthError("Please log in to refresh groups");
        return;
      }

      const groupsData = await fetchAllGroups(token);
      setGroups(groupsData);
      setFilteredGroups(groupsData);
      toast.success("Groups refreshed!");
    } catch (error) {
      console.error("Error refreshing groups:", error);
      if (error instanceof Error && error.message.includes("401")) {
        setAuthError("Your session has expired. Please log in again.");
      } else {
        toast.error("Failed to refresh groups");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show authentication error if present
  if (authError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Authentication Required
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">{authError}</p>
            <div className="flex gap-3">
              <Link href="/login">
                <Button className="bg-[#334AFF] hover:bg-[#251F99] text-white">
                  Go to Login
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334AFF]"></div>
            <p className="text-gray-600">Loading groups...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Link href="/home" >
        <Button variant="outline" size="sm" className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Groups</h1>
            <p className="text-gray-600 text-sm">
              Discover and join groups that match your interests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            size="sm"
          >
            Refresh
          </Button>
          <Button
            className="bg-[#334AFF] hover:bg-[#251F99] text-white flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#334AFF] focus:border-transparent"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No groups found" : "No groups available"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No groups match "${searchQuery}". Try different keywords.`
                : "There are no groups available at the moment."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                size="sm"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {searchQuery
                  ? `${filteredGroups.length} group${
                      filteredGroups.length !== 1 ? "s" : ""
                    } found for "${searchQuery}"`
                  : `${filteredGroups.length} group${
                      filteredGroups.length !== 1 ? "s" : ""
                    } available`}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
}
