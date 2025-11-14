import api from "./baseUrl";

export async function signupApi(formData) {
  try {
    const res = await api.post("/api/v1/users/signup", formData);

    // Extract the Set-Cookie header
    const setCookieHeader = res.headers["set-cookie"];

    // Return success response with data and cookie
    return {
      success: true,
      data: res.data,
      setCookie: setCookieHeader,
    };
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);

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

export async function loginApi(formData) {
  try {
    const res = await api.post("/api/v1/users/login", formData);

    // Extract the Set-Cookie header
    const setCookieHeader = res.headers["set-cookie"];

    // Return success response with data and cookie
    return {
      success: true,
      data: res.data,
      setCookie: setCookieHeader,
    };
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);

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

export async function isLoggedIn(token = null) {
  try {
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const res = await api.get("/api/v1/users/is-logged-in", config);

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    // console.error("Authentication error:", err.response?.data || err.message);

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
