import { serverApiRequest } from "./serverApi";

export async function toggleLike(contentType, contentId) {
  try {
    const res = await serverApiRequest(
      "post",
      `/api/v1/${contentType}/${contentId}/like`
    );

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error("Error liking content:", err.response?.data || err.message);

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

export async function getContentLikedUsers(contentType, contentId) {
  try {
    const res = await serverApiRequest(
      "get",
      `/api/v1/${contentType}/${contentId}/like/users`
    );

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error("Error fetching likes:", err.response?.data || err.message);

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
