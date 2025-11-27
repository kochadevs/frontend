"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleSignup } from "@/utilities/handlers/authHandler";
import {
  SignupFormData,
  signupFormSchema,
  SignupPayload,
} from "@/zodSchema/signupSchema";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";

interface SignupProps {
  userType: string;
  onBack: () => void;
}

export default function SignupForm({
  userType,
  onBack,
}: Readonly<SignupProps>) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SignupFormData>({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    nationality: "",
    location: "",
    phone: "",
    user_type: userType,
    password: "",
    password_confirmation: "",
    about: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));

    if (errors.gender) {
      setErrors((prev) => ({
        ...prev,
        gender: "",
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getUserTypeDisplay = (type: string) => {
    switch (type) {
      case "mentor":
        return "Mentor";
      case "mentee":
        return "Mentee";
      case "regular":
        return "Community Member";
      default:
        return type;
    }
  };

  const preparePayload = (validatedData: SignupFormData): SignupPayload => {
    return {
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      email: validatedData.email,
      password: validatedData.password,
      password_confirmation: validatedData.password_confirmation,
      user_type: validatedData.user_type,
      gender: validatedData.gender,
      phone: validatedData.phone || "", // Ensure phone is always a string
      nationality: validatedData.nationality,
      location: validatedData.location,
      profile_pic: imagePreview || "",
      about: validatedData.about || "",
    };
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      nationality: "",
      location: "",
      phone: "",
      user_type: userType,
      password: "",
      password_confirmation: "",
      about: "",
    });
    setImagePreview("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = signupFormSchema.parse(formData);
      const payload = preparePayload(validatedData);

      const result = await handleSignup(payload);

      if (result) {
        resetForm();
        router.push("/login");
        toast.success("Account created successfully!");
      }
    } catch (error) {
      handleErrorMessage(error, "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-y-scroll py-20">
      <div className="md:w-[599px] w-full md:px-2 px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <h2 className="text-[30px] font-[700] tracking-tight text-[#2E3646]">
            Sign up as {getUserTypeDisplay(userType)}
          </h2>
        </div>

        <div className="mt-10">
          <div>
            <form onSubmit={handleSubmit}>
              {/* Photo Upload Section */}
              <div className="mb-6">
                <label className="block text-sm/6 font-medium text-[#344054] mb-4">
                  Photo (optional)
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden"
                    onClick={handleImageClick}
                  >
                    {imagePreview ? (
                      <>
                        <Image
                          src={imagePreview}
                          fill
                          alt="Profile preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-6 h-6 mb-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-xs">Add Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="text-sm text-[#334AFF] hover:text-[#251F99] font-medium"
                      >
                        {imagePreview ? "Change photo" : "Upload photo"}
                      </button>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      JPEG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        errors.first_name ? "outline-red-500" : ""
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        errors.last_name ? "outline-red-500" : ""
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        errors.email ? "outline-red-500" : ""
                      }`}
                      placeholder="Enter email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    Phone (optional)
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        errors.phone ? "outline-red-500" : ""
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    Gender
                  </label>
                  <div className="mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={`flex w-full justify-between items-center rounded-md bg-white px-3 py-2.5 text-base text-left outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                            errors.gender ? "outline-red-500" : ""
                          } ${
                            !formData.gender ? "text-gray-400" : "text-gray-900"
                          }`}
                        >
                          {formData.gender ? (
                            <span className="capitalize">
                              {formData.gender}
                            </span>
                          ) : (
                            "Select gender"
                          )}
                          <svg
                            className="w-4 h-4 ml-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                        <DropdownMenuItem
                          onClick={() => handleGenderSelect("male")}
                          className="cursor-pointer"
                        >
                          Male
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleGenderSelect("female")}
                          className="cursor-pointer"
                        >
                          Female
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                {/* Nationality */}
                <div>
                  <label
                    htmlFor="nationality"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    Nationality
                  </label>
                  <div className="mt-2">
                    <input
                      id="nationality"
                      name="nationality"
                      type="text"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        errors.nationality ? "outline-red-500" : ""
                      }`}
                      placeholder="Enter nationality"
                    />
                    {errors.nationality && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nationality}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    Location
                  </label>
                  <div className="mt-2">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        errors.location ? "outline-red-500" : ""
                      }`}
                      placeholder="Enter location"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
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
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm/6 font-medium text-[#344054]"
                  >
                    Confirm password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      required
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        errors.password_confirmation ? "outline-red-500" : ""
                      }`}
                      placeholder="Re-enter password"
                    />
                    {errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password_confirmation}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Short Bio */}
              <div className="mt-6">
                <label
                  htmlFor="about"
                  className="block text-sm/6 font-medium text-[#344054]"
                >
                  Short Bio (optional)
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={4}
                    value={formData.about}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md resize-none bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                      errors.about ? "outline-red-500" : ""
                    }`}
                    placeholder="Tell us a little about yourself..."
                  />
                  {errors.about && (
                    <p className="mt-1 text-sm text-red-600">{errors.about}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[16px] font-semibold text-gray-700 shadow-xs hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[48px]"
                >
                  Back
                </button>
                <Button
                  variant="ghost"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 justify-center rounded-md bg-[#334AFF] hover:text-white px-3 py-1.5 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
            </form>
            <div className="flex items-center gap-2 text-[16px] mt-4 justify-center">
              <p>Already have an account?</p>
              <Link
                href="/login"
                className="text-[#2032E2] hover:text-indigo-500 text-[16px] font-semibold"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
