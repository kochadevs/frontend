"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useAuthStore, useIsAuthenticated, useUser } from "../../store/authStore";
import { getUserInitials, getUserDisplayName } from "../../utilities/userUtils";
import { toast } from "react-hot-toast";

const NavigationBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user data from auth store
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useIsAuthenticated();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setIsDropdownOpen(false);
    }
  };

  return (
    <nav className="w-screen border-b bg-white h-[72px] py-[10px] px-[24px] flex items-center justify-center shadow-md shadow-[#E5E7EB]">
      <div className="w-full h-full flex items-center justify-between">
        <div className="relative w-[144.66px] h-[38px]">
          <Image
            src="/asset/kocha_logo.png"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        {pathname !== "/onboarding" && isAuthenticated && user && (
          <div className="flex items-center relative" ref={dropdownRef}>
            <div className="text-[#1F2C99] flex items-center justify-center text-[14px] font-semibold w-[40px] h-[40px] rounded-full bg-[#DBEAFF] border-2 border-[#1F2C99]/20">
              {getUserInitials(user)}
            </div>
            <button
              className="p-2 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-[#344054]" />
              </motion.div>
            </button>

            {/* Dropdown Menu with Animation */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="border absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-[100]"
                >
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.user_type}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer w-full flex items-center gap-2 justify-start"
                      onClick={handleLogout}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.93335 5.04016C6.14002 2.64016 7.37335 1.66016 10.0733 1.66016H10.16C13.14 1.66016 14.3333 2.85349 14.3333 5.83349V10.1802C14.3333 13.1602 13.14 14.3535 10.16 14.3535H10.0733C7.39335 14.3535 6.16002 13.3868 5.94002 11.0268"
                          stroke="#667085"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 8H2.41333"
                          stroke="#667085"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.90008 5.7666L1.66675 7.99994L3.90008 10.2333"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Logout
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
