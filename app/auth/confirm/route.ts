import { NextResponse } from "next/server"

// Old verification/recovery links must not create sessions in the demo.
export function GET(request: Request) {
  return NextResponse.redirect(new URL("/app", request.url))
}
