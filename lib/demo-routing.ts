// This branch has no account prerequisite. Keep every entry path consistent.
const accountRoutes = new Set([
  "login", "signup", "reset-password", "verify-email", "onboarding", "auth",
])

export function demoRedirectFor(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean)
  if (accountRoutes.has(parts[0])) return "/app"
  if (parts[0] === "app" && ["settings", "notifications"].includes(parts[1])) return "/app/cases"
  return null
}

export function isDemoAppPath(segments: string[]): boolean {
  if (segments[0] !== "app") return false
  if (segments.length === 1) return true
  if (segments[1] !== "cases") return false
  if (segments.length === 2) return true
  if (segments[2] === "new") return segments.length === 3
  if (segments.length === 3) return true
  return segments.length === 4 && ["summary", "report", "plan", "status", "result", "data"].includes(segments[3])
}
