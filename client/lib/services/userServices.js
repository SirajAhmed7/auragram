import api from "./baseUrl"; // For client-side
import { serverApiRequest } from "./serverApi"; // For server-side

/**
 * CLIENT-SIDE: Get user profile (use in client components)
 */
export async function getUserProfile(userId) {
  try {
    const res = await api.get(`/api/v1/users/${userId}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.error("Get user profile error:", err.response?.data || err.message);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch user profile",
    };
  }
}

/**
 * SERVER-SIDE: Get user profile (use in server actions/components)
 */
export async function getUserProfileServer(userId) {
  try {
    const res = await serverApiRequest("get", `/api/v1/users/${userId}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.error("Get user profile error:", err.response?.data || err.message);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch user profile",
    };
  }
}

/**
 * CLIENT-SIDE: Update user profile
 */
export async function updateUserProfile(data) {
  try {
    const res = await api.patch("/api/v1/users/updateMe", data);
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.error("Update profile error:", err.response?.data || err.message);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update profile",
    };
  }
}

/**
 * SERVER-SIDE: Update user profile
 */
export async function updateUserProfileServer(data) {
  try {
    const res = await serverApiRequest("patch", "/api/v1/users/updateMe", data);
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.error("Update profile error:", err.response?.data || err.message);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update profile",
    };
  }
}
