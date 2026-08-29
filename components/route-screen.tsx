import Link from "next/link"
import { SiteShell } from "@/components/site-shell"
import {
  AboutScreen,
  FaqScreen,
  GuideScreen,
  HomeScreen,
  LegalScreen,
  NoticesScreen,
} from "@/components/public-screens"
import {
  AuthScreen,
  OnboardingScreen,
  VerifyEmailScreen,
} from "@/components/auth-screens"
import {
  CaseDetailScreen,
  CaseWizardScreen,
  DashboardScreen,
  NotificationsScreen,
  SettingsScreen,
} from "@/components/member-screens"
import {
  AdminCasesScreen,
  AdminDashboardScreen,
  AdminGenericScreen,
  AdminLabelsScreen,
  AdminReviewScreen,
} from "@/components/admin-screens"

const legalRoutes = ["terms", "privacy", "disclaimer", "data-policy"] as const

function NotFoundScreen() {
  return <main id="main-content" className="centered-page"><section className="completion-card"><p className="eyebrow">404</p><h1>페이지를 찾을 수 없습니다</h1><p>주소를 확인하거나 홈에서 다시 시작해 주세요.</p><Link className="button button-primary" href="/">홈으로</Link></section></main>
}

export function RouteScreen({ segments }: { segments: string[] }) {
  const path = segments.join("/")

  if (path.startsWith("admin")) {
    const type = segments[1]
    let screen = <AdminDashboardScreen />
    if (type === "cases") screen = <AdminCasesScreen />
    else if (type === "review") screen = <AdminReviewScreen />
    else if (type === "labels") screen = <AdminLabelsScreen />
    else if (["scoring", "users", "reminders", "requests", "audit-logs"].includes(type)) screen = <AdminGenericScreen type={type as "scoring"} />
    return <SiteShell mode="admin">{screen}</SiteShell>
  }

  if (path.startsWith("app")) {
    let screen = <DashboardScreen />
    if (path === "app/cases/new") screen = <CaseWizardScreen />
    else if (segments[1] === "cases" && segments[2]) screen = <CaseDetailScreen section={segments[3] ?? "summary"} />
    else if (path === "app/notifications") screen = <NotificationsScreen />
    else if (path === "app/settings") screen = <SettingsScreen />
    return <SiteShell mode="member">{screen}</SiteShell>
  }

  if (path === "login") return <SiteShell><AuthScreen mode="login" /></SiteShell>
  if (path === "signup") return <SiteShell><AuthScreen mode="signup" /></SiteShell>
  if (path === "reset-password") return <SiteShell><AuthScreen mode="reset" /></SiteShell>
  if (path === "verify-email") return <SiteShell><VerifyEmailScreen /></SiteShell>
  if (path === "onboarding") return <SiteShell><OnboardingScreen /></SiteShell>

  let screen: React.ReactNode
  if (path === "") screen = <HomeScreen />
  else if (path === "about") screen = <AboutScreen />
  else if (path === "guide") screen = <GuideScreen />
  else if (path === "faq") screen = <FaqScreen />
  else if (path === "notices") screen = <NoticesScreen />
  else if (legalRoutes.includes(path as (typeof legalRoutes)[number])) screen = <LegalScreen type={path as (typeof legalRoutes)[number]} />
  else screen = <NotFoundScreen />
  return <SiteShell>{screen}</SiteShell>
}
