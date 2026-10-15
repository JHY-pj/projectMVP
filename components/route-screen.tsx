import { CenteredPage, CompletionCard } from "@/components/common/primitives"

import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { demoRedirectFor, isDemoAppPath } from "@/lib/demo-routing"
import Link from "next/link"
import { SiteShell } from "@/components/site-shell"
import { SupportChatScreen } from "@/components/support-chat-screen"
import {
  AboutScreen,
  FaqScreen,
  GuideScreen,
  HomeScreen,
  LegalScreen,
  NoticesScreen,
} from "@/components/public-screens"
import {
  CaseDetailScreen,
  CaseListScreen,
  CaseWizardScreen,
  DashboardScreen,
} from "@/components/member-screens"


const legalRoutes = ["terms", "privacy", "disclaimer", "data-policy"] as const

function NotFoundScreen() {
  return <CenteredPage id="main-content"><CompletionCard><p className="eyebrow">404</p><h1>페이지를 찾을 수 없습니다</h1><p>주소를 확인하거나 홈에서 다시 시작해 주세요.</p><Button asChild variant="default" size="default"><Link href="/">홈으로</Link></Button></CompletionCard></CenteredPage>
}

export function RouteScreen({ segments }: { segments: string[] }) {
  const path = segments.join("/")
  const destination = demoRedirectFor(path)
  if (destination) redirect(destination)

  if (segments[0] === "admin") return <SiteShell><NotFoundScreen /></SiteShell>

  if (segments[0] === "app") {
    if (!isDemoAppPath(segments)) return <SiteShell><NotFoundScreen /></SiteShell>
    let screen = <DashboardScreen />
    if (path === "app/cases") screen = <CaseListScreen />
    else if (path === "app/cases/new") screen = <CaseWizardScreen />
    else if (segments[1] === "cases" && segments[2]) screen = <CaseDetailScreen section={segments[3] ?? "summary"} />
    return <SiteShell mode="member">{screen}</SiteShell>
  }

  let screen: React.ReactNode
  if (path === "") screen = <HomeScreen />
  else if (path === "about") screen = <AboutScreen />
  else if (path === "guide") screen = <GuideScreen />
  else if (path === "faq") screen = <FaqScreen />
  else if (path === "notices") screen = <NoticesScreen />
  else if (path === "support") screen = <SupportChatScreen />
  else if (legalRoutes.includes(path as (typeof legalRoutes)[number])) screen = <LegalScreen type={path as (typeof legalRoutes)[number]} />
  else screen = <NotFoundScreen />
  return <SiteShell>{screen}</SiteShell>
}
