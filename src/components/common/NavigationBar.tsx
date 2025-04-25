"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // For animations

const NavigationBar = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="w-screen bg-white h-[72px] py-[10px] px-[24px] flex items-center justify-center shadow-md shadow-[#E5E7EB]">
      <div className="w-full h-full flex items-center justify-between">
        <div className="relative w-[144.66px] h-[38px]">
          <Image
            src="/asset/kocha_logo.png"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        {pathname !== "/onboarding" && (
          <div className="flex items-center relative">
            <div className="text-[#1F2C99] flex items-center justify-center text-[18px] font-medium w-[40px] h-[40px] rounded-full bg-[#DBEAFF]">
              OR
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
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Option 1
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Option 2
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Option 3
                  </a>
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
