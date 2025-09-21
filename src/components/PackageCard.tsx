"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MentorPackage } from "@/interface/mentorPackages";
import { Clock, DollarSign, Calendar, User } from "lucide-react";

interface PackageCardProps {
  package: MentorPackage;
  onEdit?: (pkg: MentorPackage) => void;
  onDelete?: (pkg: MentorPackage) => void;
  showActions?: boolean;
  currentUserId?: number;
}

export default function PackageCard({ 
  package: pkg, 
  onEdit, 
  onDelete, 
  showActions = false,
  currentUserId 
}: PackageCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

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

  const isOwner = currentUserId === pkg.user_id;

  return (
    <Card className="group gap-0 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#334AFF]/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-[#334AFF] transition-colors">
              {pkg.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={pkg.is_active ? "default" : "secondary"}
                className={
                  pkg.is_active
                    ? "bg-green-100 text-green-800 border-green-200"
                    : ""
                }
              >
                {pkg.is_active ? "Active" : "Inactive"}
              </Badge>
              {isOwner && (
                <Badge
                  variant="outline"
                  className="text-xs border-[#334AFF]/30 text-[#334AFF]"
                >
                  <User className="w-3 h-3 mr-1" />
                  Your Package
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 line-clamp-3">
            {pkg.description}
          </p>
        </div>

        {/* Package Details */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Price</p>
              <p className="text-lg font-bold text-green-600">
                {formatPrice(pkg.price)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Duration</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDuration(pkg.duration)}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created: {formatDate(pkg.date_created)}</span>
            </div>
            {pkg.last_modified !== pkg.date_created && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Updated: {formatDate(pkg.last_modified)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {showActions && isOwner && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs hover:bg-[#334AFF]/10 hover:text-[#334AFF] hover:border-[#334AFF]/30"
                onClick={() => onEdit?.(pkg)}
              >
                Edit Package
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs hover:bg-red-50 hover:text-red-600 text-red-600 hover:border-red-300"
                onClick={() => onDelete?.(pkg)}
              >
                Delete
              </Button>
            </>
          )}

          {!isOwner && (
            <Button
              size="sm"
              className="w-full text-xs bg-[#334AFF] hover:bg-[#334AFF]/90"
            >
              Book This Package
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}