import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./summary-chips.module.css"

export function SummaryChips({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.list, className)} {...props} />
}

export function SummaryChip({ label, value }: { label: ReactNode; value: ReactNode }) {
  return <span className={styles.chip}>{label} <strong>{value}</strong></span>
}
