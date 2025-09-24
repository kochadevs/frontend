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

export interface Mentor {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  nationality: string;
  location: string;
  is_active: boolean;
  profile_pic: string;
  about: string;
  user_type: "mentee" | "mentor";
  id: number;
  new_role_values: MentorRole[];
  job_search_status: MentorJobSearchStatus[];
  role_of_interest: MentorRoleOfInterest[];
  industry: MentorIndustry[];
  skills: MentorSkill[];
  career_goals: MentorCareerGoal[];
}

export interface MentorsResponse {
  mentors: Mentor[];
}