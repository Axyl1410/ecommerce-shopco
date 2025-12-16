import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily disabled for testing
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
