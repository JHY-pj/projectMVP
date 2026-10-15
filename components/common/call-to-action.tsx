import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import styles from "./call-to-action.module.css"

export function CallToAction({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.panel, className)} {...props} />
}
