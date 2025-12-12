/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Globe,
  User as UserIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  UserCog,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchAllUsers,
  ChangeUserType,
  DeleteUser,
} from "@/utilities/handlers/UsersHandler";
import { UserProfile } from "@/interface/auth/login";
import { Modal, Select } from "antd";
import toast from "react-hot-toast";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";

const { Option } = Select;

// Items per page for pagination
const ITEMS_PER_PAGE = 10;

// User type options
const USER_TYPE_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "mentor", label: "Mentor" },
  { value: "mentee", label: "Mentee" },
  { value: "admin", label: "Admin" },
];

function UsersContent() {
  // Get access token from auth store
  const accessToken = useAuthStore((state) => state.authData?.access_token);

  // State for users and loading
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [changeTypeModalOpen, setChangeTypeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newUserType, setNewUserType] = useState<string>("");
  const [isChangingType, setIsChangingType] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, [accessToken]);

  const loadUsers = async () => {
    if (!accessToken) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllUsers(accessToken);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      return (
        user.first_name?.toLowerCase().includes(query) ||
        user.last_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.user_type?.toLowerCase().includes(query) ||
        user.location?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.professional_background?.current_role
          ?.toLowerCase()
          .includes(query) ||
        user.professional_background?.company?.toLowerCase().includes(query) ||
        user.professional_background?.skills?.some((skill) =>
          skill.name.toLowerCase().includes(query)
        ) ||
        user.professional_background?.industry?.some((industry) =>
          industry.name.toLowerCase().includes(query)
        )
      );
    });
  }, [users, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle change user type click
  const handleChangeUserTypeClick = (user: UserProfile) => {
    setSelectedUser(user);
    setNewUserType(user.user_type || "regular");
    setChangeTypeModalOpen(true);
  };

  // Handle delete user click
  const handleDeleteUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Handle change user type
  const handleChangeUserType = async () => {
    if (!selectedUser || !accessToken || !newUserType) return;

    try {
      setIsChangingType(true);

      // Validate the user type
      const validUserTypes = ["regular", "mentor", "mentee", "admin"];
      if (!validUserTypes.includes(newUserType)) {
        throw new Error("Invalid user type selected");
      }

      // Cast the user type to the expected type
      const userType = newUserType as "regular" | "mentor" | "mentee" | "admin";

      await ChangeUserType(accessToken, selectedUser.id, userType);

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, user_type: newUserType }
            : user
        )
      );

      toast.success(`User type changed to ${newUserType}`);
      setChangeTypeModalOpen(false);
      setSelectedUser(null);
      setNewUserType("");
    } catch (error: any) {
      handleErrorMessage(error, "Failed to change user type");
    } finally {
      setIsChangingType(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser || !accessToken) return;

    try {
      setIsDeleting(true);
      await DeleteUser(accessToken, selectedUser.id);

      // Remove the user from the local state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );

      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      handleErrorMessage(error, "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to get skills as string
  const getSkillsString = (skills: { name: string }[]) => {
    if (!skills || !Array.isArray(skills)) return "None";
    return (
      skills
        .slice(0, 3)
        .map((skill) => skill.name)
        .join(", ") || "None"
    );
  };

  // Helper function to get industries as string
  const getIndustriesString = (industries: { name: string }[]) => {
    if (!industries || !Array.isArray(industries)) return "None";
    return (
      industries
        .slice(0, 2)
        .map((industry) => industry.name)
        .join(", ") || "None"
    );
  };

  // Status badge component
  const StatusBadge = ({ isActive }: { isActive: boolean }) => (
    <div className="flex gap-1">
      <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
        {isActive ? "Active" : "Inactive"}
      </Badge>
    </div>
  );

  // User type badge component
  const UserTypeBadge = ({ type }: { type: string }) => {
    const typeColors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      mentor: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      mentee: "bg-green-100 text-green-800 hover:bg-green-100",
      regular: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };

    return (
      <Badge
        variant="secondary"
        className={`capitalize ${
          typeColors[type?.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type || "Unknown"}
      </Badge>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334AFF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-medium">Error loading users</p>
              <p className="text-red-500 mt-2">{error}</p>
              <Button onClick={loadUsers} className="mt-4" variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage all registered users ({users.length} total)
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <UserIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold">
                  {users.filter((user) => user.is_active).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Verified Email</p>
                <p className="text-2xl font-bold">
                  {users.filter((user) => user.email_verified).length}
                </p>
              </div>
              <Mail className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Onboarded</p>
                <p className="text-2xl font-bold">
                  {users.filter((user) => user.onboarding_completed).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}{" "}
            of {filteredUsers.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Role & Status</TableHead>
                  <TableHead>Professional Info</TableHead>
                  <TableHead>Skills & Industries</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <UserIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-600">No users found</p>
                        {searchQuery && (
                          <p className="text-gray-500 text-sm mt-1">
                            Try adjusting your search
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                            {user.profile_pic ? (
                              <Image
                                src={user.profile_pic}
                                alt={`${user.first_name || ""} ${
                                  user.last_name || ""
                                }`}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="font-bold text-blue-600">
                                  {user.first_name?.[0] || ""}
                                  {user.last_name?.[0] || ""}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.first_name || "Unknown"}{" "}
                              {user.last_name || ""}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-[180px]">
                              {user.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <UserTypeBadge type={user.user_type || "unknown"} />
                          <StatusBadge isActive={user.is_active || false} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {user.professional_background?.current_role ||
                              "Not specified"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {user.professional_background?.company ||
                              "No company"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.professional_background
                              ?.years_of_experience || 0}{" "}
                            years experience
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>
                            <p className="text-xs text-gray-500">Skills:</p>
                            <p className="text-sm line-clamp-1">
                              {getSkillsString(
                                user.professional_background?.skills || []
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Industries:</p>
                            <p className="text-sm line-clamp-1">
                              {getIndustriesString(
                                user.professional_background?.industry || []
                              )}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone || "No phone"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">
                              {user.location || "No location"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs text-blue-600">
                              {user.email_verified
                                ? "Verified email"
                                : "Unverified email"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            variant={
                              user.onboarding_completed
                                ? "default"
                                : "secondary"
                            }
                            className={`w-fit ${
                              user.onboarding_completed
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : ""
                            }`}
                          >
                            {user.onboarding_completed
                              ? "Completed"
                              : "Pending"}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Code of Conduct:{" "}
                            {user.code_of_conduct_accepted
                              ? "Accepted"
                              : "Not accepted"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleChangeUserTypeClick(user)}
                            >
                              <UserCog className="w-4 h-4" />
                              Change User Type
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-600 cursor-pointer"
                              onClick={() => handleDeleteUserClick(user)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > ITEMS_PER_PAGE && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change User Type Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            <span>Change User Type</span>
          </div>
        }
        open={changeTypeModalOpen}
        onCancel={() => {
          setChangeTypeModalOpen(false);
          setSelectedUser(null);
          setNewUserType("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setChangeTypeModalOpen(false);
              setSelectedUser(null);
              setNewUserType("");
            }}
            variant="outline"
          >
            Cancel
          </Button>,
          <Button
            key="change"
            onClick={handleChangeUserType}
            disabled={isChangingType || !newUserType}
            className="bg-[#251F99] hover:bg-[#251F99]/90"
          >
            {isChangingType ? "Changing..." : "Change Type"}
          </Button>,
        ]}
        width={400}
      >
        {selectedUser && (
          <div className="mt-4 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">
                {selectedUser.first_name} {selectedUser.last_name}
              </p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
              <p className="text-sm mt-2">
                Current type:{" "}
                <Badge>{selectedUser.user_type || "regular"}</Badge>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New User Type
              </label>
              <Select
                value={newUserType}
                onChange={setNewUserType}
                className="w-full"
                size="large"
              >
                {USER_TYPE_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Changing user type may affect permissions and access levels.
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>Delete User</span>
          </div>
        }
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            variant="outline"
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            onClick={handleDeleteUser}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>,
        ]}
        width={400}
      >
        {selectedUser && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                Are you sure you want to delete this user?
              </p>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {selectedUser.first_name} {selectedUser.last_name}
                </p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <p className="text-sm mt-2">
                  User Type:{" "}
                  <Badge>{selectedUser.user_type || "regular"}</Badge>
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    This action cannot be undone
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    All user data, including profile, activities, and records
                    will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Loading fallback component
function UsersLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334AFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function Users() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersContent />
    </Suspense>
  );
}
