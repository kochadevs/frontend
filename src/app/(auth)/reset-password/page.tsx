"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { ResetPasswordFormData, resetPasswordSchema } from "../../../zodSchema/passwordResetSchema";
import { handleResetPassword } from "../../../utilities/authHandler";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    token: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // Extract token from URL on component mount
  useEffect(() => {
    if (token) {
      setFormData(prev => ({ ...prev, token }));
    } else {
      setTokenError(true);
    }
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ResetPasswordFormData]) {
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
      const validatedData = resetPasswordSchema.parse(formData);

      // Call the reset password API
      const response = await handleResetPassword({
        token: validatedData.token,
        new_password: validatedData.new_password,
      });
      
      console.log("Reset password successful:", response);

      // Show success state
      setIsSuccess(true);
      toast.success("Password reset successfully!");
      
      // Clear form and errors
      setFormData({ token: "", new_password: "", confirm_password: "" });
      setErrors({});
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ResetPasswordFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        console.error("Reset password error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show error if no token is present
  if (tokenError) {
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-[30px] font-[700] tracking-tight text-[#2E3646]">
              Invalid Reset Link
            </h2>
            <p className="text-[#667085] text-[14px] text-center">
              The password reset link is invalid or has expired. Please request a new password reset.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-col gap-4">
              <Link href="/forgot-password">
                <Button
                  variant="ghost"
                  className="flex w-full justify-center rounded-md bg-[#334AFF] hover:text-white px-3 py-1.5 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px]"
                >
                  Request New Reset
                </Button>
              </Link>
              
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="flex w-full justify-center rounded-md border hover:bg-gray-200 px-3 py-1.5 text-[16px] font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 text-[#344054] cursor-pointer h-[40px]"
                >
                  Back to log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (isSuccess) {
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[30px] font-[700] tracking-tight text-[#2E3646]">
              Password Reset Successful
            </h2>
            <p className="text-[#667085] text-[14px] text-center">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-col gap-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="flex w-full justify-center rounded-md bg-[#334AFF] hover:text-white px-3 py-1.5 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px]"
                >
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Reset password
          </h2>
          <p className="text-[#667085] text-[14px]">
            Fill the form below to reset your password.
          </p>
        </div>

        <div className="mt-10">
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="new_password"
                  className="block text-sm/6 font-medium text-[#344054]"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.new_password ? "outline-red-500" : ""
                    }`}
                    placeholder="Enter new password"
                  />
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirm_password"
                  className="block text-sm/6 font-medium text-[#344054]"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.confirm_password ? "outline-red-500" : ""
                    }`}
                    placeholder="Re-enter password"
                  />
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-[#334AFF] hover:text-white px-3 py-1.5 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting..." : "Submit"}
                </Button>

                <Link href="/login">
                  <Button
                    variant="ghost"
                    type="button"
                    className="flex w-full justify-center rounded-md border hover:bg-gray-200 px-3 py-1.5 text-[16px] font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 text-[#344054] cursor-pointer h-[40px]"
                  >
                    Back to log in
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
