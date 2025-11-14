import { NextResponse } from "next/server";
import { isLoggedIn } from "./lib/services/authServices";

export async function middleware(request) {
  // Get the auth cookie
  const authCookie = request.cookies.get("jwt");

  if (request.nextUrl.pathname === "/") return NextResponse.next();

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some((route) => {
    return request.nextUrl.pathname.startsWith(
      route.slice(0, route.length - 1)
    );
  });

  // If no auth cookie and trying to access protected route
  if (!authCookie && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let isUserLoggedIn = false;

  if (authCookie) {
    // Check if the user is logged in by passing the JWT token
    const token = authCookie.value;
    const isLoggedInResponse = await isLoggedIn(token);

    if (!isLoggedInResponse.success) {
      isUserLoggedIn = false;
    } else {
      isUserLoggedIn = true;
    }
  }

  if (!isUserLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If auth cookie exists and trying to access login/signup, redirect to home
  if (isUserLoggedIn && isPublicRoute) {
    console.log("redirecting to home");
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
