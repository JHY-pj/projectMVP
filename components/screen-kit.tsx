import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faCircleExclamation,
  faCircleInfo,
  faChevronRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons"

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="page-heading motion-enter">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav className="breadcrumbs motion-enter" aria-label="현재 위치">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 && <FontAwesomeIcon icon={faChevronRight} />}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "secure"
  title: string
  children: React.ReactNode
}) {
  const icon =
    tone === "warning"
      ? faCircleExclamation
      : tone === "secure"
        ? faShieldHalved
        : faCircleInfo
  return (
    <aside className={`notice notice-${tone}`}>
      <FontAwesomeIcon icon={icon} />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </aside>
  )
}

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: "positive" | "warning" | "negative" | "info" | "neutral"
  children: React.ReactNode
}) {
  return <span className={`status status-${tone}`}>{children}</span>
}

export function BackLink({ href, label = "이전으로" }: { href: string; label?: string }) {
  return (
    <Link className="back-link" href={href}>
      <FontAwesomeIcon icon={faArrowLeft} /> {label}
    </Link>
  )
}
