import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import styles from "./selection-card.module.css"

/** Radio and checkbox cards share geometry, focus and selection states. */
export function SelectionCard({ selected = false, className, ...props }: ComponentProps<"label"> & { selected?: boolean }) {
  return <label data-selected={selected || undefined} className={cn(styles.card, className)} {...props} />
}
