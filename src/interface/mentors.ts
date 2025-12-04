import { UserProfile } from "./auth/login";

export interface MentorRole {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

export interface MentorJobSearchStatus {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

export interface MentorRoleOfInterest {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
  category: string;
}

export interface MentorIndustry {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

export interface MentorSkill {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

export interface MentorCareerGoal {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

export type Mentor = UserProfile;

export interface MentorsResponse {
  mentors: Mentor[];
}