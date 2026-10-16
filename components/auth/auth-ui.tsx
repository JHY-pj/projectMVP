import type { ComponentProps } from "react"
import { Surface } from "@/components/common/primitives"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import styles from "./auth-ui.module.css"

export const uiClass = scopedClasses(styles)

export function AuthMain({ className, ...props }: ComponentProps<"main">) {
  return <main className={cn(styles["auth-main"], className)} {...props} />
}
export function AuthAside({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["auth-aside"], className)} {...props} />
}
export function AuthIcon({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["auth-icon"], className)} {...props} />
}
export function AuthCardHeading({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["auth-card-heading"], className)} {...props} />
}
export function PasswordField({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["password-field"], className)} {...props} />
}
export function AuthSwitch({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["auth-switch"], className)} {...props} />
}
export function SecurityNote({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(styles["security-note"], className)} {...props} />
}
export function ConsentAll({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["consent-all"], className)} {...props} />
}
export function ConsentRow({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["consent-row"], className)} {...props} />
}
export function SegmentedControl({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["segmented-control"], className)} {...props} />
}
export function StickyActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["sticky-actions"], className)} {...props} />
}
export function ConsentGroup({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["signup-consent"], className)} {...props} />
}
export function SignupConsentRow({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["signup-consent-row"], className)} {...props} />
}
export function SignupConsentState({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["signup-consent-state"], className)} {...props} />
}

export function AuthCard({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={cn(styles["auth-card"], className)} {...props} />
}
