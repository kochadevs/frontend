export interface CreatePostPayload {
  content: string;
  group_id?: number;
}

// API Response interfaces
export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  nationality: string;
  location: string;
  is_active: boolean;
  profile_pic: string;
  user_type: string;
  new_role_values: Array<{
    id: number;
    date_created: string;
    last_modified: string;
    name: string;
  }>;
  job_search_status: Array<{
    id: number;
    date_created: string;
    last_modified: string;
    name: string;
  }>;
  role_of_interest: Array<{
    id: number;
    date_created: string;
    last_modified: string;
    name: string;
    category: string;
  }>;
  industry: Array<{
    id: number;
    date_created: string;
    last_modified: string;
    name: string;
  }>;
  skills: Array<{
    id: number;
    date_created: string;
    last_modified: string;
    name: string;
  }>;
  career_goals: Array<{
    id: number;
    date_created: string;
    last_modified: string;
    name: string;
  }>;
}

export interface ApiGroup {
  id: number;
  name: string;
  description: string;
  created_by: number;
  is_public: boolean;
  date_created: string;
  last_modified: string;
}

export interface Post {
  id: number;
  user: ApiUser;
  group: ApiGroup | null;
  content: string;
  date_created: string;
  last_modified: string;
  comments_count: number;
  reactions_count: number;
}

export interface FeedResponse {
  items: Post[];
  next_cursor: string;
}

export interface FeedParams {
  limit?: number;
  group_id?: number;
  cursor?: string;
}

// Comment interfaces
export interface CreateCommentPayload {
  content: string;
  parent_comment_id?: number;
}

export interface ApiComment {
  id: number;
  user: ApiUser;
  content: string;
  date_created: string;
  last_modified: string;
  replies_count: number;
  reactions_count: number;
}

export interface CommentsResponse {
  items: ApiComment[];
  next_cursor: string;
}

export interface CommentParams {
  limit?: number;
  cursor?: string;
}

// Reaction interfaces
export interface CreateReactionPayload {
  type: string;
}

export interface ReactionParams {
  type: string;
}
