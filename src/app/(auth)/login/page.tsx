"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { LoginFormData, loginSchema } from "../../../zodSchema/loginSchema";
import { handleLogin } from "../../../utilities/handlers/authHandler";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { getRedirectPath } from "../../../utilities/redirectUtils";
import NavigationBar from "@/components/common/NavigationBar";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/home";

  // Get state and actions from simplified store
  const authData = useAuthStore((state) => state.authData);
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle redirect when authenticated
  useEffect(() => {
    if (authData?.access_token && authData.user_profile) {
      const redirectDestination = getRedirectPath(
        authData.user_profile,
        redirectTo
      );
      router.push(redirectDestination);
    }
  }, [authData, router, redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const validatedData = loginSchema.parse(formData);
      const loginResponse = await handleLogin(validatedData);

      // Simple login - just store the response
      login(loginResponse);

      setFormData({ username: "", password: "" });
      setErrors({});
      toast.success("Login successful!");

      // Redirect
      const redirectDestination = getRedirectPath(
        loginResponse.user_profile,
        redirectTo
      );
      router.push(redirectDestination);
    } catch (error) {
      handleErrorMessage(error, "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed top-0 w-full z-50">
        <NavigationBar />
      </div>
      <div className="md:w-[499px] w-full md:px-2 px-4">
        <div className="flex flex-col items-center justify-center gap-4">
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username}
                    </p>
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end mb-4">
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
              <p>Don&apos;t have an account?</p>
              <Link
                href="/signup"
                className="text-[#2032E2] hover:text-indigo-500 text-[16px] font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334AFF]"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
