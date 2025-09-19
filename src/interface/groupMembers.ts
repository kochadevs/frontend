interface BaseItem {
  id: number;
  date_created: string;
  last_modified: string;
  name: string;
}

interface RoleOfInterest extends BaseItem {
  category: string;
}

export interface GroupMember {
  first_name: string;
  last_name: string | null;
  email: string;
  gender: string;
  nationality: string;
  location: string;
  is_active: boolean;
  profile_pic: string;
  about: string;
  user_type: string;
  id: number;
  new_role_values: BaseItem[];
  job_search_status: BaseItem[];
  role_of_interest: RoleOfInterest[];
  industry: BaseItem[];
  skills: BaseItem[];
  career_goals: BaseItem[];
}