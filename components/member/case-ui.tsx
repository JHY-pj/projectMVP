import type { ComponentProps, ReactNode } from "react"
import { Surface } from "@/components/common/primitives"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import styles from "./case-ui.module.css"

export const uiClass = scopedClasses(styles)

export function CaseList({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["case-list"], className)} {...props} />
}
export function CaseListItem({ className, ...props }: ComponentProps<"article">) {
  return <article className={cn(styles["case-list-item"], className)} {...props} />
}
export function CaseListPrimary({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["case-list-primary"], className)} {...props} />
}
export function CaseIcon({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["case-icon"], className)} {...props} />
}
export function CaseListNext({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["case-list-next"], className)} {...props} />
}
export function CaseListMeta({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["case-list-meta"], className)} {...props} />
}
export function WizardSection({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["wizard-section"], className)} {...props} />
}
export function EligibilityList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn(styles["eligibility-list"], className)} {...props} />
}
export function ExecutionOptions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["execution-options"], className)} {...props} />
}
export function WizardSubsection({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["wizard-subsection"], className)} {...props} />
}
export function WizardActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["wizard-actions"], className)} {...props} />
}
export function CaseDeletionPendingNote({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(styles["case-deletion-pending-note"], className)} {...props} />
}
export function CaseDeletionPendingActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["case-deletion-pending-actions"], className)} {...props} />
}
export function CaseIdentity({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["case-identity"], className)} {...props} />
}
export function CaseStatusActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["case-status-actions"], className)} {...props} />
}
export function ActivityList({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn(styles["activity-list"], className)} {...props} />
}
export function RuleReasons({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn(styles["rule-reasons"], className)} {...props} />
}
export function ReportCheckNote({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(styles["report-check-note"], className)} {...props} />
}
export function ReportCheckList({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn(styles["report-check-list"], className)} {...props} />
}
export function PlanHeading({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["plan-heading"], className)} {...props} />
}
export function PlanHeadingActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["plan-heading-actions"], className)} {...props} />
}
export function ChecklistPanel({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["checklist-panel"], className)} {...props} />
}
export function PlanItem({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["plan-item"], className)} {...props} />
}
export function PlanIndex({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["plan-index"], className)} {...props} />
}
export function PlanRecordList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn(styles["plan-record-list"], className)} {...props} />
}
export function PlanFileNotice({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn(styles["plan-file-notice"], className)} {...props} />
}
export function PlanFileNoticeText({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(styles["plan-file-notice"], className)} {...props} />
}
export function ResultForm({ className, ...props }: ComponentProps<"form">) {
  return <form className={cn(styles["result-form"], className)} {...props} />
}
export function ReasonGrid({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["reason-grid"], className)} {...props} />
}
export function DeleteRequestNotice({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["delete-request-notice"], className)} {...props} />
}
export function DeleteRequestSummary({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(styles["delete-request-summary"], className)} {...props} />
}
export function NotificationList({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["notification-list"], className)} {...props} />
}
export function ConsentHistory({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["consent-history"], className)} {...props} />
}

export function WizardCard({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={cn(styles["wizard-card"], className)} {...props} />
}
export function DeletionPendingCard({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={cn(styles["case-deletion-pending"], className)} {...props} />
}
export function SettingsPanel({ className, ...props }: ComponentProps<"section">) {
  return <Surface className={className} {...props} />
}

export function ActivityEntry({ title, description, date }: { title: ReactNode; description?: ReactNode; date?: ReactNode }) {
  return <li className={styles["activity-entry"]}><span aria-hidden="true" /><div><strong>{title}</strong>{description && <p>{description}</p>}{date && <small>{date}</small>}</div></li>
}
export function SettingRow({ title, description, children }: { title: ReactNode; description: ReactNode; children: ReactNode }) {
  return <div className={styles["setting-row"]}><span><strong>{title}</strong><small>{description}</small></span>{children}</div>
}
export function NotificationCard({ unread = false, icon, badge, title, description, date, action }: { unread?: boolean; icon: ReactNode; badge: ReactNode; title: ReactNode; description: ReactNode; date: ReactNode; action: ReactNode }) {
  return <article className={cn(styles["notification-card"], unread && styles["is-unread"])}><span aria-hidden="true">{icon}</span><div>{badge}<h2>{title}</h2><p>{description}</p><small>{date}</small></div>{action}</article>
}
export function ConsentHistoryRow({ title, detail, status }: { title: ReactNode; detail: ReactNode; status: ReactNode }) {
  return <div className={styles["consent-history-row"]}><div><strong>{title}</strong><small>{detail}</small></div>{status}</div>
}
