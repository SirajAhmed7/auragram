import { serverApiRequest } from "./serverApi";

export async function createPost(data) {
  try {
    const res = await serverApiRequest("post", "/api/v1/posts", data);

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error("Error creating post:", err.response?.data || err.message);

    // Extract meaningful error message from API response
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred. Please try again.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getPosts() {
  try {
    // const res = await api.get("/api/v1/posts");
    const res = await serverApiRequest("get", "/api/v1/posts");

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error("Error fetching posts:", err.response?.data || err.message);

    // Extract meaningful error message from API response
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred. Please try again.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getPost(postId) {
  try {
    const res = await serverApiRequest("get", "/api/v1/posts/" + postId);

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error("Error fetching post:", err.response?.data || err.message);

    // Extract meaningful error message from API response
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred. Please try again.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function addComment(postId, data) {
  try {
    const res = await serverApiRequest(
      "post",
      "/api/v1/posts/" + postId + "/comments",
      data
    );

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error("Error adding comment:", err.response?.data || err.message);

    // Extract meaningful error message from API response
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred. Please try again.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function updatePost(postId, data) {
  try {
    const res = await serverApiRequest(
      "patch",
      "/api/v1/posts/" + postId,
      data
    );

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error("Error updating post:", err.response?.data || err.message);

    // Extract meaningful error message from API response
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred. Please try again.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function deletePost(postId) {
  try {
    const res = await serverApiRequest("delete", "/api/v1/posts/" + postId);

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.error("Error deleting post:", err.response?.data || err.message);

    // Extract meaningful error message from API response
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred. Please try again.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
