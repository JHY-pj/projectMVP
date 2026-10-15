import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import styles from "@/components/common/screen-kit.module.css"

import { Button } from "@/components/ui/button"
import {
  faArrowLeft,
  faChevronRight,
  faCircleExclamation,
  faCircleInfo,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

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
    <header data-ui="page-header" className={styles.header}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  )
}

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav className={styles.breadcrumbs} aria-label="현재 위치">
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
    <aside data-ui="notice" className={`${styles.notice} ${styles[tone]}`}>
      <FontAwesomeIcon icon={icon} />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </aside>
  )
}

export { Badge as StatusBadge } from "@/components/ui/badge"

export function BackLink({ href, label = "이전으로" }: { href: string; label?: string }) {
  return (
    <Button asChild variant="link" size="sm"><Link href={href}>
      <FontAwesomeIcon icon={faArrowLeft} /> {label}
    </Link></Button>
  )
}

export function SectionHeading({ className, ...props }: ComponentProps<"div">) {
  return <div data-ui="section-heading" className={cn(styles.sectionHeading, className)} {...props} />
}
