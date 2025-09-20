import axios from "axios";
import { CreatePostPayload, FeedResponse, FeedParams, Post, CreateCommentPayload, ApiComment, CommentsResponse, CommentParams } from "../interface/posts";

export const createPost = async (
  payload: CreatePostPayload,
  accessToken: string
): Promise<Post> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;
    console.log('API Base URL:', baseURL);
    console.log('Payload:', payload);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    console.log('Making request to:', `${baseURL}/feed/posts`);
    
    const response = await axios.post(`${baseURL}/feed/posts`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

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
    console.log('Fetching feed with params:', params);
    console.log('API Base URL:', baseURL);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');

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
    console.log('Making request to:', url);
    
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
    
    console.log('Feed response status:', response.status);
    console.log('Feed response data:', response.data);

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
    console.log('Deleting post with ID:', postId);
    console.log('API Base URL:', baseURL);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/posts/${postId}`;
    console.log('Making DELETE request to:', url);
    
    const response = await axios.delete(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
    
    console.log('Delete response status:', response.status);
    console.log('Post deleted successfully');

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
    console.log('Adding comment to post:', postId);
    console.log('Comment payload:', payload);
    console.log('API Base URL:', baseURL);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/posts/${postId}/comments`;
    console.log('Making POST request to:', url);
    
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
    
    console.log('Add comment response status:', response.status);
    console.log('Add comment response data:', response.data);

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
    console.log('Fetching comments for post:', postId);
    console.log('Comment params:', params);
    console.log('API Base URL:', baseURL);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');

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
    console.log('Making GET request to:', url);
    
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
    
    console.log('Fetch comments response status:', response.status);
    console.log('Fetch comments response data:', response.data);

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
    console.log('Deleting comment with ID:', commentId);
    console.log('API Base URL:', baseURL);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');

    if (!baseURL) {
      throw new Error(
        "API base URL is not configured in environment variables"
      );
    }

    const url = `${baseURL}/feed/comments/${commentId}`;
    console.log('Making DELETE request to:', url);
    
    const response = await axios.delete(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
    
    console.log('Delete comment response status:', response.status);
    console.log('Comment deleted successfully');

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
