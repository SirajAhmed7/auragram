import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export async function setAuthCookies(result, cookies) {
  // Set the JWT cookie from the backend response
  if (result.setCookie && result.setCookie.length > 0) {
    const cookieString = result.setCookie[0];
    // console.log("Setting cookie:", cookieString);

    // Parse the cookie string to extract name, value, and options
    const [cookiePart, ...optionsParts] = cookieString.split(";");
    const [name, value] = cookiePart.split("=");

    // Parse cookie options
    const options = {};
    optionsParts.forEach((part) => {
      const trimmed = part.trim().toLowerCase();
      if (trimmed.startsWith("expires=")) {
        options.expires = new Date(part.split("=")[1]);
      } else if (trimmed === "httponly") {
        options.httpOnly = true;
      } else if (trimmed === "secure") {
        options.secure = true;
      } else if (trimmed.startsWith("path=")) {
        options.path = part.split("=")[1];
      } else if (trimmed.startsWith("samesite=")) {
        options.sameSite = part.split("=")[1].toLowerCase();
      }
    });

    // Set the cookie in Next.js
    const cookieStore = await cookies();
    cookieStore.set(name.trim(), value.trim(), options);
  }
}
