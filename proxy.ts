import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { demoRedirectFor } from "@/lib/demo-routing"

// No session refresh, membership check, or authentication API in this branch.
export function proxy(request: NextRequest) {
  const destination = demoRedirectFor(request.nextUrl.pathname)
  return destination
    ? NextResponse.redirect(new URL(destination, request.url))
    : NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/login/:path*", "/signup/:path*", "/reset-password/:path*", "/verify-email/:path*", "/onboarding/:path*", "/auth/:path*"],
}
