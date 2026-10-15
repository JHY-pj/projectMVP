"use client"

import {
  NavigationLink,
  BottomNavigationLink,
  uiClass,
  BrandMark,
  BrandCopy,
  BottomNavigation,
  ShellFrame,
  SiteHeader,
  HeaderInner,
  HeaderBrand,
  DemoLabel,
  DesktopNav,
  HeaderActions,
  MobileMenu,
  AdminBand,
  DemoBanner,
  SiteFooter,
  FooterInner,
} from "@/components/shell/shell-ui"
import { Button } from "@/components/ui/button"

import { MotionLayer } from "@/components/motion-layer"
import { faBars, faCompass, faFileLines, faHouse, faShieldHalved } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@/lib/fontawesome"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

type ShellMode = "public" | "member" | "admin"

const publicNav = [
  ["서비스 소개", "/about"],
  ["승소 후 절차", "/guide"],
  ["자주 묻는 질문", "/faq"],
  ["고객센터", "/support"],
]

const memberNav = [
  ["대시보드", "/app"],
  ["내 사건", "/app/cases"],
]

const adminNav = [
  ["운영 현황", "/admin"],
  ["사건 검수", "/admin/cases"],
  ["결과·라벨", "/admin/labels"],
  ["권리 요청", "/admin/requests"],
]

const mobileBottomNav = [
  ["홈", "/app", faHouse],
  ["내 사건", "/app/cases", faFileLines],
] as const

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || (!["/app", "/admin"].includes(href) && pathname.startsWith(`${href}/`))
}

function closeMobileMenu(target: HTMLElement) {
  target.closest("[data-shell]")?.querySelector<HTMLDetailsElement>("[data-mobile-menu]")?.removeAttribute("open")
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={uiClass("brand")} href="/" aria-label="집행나침반 홈">
      <BrandMark  aria-hidden="true">
        <FontAwesomeIcon icon={faCompass} />
      </BrandMark>
      {!compact && (
        <BrandCopy>
          <strong>집행나침반</strong>
          <small>판결 다음의 방향</small>
        </BrandCopy>
      )}
    </Link>
  )
}

function NavLinks({ items }: { items: string[][] }) {
  const pathname = usePathname()
  return (
    <>
      {items.map(([label, href]) => {
        const active = isCurrentPath(pathname, href)
        return (
          <NavigationLink
            active={active}
            href={href}
            key={href}
            aria-current={active ? "page" : undefined}
            onClick={(event) => closeMobileMenu(event.currentTarget)}
          >
            {label}
          </NavigationLink>
        )
      })}
    </>
  )
}

function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <BottomNavigation  aria-label="데모 바로가기">
      {mobileBottomNav.map(([label, href, icon]) => {
        const active = isCurrentPath(pathname, href)
        return (
          <BottomNavigationLink
            active={active}
            href={href}
            key={href}
            aria-current={active ? "page" : undefined}
            onClick={(event) => closeMobileMenu(event.currentTarget)}
          >
            <FontAwesomeIcon icon={icon} />
            <span>{label}</span>
          </BottomNavigationLink>
        )
      })}
    </BottomNavigation>
  )
}

export function SiteShell({
  mode = "public",
  children,
}: {
  mode?: ShellMode
  children: React.ReactNode
}) {
  const menuRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node)) menuRef.current?.removeAttribute("open") }
    const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && menuRef.current?.open) { menuRef.current.removeAttribute("open"); menuRef.current.querySelector("summary")?.focus() } }
    document.addEventListener("pointerdown", closeOutside); document.addEventListener("keydown", closeEscape)
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", closeEscape) }
  }, [])
  const isPublic = mode === "public"
  const items = isPublic
    ? publicNav
    : mode === "admin"
      ? adminNav
      : memberNav

  return (
    <ShellFrame data-shell className={uiClass(`site-shell shell-${mode}`)}>
      <MotionLayer />
      <SiteHeader>
        <HeaderInner>
          <HeaderBrand><Brand />{mode === "member" && <DemoLabel>DEMO</DemoLabel>}</HeaderBrand>
          <DesktopNav  aria-label="주요 메뉴">
            <NavLinks items={items} />
          </DesktopNav>
          {isPublic && <HeaderActions>
            <Button asChild variant="ghost" size="default"><Link href="/app/cases">데모 둘러보기</Link></Button>
            <Button asChild variant="default" size="default"><Link href="/app/cases/new">내 사건 분석하기</Link></Button>
          </HeaderActions>}
          <MobileMenu data-mobile-menu  ref={menuRef}>
            <summary aria-label="메뉴 열기">
              <FontAwesomeIcon icon={faBars} />
            </summary>
            <nav aria-label="모바일 메뉴">
              <NavLinks items={items} />
              {isPublic && (
                <Button asChild variant="default" size="default"><Link href="/app/cases/new" onClick={(event) => closeMobileMenu(event.currentTarget)}>
                  내 사건 분석하기
                </Link></Button>
              )}
            </nav>
          </MobileMenu>
        </HeaderInner>
      </SiteHeader>
      {mode === "admin" && (
        <AdminBand>
          <div className={uiClass("content-width")}>
            <FontAwesomeIcon icon={faShieldHalved} /> 관리자 모드 · 비식별 데이터만 표시
          </div>
        </AdminBand>
      )}
      {mode === "member" && <DemoBanner  role="note">가상 사건으로 체험해 주세요. 입력·기록은 현재 브라우저에만 저장됩니다.</DemoBanner>}
      {children}
      {mode === "member" && <MobileBottomNav />}
      <SiteFooter>
        <FooterInner>
          <div>
            <Brand compact />
            <p>집행나침반은 법률 자문이나 채권 회수를 보장하지 않습니다.</p>
          </div>
          <nav aria-label="하단 정책 메뉴">
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/disclaimer">서비스 한계</Link>
            <Link href="/data-policy">데이터 처리 원칙</Link>
          </nav>
          <small>© 2026 집행나침반 · MVP</small>
        </FooterInner>
      </SiteFooter>
    </ShellFrame>
  )
}
