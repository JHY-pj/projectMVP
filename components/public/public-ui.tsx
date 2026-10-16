import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"
import { scopedClasses } from "@/components/common/scoped-classes"
import styles from "./public-ui.module.css"

export const uiClass = scopedClasses(styles)

export function CheckList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn(styles["check-list"], className)} {...props} />
}
export function PlainList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn(styles["plain-list"], className)} {...props} />
}
export function GuideTimeline({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn(styles["guide-timeline"], className)} {...props} />
}

export function ProcessCard({ step, icon, title, children }: { step: ReactNode; icon: ReactNode; title: ReactNode; children: ReactNode }) {
  return <article className={cn(styles["process-card"], "motion-enter")}><span className={styles["step-number"]}>{step}</span>{icon}<h3>{title}</h3><p>{children}</p></article>
}
export function PrivacyItem({ icon, title, detail }: { icon: ReactNode; title: ReactNode; detail: ReactNode }) {
  return <div className={styles["privacy-item"]}>{icon}<span><strong>{title}</strong><small>{detail}</small></span></div>
}
export function GuideStep({ number, title, children }: { number: ReactNode; title: ReactNode; children: ReactNode }) {
  return <li className={cn(styles["guide-step"], "motion-enter")}><span>{number}</span><div><h2>{title}</h2><p>{children}</p></div></li>
}
