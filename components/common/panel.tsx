import type { ReactNode } from "react"

type PanelProps = {
  title?: string
  eyebrow?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, eyebrow, actions, children, className = "" }: PanelProps) {
  return (
    <section className={["panel", className].filter(Boolean).join(" ")}>
      {(title || eyebrow || actions) && (
        <div className="panel-heading">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

type ActionCardProps = {
  icon: ReactNode
  title: string
  description: string
  action: ReactNode
  danger?: boolean
  className?: string
}

export function ActionCard({ icon, title, description, action, danger = false, className = "" }: ActionCardProps) {
  return (
    <section className={["action-card", danger ? "action-card-danger" : "", className].filter(Boolean).join(" ")}>
      <div className="action-card-content">
        <span className="action-card-icon" aria-hidden="true">{icon}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="action-card-footer">{action}</div>
    </section>
  )
}
