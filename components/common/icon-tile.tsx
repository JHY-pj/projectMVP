import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import styles from "./icon-tile.module.css"

export function IconTile({ tone = "info", className, ...props }: ComponentProps<"span"> & { tone?: "info" | "negative" | "warning" | "neutral" }) {
  return <span className={cn(styles.tile, styles[tone], className)} {...props} />
}
