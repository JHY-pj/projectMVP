import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"
import { scopedClasses } from "@/components/common/scoped-classes"
import styles from "./admin-ui.module.css"

export const uiClass = scopedClasses(styles)

export function AdminMetrics({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["admin-metrics"], className)} {...props} />
}
export function SecurityChecks({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn(styles["security-checks"], className)} {...props} />
}
export function Toolbar({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["toolbar"], className)} {...props} />
}
export function ReviewWorkspace({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["review-workspace"], className)} {...props} />
}
export function DocumentPlaceholder({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["document-placeholder"], className)} {...props} />
}
export function LabelSummary({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["label-summary"], className)} {...props} />
}

export function SecurityCheck({ icon, title, detail }: { icon: ReactNode; title: ReactNode; detail: ReactNode }) {
  return <li className={styles["security-check"]}>{icon}<span><strong>{title}</strong><small>{detail}</small></span></li>
}
