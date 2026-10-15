import type { ComponentProps } from "react"
import { Surface } from "@/components/common/primitives"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./case-ui.module.css"

export const uiClass = scopedClasses(styles)

export const CaseList = styledPart("section", styles["case-list"])
export const CaseListItem = styledPart("article", styles["case-list-item"])
export const CaseListPrimary = styledPart("div", styles["case-list-primary"])
export const CaseIcon = styledPart("span", styles["case-icon"])
export const CaseListNext = styledPart("div", styles["case-list-next"])
export const CaseListMeta = styledPart("div", styles["case-list-meta"])
export const WizardSection = styledPart("div", styles["wizard-section"])
export const EligibilityList = styledPart("ul", styles["eligibility-list"])
export const ExecutionOptions = styledPart("div", styles["execution-options"])
export const WizardSubsection = styledPart("section", styles["wizard-subsection"])
export const WizardActions = styledPart("div", styles["wizard-actions"])
export const CaseDeletionPendingNote = styledPart("p", styles["case-deletion-pending-note"])
export const CaseDeletionPendingActions = styledPart("div", styles["case-deletion-pending-actions"])
export const CaseIdentity = styledPart("section", styles["case-identity"])
export const CaseStatusActions = styledPart("div", styles["case-status-actions"])
export const ActivityList = styledPart("ol", styles["activity-list"])
export const RuleReasons = styledPart("ul", styles["rule-reasons"])
export const ReportCheckNote = styledPart("p", styles["report-check-note"])
export const ReportCheckList = styledPart("ol", styles["report-check-list"])
export const PlanHeading = styledPart("div", styles["plan-heading"])
export const PlanHeadingActions = styledPart("div", styles["plan-heading-actions"])
export const ChecklistPanel = styledPart("section", styles["checklist-panel"])
export const PlanItem = styledPart("div", styles["plan-item"])
export const PlanIndex = styledPart("span", styles["plan-index"])
export const PlanRecordList = styledPart("ul", styles["plan-record-list"])
export const PlanFileNotice = styledPart("label", styles["plan-file-notice"])
export const PlanFileNoticeText = styledPart("p", styles["plan-file-notice"])
export const ResultForm = styledPart("form", styles["result-form"])
export const ReasonGrid = styledPart("div", styles["reason-grid"])
export const DeleteRequestNotice = styledPart("div", styles["delete-request-notice"])
export const DeleteRequestSummary = styledPart("p", styles["delete-request-summary"])
export const NotificationList = styledPart("section", styles["notification-list"])
export const ConsentHistory = styledPart("div", styles["consent-history"])

export function WizardCard({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={cn(styles["wizard-card"], className)} {...props} />
}
export function DeletionPendingCard({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={cn(styles["case-deletion-pending"], className)} {...props} />
}
export function SettingsPanel({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={cn(styles["setting-list"], className)} {...props} />
}
