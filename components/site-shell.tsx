"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faBell,
  faCirclePlus,
  faCompass,
  faFileLines,
  faGear,
  faHouse,
  faRightFromBracket,
  faShieldHalved,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { MotionLayer } from "@/components/motion-layer"

type ShellMode = "public" | "member" | "admin"

const publicNav = [
  ["서비스 소개", "/about"],
  ["승소 후 절차", "/guide"],
  ["자주 묻는 질문", "/faq"],
]

const memberNav = [
  ["대시보드", "/app"],
  ["내 사건", "/app/cases/demo-2026"],
  ["알림", "/app/notifications"],
  ["내 정보", "/app/settings"],
]

const adminNav = [
  ["운영 현황", "/admin"],
  ["사건 검수", "/admin/cases"],
  ["결과·라벨", "/admin/labels"],
  ["권리 요청", "/admin/requests"],
]

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="집행나침반 홈">
      <span className="brand-mark" aria-hidden="true">
        <FontAwesomeIcon icon={faCompass} />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>집행나침반</strong>
          <small>판결 다음의 방향</small>
        </span>
      )}
    </Link>
  )
}

function NavLinks({ items }: { items: string[][] }) {
  const pathname = usePathname()
  return (
    <>
      {items.map(([label, href]) => {
        const active =
          pathname === href ||
          (href !== "/app" && href !== "/admin" && pathname.startsWith(href))
        return (
          <Link
            className={active ? "nav-link is-active" : "nav-link"}
            href={href}
            key={href}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        )
      })}
    </>
  )
}

export function SiteShell({
  mode = "public",
  children,
}: {
  mode?: ShellMode
  children: React.ReactNode
}) {
  const isPublic = mode === "public"
  const items = isPublic
    ? publicNav
    : mode === "admin"
      ? adminNav
      : memberNav

  return (
    <div className={`site-shell shell-${mode}`}>
      <MotionLayer />
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="주요 메뉴">
            <NavLinks items={items} />
          </nav>
          <div className="header-actions">
            {isPublic ? (
              <>
                <Link className="button button-ghost" href="/login">
                  로그인
                </Link>
                <Link className="button button-primary" href="/signup">
                  내 사건 분석하기
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="icon-button"
                  href={mode === "admin" ? "/app" : "/admin"}
                  aria-label={mode === "admin" ? "회원 화면" : "관리자 화면"}
                >
                  <FontAwesomeIcon icon={mode === "admin" ? faUser : faShieldHalved} />
                </Link>
                <Link className="button button-primary" href="/app/cases/new">
                  <FontAwesomeIcon icon={faCirclePlus} /> 새 사건 등록
                </Link>
              </>
            )}
          </div>
          <details className="mobile-menu">
            <summary aria-label="메뉴 열기">
              <FontAwesomeIcon icon={faBars} />
            </summary>
            <nav aria-label="모바일 메뉴">
              <NavLinks items={items} />
              {isPublic ? (
                <Link className="button button-primary" href="/signup">
                  내 사건 분석하기
                </Link>
              ) : (
                <Link className="nav-link" href="/login">
                  <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
                </Link>
              )}
            </nav>
          </details>
        </div>
      </header>
      {mode === "admin" && (
        <div className="admin-band">
          <div className="content-width">
            <FontAwesomeIcon icon={faShieldHalved} /> 관리자 모드 · 비식별 데이터만 표시
          </div>
        </div>
      )}
      {children}
      {mode === "member" && (
        <nav className="mobile-bottom-nav" aria-label="회원 바로가기">
          <Link href="/app"><FontAwesomeIcon icon={faHouse} /><span>홈</span></Link>
          <Link href="/app/cases/demo-2026"><FontAwesomeIcon icon={faFileLines} /><span>내 사건</span></Link>
          <Link className="bottom-primary" href="/app/cases/new"><FontAwesomeIcon icon={faCirclePlus} /><span>등록</span></Link>
          <Link href="/app/notifications"><FontAwesomeIcon icon={faBell} /><span>알림</span></Link>
          <Link href="/app/settings"><FontAwesomeIcon icon={faGear} /><span>설정</span></Link>
        </nav>
      )}
      <footer className="site-footer">
        <div className="footer-inner">
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
        </div>
      </footer>
    </div>
  )
}
