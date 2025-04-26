"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  MessagesSquare,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

const SideNavigationBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Home", href: "/home" },
    { icon: FileText, label: "Documents", href: "/documents" },
    { icon: Briefcase, label: "Jobs", href: "/jobs" },
    { icon: Users, label: "Mentor match", href: "/mentor-match" },
    { icon: MessagesSquare, label: "Community", href: "/community" },
  ];

  return (
    <nav
      className={clsx(
        "flex flex-col h-screen bg-gradient-to-br from-[#334AFF] from-0% via-[#251F99] via-50% to-[#251F99] transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="self-end p-2 text-white hover:bg-linear-to-r from-[#334AFF] to-[#251F99]  rounded-lg m-2"
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
            className="flex items-center gap-3 text-white/90 hover:bg-linear-to-r from-[#334AFF] to-[#251F99] border-l-2 border-transparent hover:border-white  p-3 transition-colors"
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
