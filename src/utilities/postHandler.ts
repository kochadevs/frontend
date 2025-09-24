import axios from "axios";
import { CreatePostPayload, FeedResponse, FeedParams, Post, CreateCommentPayload, ApiComment, CommentsResponse, CommentParams, CreateReactionPayload, ReactionParams } from "../interface/posts";

export const createPost = async (
  payload: CreatePostPayload,
  accessToken: string
): Promise<Post> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }
    
    const response = await axios.post(`${baseURL}/feed/posts`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;

    return data as Post;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to create post";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const fetchFeed = async (
  params: FeedParams,
  accessToken: string
): Promise<FeedResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.group_id) {
      queryParams.append('group_id', params.group_id.toString());
    }
    if (params.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const url = `${baseURL}/feed/posts?${queryParams.toString()}`;
    
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;
    return data as FeedResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to fetch feed";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const deletePost = async (
  postId: string,
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/posts/${postId}`;
    
    await axios.delete(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to delete post";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

// Comment API functions
export const addComment = async (
  postId: string,
  payload: CreateCommentPayload,
  accessToken: string
): Promise<ApiComment> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/posts/${postId}/comments`;
    
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;
    return data as ApiComment;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to add comment";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const fetchComments = async (
  postId: string,
  params: CommentParams,
  accessToken: string
): Promise<CommentsResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const url = `${baseURL}/feed/posts/${postId}/comments?${queryParams.toString()}`;
    
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const { data } = response;
    return data as CommentsResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to fetch comments";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const deleteComment = async (
  commentId: string,
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/comments/${commentId}`;
    
    await axios.delete(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to delete comment";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

// Reaction API functions
export const reactToPost = async (
  postId: string,
  payload: CreateReactionPayload,
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/posts/${postId}/reactions`;
    
    await axios.put(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to react to post";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const unreactToPost = async (
  postId: string,
  params: ReactionParams,
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const queryParams = new URLSearchParams();
    queryParams.append('type', params.type);

    const url = `${baseURL}/feed/posts/${postId}/reactions?${queryParams.toString()}`;
    
    await axios.delete(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to unreact to post";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const reactToComment = async (
  commentId: string,
  payload: CreateReactionPayload,
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/comments/${commentId}/reactions`;
    
    await axios.put(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to react to comment";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

export const unreactToComment = async (
  commentId: string,
  params: ReactionParams,
  accessToken: string
): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const queryParams = new URLSearchParams();
    queryParams.append('type', params.type);

    const url = `${baseURL}/feed/comments/${commentId}/reactions?${queryParams.toString()}`;
    
    await axios.delete(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Failed to unreact to comment";
        console.error("Server error:", error.response.status, errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error("Network error:", error.request);
        throw new Error("Network error - please check your connection");
      }
    }
    
    console.error("Error:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};

// Helper function to toggle like on a post
export const togglePostLike = async (
  postId: string,
  currentUserReaction: "like" | null,
  accessToken: string
): Promise<"like" | null> => {
  try {
    if (currentUserReaction === "like") {
      // Unlike the post
      await unreactToPost(postId, { type: "like" }, accessToken);
      return null;
    } else {
      // Like the post
      await reactToPost(postId, { type: "like" }, accessToken);
      return "like";
    }
  } catch (error) {
    throw error;
  }
};
