import { UserProfile } from "./auth/login";

export interface CreatePostPayload {
  content: string;
  group_id?: number;
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
  user: UserProfile;
  group: ApiGroup | null;
  content: string;
  date_created: string;
  last_modified: string;
  comments_count: number;
  reactions_count: number;
  user_reaction: "like" | null;
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
  user: UserProfile;
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
