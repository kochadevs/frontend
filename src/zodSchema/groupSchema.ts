import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .min(3, "Group name must be at least 3 characters")
    .max(100, "Group name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .trim(),
  is_public: z.boolean(),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;