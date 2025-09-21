import { MentorPackage, CreateMentorPackageRequest } from "@/interface/mentorPackages";

const BASE_URL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

/**
 * Fetch mentor packages from the API
 * If mentorId is provided, fetch packages for that specific mentor
 * Otherwise, fetch all packages
 */
export async function getMentorPackages(token: string, mentorId?: number): Promise<MentorPackage[]> {
  try {
    const endpoint = mentorId
      ? `${BASE_URL}/mentors/packages/me`
      : `${BASE_URL}/mentors/packages`;
      
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.detail || 
        `Failed to fetch mentor packages: ${response.status} ${response.statusText}`
      );
    }

    const packages: MentorPackage[] = await response.json();
    return packages;
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new mentor package
 */
export async function createMentorPackage(
  packageData: CreateMentorPackageRequest, 
  token: string
): Promise<MentorPackage> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(packageData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.detail || 
        `Failed to create mentor package: ${response.status} ${response.statusText}`
      );
    }

    const newPackage: MentorPackage = await response.json();
    return newPackage;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing mentor package
 */
export async function updateMentorPackage(
  packageId: number,
  packageData: CreateMentorPackageRequest, 
  token: string
): Promise<MentorPackage> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/packages/${packageId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(packageData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.detail || 
        `Failed to update mentor package: ${response.status} ${response.statusText}`
      );
    }

    const updatedPackage: MentorPackage = await response.json();
    return updatedPackage;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a mentor package
 */
export async function deleteMentorPackage(
  packageId: number,
  token: string
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/mentors/packages/${packageId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.detail || 
        `Failed to delete mentor package: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
}
