import type { ComponentProps } from "react"
import { Surface } from "@/components/common/primitives"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./auth-ui.module.css"

export const uiClass = scopedClasses(styles)

export const AuthMain = styledPart("main", styles["auth-main"])
export const AuthAside = styledPart("section", styles["auth-aside"])
export const AuthIcon = styledPart("span", styles["auth-icon"])
export const AuthCardHeading = styledPart("div", styles["auth-card-heading"])
export const PasswordField = styledPart("div", styles["password-field"])
export const AuthSwitch = styledPart("div", styles["auth-switch"])
export const SecurityNote = styledPart("p", styles["security-note"])
export const ConsentAll = styledPart("div", styles["consent-all"])
export const ConsentRow = styledPart("div", styles["consent-row"])
export const SegmentedControl = styledPart("div", styles["segmented-control"])
export const StickyActions = styledPart("div", styles["sticky-actions"])
export const ConsentGroup = styledPart("div", styles["signup-consent"])
export const SignupConsentRow = styledPart("div", styles["signup-consent-row"])
export const SignupConsentState = styledPart("span", styles["signup-consent-state"])

export function AuthCard({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={cn(styles["auth-card"], className)} {...props} />
}
