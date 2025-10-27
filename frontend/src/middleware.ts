import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// Define role-based access control
const ROUTE_PERMISSIONS = {
  "/admin": ["admin"],
  "/api/admin": ["admin"],
  "/admin/users": ["admin"],
  "/api/admin/users": ["admin"],
} as const;

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Access user role from admin plugin
  const userRole = session.user.role;
  const currentPath = request.nextUrl.pathname;

  // Check if the current path requires specific permissions
  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (currentPath.startsWith(route)) {
      if (!allowedRoles.includes(userRole as any)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      break;
    }
  }

  // Add user role to headers for use in components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-role", userRole || "user");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
