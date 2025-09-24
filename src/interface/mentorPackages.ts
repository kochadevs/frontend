export interface MentorPackage {
  name: string;
  description: string;
  price: number;
  duration: number;
  id: number;
  date_created: string;
  last_modified: string;
  is_active: boolean;
  user_id: number;
}

export interface CreateMentorPackageRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface CreateMentorPackageFormData {
  name: string;
  description: string;
  price: string; // Form input as string, will be converted to number
  duration: string; // Form input as string, will be converted to number
}