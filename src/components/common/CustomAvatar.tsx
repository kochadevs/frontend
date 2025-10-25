import Image from "next/image";
import { useState } from "react";

interface CustomAvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export const CustomAvatar = ({ src, name, className }: CustomAvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string): string => {
    if (!name || typeof name !== "string") return "??";

    const cleanName = name.trim();
    if (!cleanName) return "??";

    // Filter out problematic values
    const words = cleanName.split(/\s+/).filter((word) => {
      if (!word || word.trim().length === 0) return false;
      const lowerWord = word.toLowerCase().trim();
      // Filter out common null/undefined representations
      return !["null", "undefined", "nil", "none", "na", "n/a"].includes(
        lowerWord
      );
    });

    if (words.length === 0) return "??";

    // Get valid initials from first two words
    const initials = words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .filter((char) => char && char !== " ") // Filter out empty characters
      .join("");

    // If we don't get any valid initials, return fallback
    return initials || "??";
  };

  // Only show image if we have a valid src and it hasn't errored
  const shouldShowImage =
    src && src.trim() !== "" && !imageError && imageLoaded;

  return (
    <div
      className={`
        relative w-[48px] h-[48px] rounded-full 
        bg-gradient-to-br from-[#334AFF] to-[#251F99] 
        flex items-center justify-center 
        text-white font-semibold text-sm
        ring-2 ring-gray-100 overflow-hidden
        object-center
        ${className || ""}
      `}
    >
      {/* Always show initials by default */}
      <span className="z-10">{getInitials(name)}</span>

      {/* Only render Image component if we have a valid src */}
      {src && src.trim() !== "" && (
        <Image
          src={src}
          alt=""
          fill
          className={`object-cover transition-opacity duration-200 ${
            shouldShowImage ? "opacity-100 z-20" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};
