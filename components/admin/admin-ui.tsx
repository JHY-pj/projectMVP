import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./admin-ui.module.css"

export const uiClass = scopedClasses(styles)

export const AdminMetrics = styledPart("section", styles["admin-metrics"])
export const SecurityChecks = styledPart("ul", styles["security-checks"])
export const Toolbar = styledPart("div", styles["toolbar"])
export const ReviewWorkspace = styledPart("div", styles["review-workspace"])
export const DocumentPlaceholder = styledPart("section", styles["document-placeholder"])
export const LabelSummary = styledPart("section", styles["label-summary"])
