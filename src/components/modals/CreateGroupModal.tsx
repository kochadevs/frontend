"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  createGroupSchema,
  CreateGroupFormData,
} from "@/zodSchema/groupSchema";
import { createGroup } from "@/utilities/handlers/groupHandler";
import { useAuthActions, useAccessToken, useIsAuthenticated } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated?: (groupId: number) => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onGroupCreated,
}: Readonly<CreateGroupModalProps>) {
  const accessToken = useAccessToken();
  const isAuthenticated = useIsAuthenticated();
  const { initializeAuth } = useAuthActions();

  // Initialize auth from cookies if not already authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      initializeAuth();
    }
  }, [isAuthenticated, accessToken, initializeAuth]);

  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: "",
    description: "",
    is_public: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateGroupFormData, string>>
  >({});

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CreateGroupFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_public: checked,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      is_public: true,
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      const validatedData = createGroupSchema.parse(formData);

      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Please log in to create a group");
      }

      // Call the create group API
      const response = await createGroup(validatedData, token);

      // Show success toast
      toast.success("Group created successfully!");

      // Call callback if provided
      if (onGroupCreated && response.group) {
        onGroupCreated(response.group.id);
      }

      // Close modal and reset form
      handleClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: Partial<Record<keyof CreateGroupFormData, string>> =
          {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CreateGroupFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        console.error("Create group error:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to create group"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group to connect with people who share your interests.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Group Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Group Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#334AFF] focus:border-transparent ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter group name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`block w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#334AFF] focus:border-transparent resize-none ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Describe what your group is about..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Public/Private Switch */}
            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Group Visibility
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.is_public
                    ? "Anyone can find and join this group"
                    : "Only invited members can join this group"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm ${
                    !formData.is_public
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Private
                </span>
                <Switch
                  checked={formData.is_public}
                  onCheckedChange={handleSwitchChange}
                />
                <span
                  className={`text-sm ${
                    formData.is_public
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Public
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#334AFF] hover:bg-[#251F99] text-white"
            >
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
