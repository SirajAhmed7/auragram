"use server";

import { redirect } from "next/navigation";
import { isLoggedIn, loginApi, signupApi } from "./services/authServices";
import { setAuthCookies } from "./utils";
import { cookies } from "next/headers";
import { addComment } from "./services/postServices";
// import api from "./services/baseUrl";

export async function addCommentAction(postId, formData) {
  const data = {
    content: formData.get("content"),
  };

  const result = await addComment(postId, data);

  return {
    success: result.success,
    error: result.error,
    data: result.data,
  };
}

export async function signupAction(prevState, formData) {
  // Convert FormData to object
  const data = {
    username: formData.get("username"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };

  // Call the signup service
  const result = await signupApi(data);

  // console.log("Signup result:", result);

  // If signup failed, return error state
  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  await setAuthCookies(result, cookies);

  console.log("Signup successful");

  // Return success - let client handle refresh and redirect
  return {
    success: true,
    user: result.data?.data?.user || result.data?.user,
  };
}

export async function loginAction(prevState, formData) {
  // Convert FormData to object
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // Call the signup service
  const result = await loginApi(data);

  // console.log("Signup result:", result);

  // If signup failed, return error state
  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  await setAuthCookies(result, cookies);

  console.log("Login successful");

  // Return success - let client handle refresh and redirect
  return {
    success: true,
    user: result.data?.data?.user || result.data?.user,
  };
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      return null;
    }

    const result = await isLoggedIn(token);

    if (!result.success || !result.data) {
      return null;
    }

    return result.data.data.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("jwt");
    redirect("/login");
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: "Failed to logout" };
  }
}
