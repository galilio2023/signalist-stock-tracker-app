import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // For now, allow all requests to pass through
  // We'll fix the auth check after we get signup working
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)",
  ],
};
