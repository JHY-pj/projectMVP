import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { scopedClasses } from "@/components/common/scoped-classes"
import styles from "./legal-ui.module.css"

export const uiClass = scopedClasses(styles)

export function LegalSection({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["legal-section"], className)} {...props} />
}
export function LegalConsentWarning({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(styles["legal-consent-warning"], className)} {...props} />
}
