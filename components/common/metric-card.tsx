import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./metric-card.module.css"

type MetricCardProps = { label: ReactNode; value: ReactNode; detail?: ReactNode; icon?: ReactNode; status?: ReactNode; layout?: "detail" | "summary" }
export function MetricCard({ label, value, detail, icon, status, layout = "detail" }: MetricCardProps) {
  return <article className={cn(styles.card, layout === "summary" && styles.summary)}>
    {layout === "summary" ? <><small>{label}</small><strong>{value}</strong>{status}</> : <>{icon}<div><small>{label}</small><strong>{value}</strong>{detail && <p>{detail}</p>}</div></>}
  </article>
}
