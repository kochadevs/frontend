"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  User,
  MessagesSquare,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/store/authStore";

const SideNavigationBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const user = useUser();

  // Check user type
  const userType = user?.user_type?.toLowerCase();
  const isMentorOrMentee = userType === "mentor" || userType === "mentee";
  const isAdmin = userType === "admin";

  // Navigation items for admin users
  const adminNavItems = [
    { icon: Users, label: "Users", href: "/users" },
    { icon: Calendar, label: "Events", href: "/admin_events" },
    { icon: CheckCircle, label: "Approvals", href: "/approvals" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  // Base navigation items - for non-admin users
  const baseNavItems = [
    { icon: LayoutDashboard, label: "Home", href: "/home" },
    { icon: Calendar, label: "Bookings", href: "/bookings" },
    { icon: Calendar, label: "Events", href: "/events" },
    { icon: MessagesSquare, label: "Message", href: "/message" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  // Navigation items for mentor/mentee users
  const mentorMenteeNavItems = isMentorOrMentee
    ? [
        baseNavItems[0], // Home
        { icon: Users, label: "Mentorship", href: "/mentorship" },
        ...baseNavItems.slice(1), // Rest of the items
      ]
    : baseNavItems;

  // Determine which navigation items to show
  const navItems = isAdmin ? adminNavItems : mentorMenteeNavItems;

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <nav
      className={clsx(
        "flex flex-col h-screen bg-gradient-to-br border-r border-r-white from-[#334AFF] from-0% via-[#251F99] via-50% to-[#251F99] transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="self-end p-2 text-white hover:bg-linear-to-r from-[#334AFF] to-[#251F99] rounded-lg m-2"
      >
        {isCollapsed ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 17L18 12L13 7M6 17L11 12L6 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 17L6 12L11 7M18 17L13 12L18 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 text-white/90 border-l-2 border-transparent p-3 transition-colors ${
              isActive(item.href)
                ? "bg-linear-to-r from-[#334AFF] to-[#251F99] border-white"
                : "hover:bg-linear-to-r from-[#334AFF] to-[#251F99] hover:border-white"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span className="text-[16px] font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SideNavigationBar;
