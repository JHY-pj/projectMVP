import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import styles from "./summary-chips.module.css"

export function SummaryChips({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.list, className)} {...props} />
}
