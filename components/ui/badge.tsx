import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import styles from "./controls.module.css"

type BadgeTone = "neutral" | "info" | "positive" | "warning" | "negative"
type BadgeSize = "xs" | "sm" | "default" | "lg"
export function Badge({ tone = "neutral", size = "xs", className, ...props }: ComponentProps<"span"> & { tone?: BadgeTone; size?: BadgeSize }) {
  return <span data-slot="badge" data-tone={tone} data-size={size}
    className={cn(styles.control, styles.badge, styles[tone], styles[size === "default" ? "md" : size], className)} {...props} />
}
