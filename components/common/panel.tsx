import type { ReactNode } from "react"
import { Surface, PanelHeading } from "./primitives"
import styles from "./action-card.module.css"
import { cn } from "@/lib/utils"

type PanelProps = { title?: string; eyebrow?: string; actions?: ReactNode; children: ReactNode; className?: string }
export function Panel({ title, eyebrow, actions, children, className }: PanelProps) {
  return <Surface className={className}>{(title || eyebrow || actions) && <PanelHeading><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}{title && <h2>{title}</h2>}</div>{actions}</PanelHeading>}{children}</Surface>
}
type ActionCardProps = { icon: ReactNode; title: string; description: string; action: ReactNode; danger?: boolean; className?: string }
export function ActionCard({ icon, title, description, action, danger = false, className }: ActionCardProps) {
  return <Surface className={cn(styles.card, danger && styles.danger, className)}><div className={styles.content}><span className={styles.icon} aria-hidden="true">{icon}</span><h2>{title}</h2><p>{description}</p></div><div className={styles.footer}>{action}</div></Surface>
}
