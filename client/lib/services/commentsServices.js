import { serverApiRequest } from "./serverApi";

export async function createCommentReply(commentId, data) {
  try {
    const res = await serverApiRequest(
      "post",
      `/api/v1/comments/${commentId}/replies`,
      data
    );

    return {
      success: true,
      data: res.data.data.data,
    };
  } catch (err) {
    console.error(
      "Error replying to comment:",
      err.response?.data || err.message
    );

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
