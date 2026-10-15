import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./legal-ui.module.css"

export const uiClass = scopedClasses(styles)

export const LegalSection = styledPart("section", styles["legal-section"])
export const LegalConsentWarning = styledPart("p", styles["legal-consent-warning"])
