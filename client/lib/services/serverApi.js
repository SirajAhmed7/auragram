import axios from "axios";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Creates an axios instance configured for server-side requests with JWT cookie
 * Use this in server actions and server components
 */
export async function createServerApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  return axios.create({
    baseURL: baseUrl,
    headers: token
      ? {
          Cookie: `jwt=${token}`,
        }
      : {},
  });
}

/**
 * Helper function to make authenticated server requests
 * @param {string} method - HTTP method (get, post, put, delete, etc.)
 * @param {string} url - API endpoint URL
 * @param {object} data - Request data (for POST, PUT, PATCH)
 * @param {object} config - Additional axios config
 */
export async function serverApiRequest(method, url, data = null, config = {}) {
  const api = await createServerApi();

  if (data) {
    return api[method](url, data, config);
  }

  return api[method](url, config);
}
