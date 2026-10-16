import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./icon-list-item.module.css"

export function IconListItem({ icon, children, detail, variant = "default" }: { icon: ReactNode; children: ReactNode; detail?: ReactNode; variant?: "default" | "inverse" | "boxed" }) {
  return <li className={cn(styles.item, styles[variant])}>{icon}{detail ? <div><strong>{children}</strong><span>{detail}</span></div> : children}</li>
}
