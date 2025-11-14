"use server";

import { redirect } from "next/navigation";
import { loginApi, signupApi } from "./services/authServices";
import { setAuthCookies } from "./utils";
import { cookies } from "next/headers";

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

  console.log("Signup successful, redirecting to /");

  // If successful, redirect to home page
  // Note: redirect() throws, so this won't return
  redirect("/");
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

  console.log("Login successful, redirecting to /");

  // If successful, redirect to home page
  // Note: redirect() throws, so this won't return
  redirect("/");
}
