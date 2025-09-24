"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { z } from "zod";
import { LoginFormData, loginSchema } from "../../../zodSchema/loginSchema";
import { handleLogin } from "../../../utilities/authHandler";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { getRedirectPath } from "../../../utilities/redirectUtils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/home";
  
  // Get state and actions from store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Handle redirect when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectDestination = getRedirectPath(user, redirectTo);
      router.push(redirectDestination);
    }
  }, [isAuthenticated, user, router, redirectTo]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData);

      // Call the login API
      const loginResponse = await handleLogin(validatedData);
      
      // Update auth store with login response
      login(loginResponse);

      // Reset form and errors on success
      setFormData({
        username: "",
        password: "",
      });
      setErrors({});

      // Show success toast
      toast.success("Login successful!");
      
      // Determine redirect destination based on user's role values
      const userProfile = loginResponse.user_profile;
      const redirectDestination = getRedirectPath(userProfile, redirectTo);
      
      // Redirect to determined destination
      router.push(redirectDestination);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        console.error("Login error:", error);
        toast.error(error instanceof Error ? error.message : "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="md:w-[499px] w-full md:px-2 px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative h-[38px] w-[144.66px]">
            <Image
              alt="kocha_logo"
              src="/asset/kocha_logo.png"
              className="h-10 w-auto"
              fill
            />
          </div>
          <h2 className="text-[30px] font-[700] tracking-tight text-[#2E3646]">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10">
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-[#344054]"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.username ? "outline-red-500" : ""
                    }`}
                    placeholder="Enter email"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-[#344054]"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.password ? "outline-red-500" : ""
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-3">
                  <label
                    htmlFor="remember-me"
                    className="text-sm/6 text-gray-900 flex items-center gap-2 text-[16px]"
                  >
                    <input 
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    Remember me
                  </label>
                </div>

                <div className="text-sm/6">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#2032E2] hover:text-indigo-500 text-[16px]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  variant="ghost"
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-[#334AFF] hover:text-white px-3 py-1.5 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </div>
            </form>
            <div className="flex items-center gap-2 text-[16px] mt-2">
              <p>Don’t have an account?</p>
              <Link
                href="/signup"
                className="text-[#2032E2] hover:text-indigo-500 text-[16px] font-semibold"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm/6 font-medium">
                <span className="bg-white px-6 text-gray-900">
                  Or log in with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="text-sm/6 font-semibold">
                  Sign in with Google
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334AFF]"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
