export interface CreateGroupPayload {
  name: string;
  description: string;
  is_public: boolean;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  created_by: number;
  is_public: boolean;
  date_created: string;
  member_count?: number;
  // Add other group properties as needed based on your API response
}

export interface CreateGroupResponse {
  group: Group;
  message?: string;
}