"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateMentorPackageFormData, CreateMentorPackageRequest } from "@/interface/mentorPackages";
import { Plus, Loader2 } from "lucide-react";

interface CreatePackageModalProps {
  onCreatePackage: (packageData: CreateMentorPackageRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function CreatePackageModal({ 
  onCreatePackage, 
  isLoading = false 
}: CreatePackageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateMentorPackageFormData>({
    name: "",
    description: "",
    price: "",
    duration: ""
  });
  const [errors, setErrors] = useState<Partial<CreateMentorPackageFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateMentorPackageFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Package name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = "Price must be a valid positive number";
      }
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    } else {
      const durationNum = parseInt(formData.duration);
      if (isNaN(durationNum) || durationNum < 1) {
        newErrors.duration = "Duration must be a valid positive number (in minutes)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const packageData: CreateMentorPackageRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      };

      await onCreatePackage(packageData);
      
      // Reset form and close modal on success
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: ""
      });
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  const handleInputChange = (field: keyof CreateMentorPackageFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: ""
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-[#334AFF] hover:bg-[#334AFF]/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Package
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Package Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter package name..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this package includes..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
              rows={3}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={errors.price ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="60"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className={errors.duration ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.duration && (
                <p className="text-sm text-red-600">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#334AFF] hover:bg-[#334AFF]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Package"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}