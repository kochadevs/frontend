"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MentorPackage } from "@/interface/mentorPackages";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeletePackageModalProps {
  package: MentorPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onDeletePackage: (packageId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function DeletePackageModal({ 
  package: pkg,
  isOpen,
  onClose,
  onDeletePackage, 
  isLoading = false 
}: DeletePackageModalProps) {
  const handleDelete = async () => {
    if (!pkg) return;
    
    try {
      await onDeletePackage(pkg.id);
      onClose();
    } catch (error) {
      // Error is handled by parent component
    }
  };

  if (!pkg) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) {
      return `${duration} min`;
    } else if (duration === 60) {
      return "1 hour";
    } else if (duration % 60 === 0) {
      return `${duration / 60} hours`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Delete Package
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Are you sure you want to delete this package?
                </h3>
                <p className="text-sm text-red-700">
                  This action cannot be undone. The package will be permanently removed from your account.
                </p>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Package Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{pkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">{formatPrice(pkg.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">{formatDuration(pkg.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${pkg.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            {pkg.description && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Description:</span>
                <p className="text-sm text-gray-900 mt-1 line-clamp-3">
                  {pkg.description}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Package
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}