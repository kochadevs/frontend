"use client";

import { useEffect } from "react";
import { useAuthActions } from "@/store/authStore";

export default function AuthInitializer() {
  const { initializeAuth } = useAuthActions();

  useEffect(() => {
    // Initialize auth from cookies when the app loads
    initializeAuth();
  }, [initializeAuth]);

  // This component doesn't render anything
  return null;
}