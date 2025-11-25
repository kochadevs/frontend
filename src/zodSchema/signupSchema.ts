import { z } from "zod";

// Base field definitions (reusable)
const baseFields = {
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().default(""), // Change from optional() to default("")
  user_type: z
    .string()
    .refine(
      (val) => val === "mentee" || val === "mentor" || val === "regular",
      {
        message: "User type must be either mentee, mentor, or basic_user",
      }
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  password_confirmation: z.string(),
  about: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .default(""),
};

// Form schema for client-side validation
export const signupFormSchema = z
  .object(baseFields)
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

// Complete payload schema for API
export const signupSchema = z
  .object({
    ...baseFields,
    is_active: z.boolean().default(true),
    email_verified: z.boolean().default(false),
    profile_pic: z.string().default(""),
    cover_photo: z.string().default(""),
    social_links: z
      .object({
        linkedin: z.string().default(""),
        twitter: z.string().default(""),
        website: z.string().default(""),
        portfolio: z.string().default(""),
      })
      .default({
        linkedin: "",
        twitter: "",
        website: "",
        portfolio: "",
      }),
    availability: z
      .object({
        days: z.array(z.string()).default([]),
        times: z.array(z.string()).default([]),
      })
      .default({
        days: [],
        times: [],
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type SignupFormData = z.infer<typeof signupFormSchema>;
export type SignupPayload = z.infer<typeof signupSchema>;
