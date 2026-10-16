import type { ComponentProps, ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./primitives.module.css"

type BoxProps<T extends ElementType> = { as?: T; className?: string; children?: ReactNode } & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">
export function PageLayout({ width = "wide", className, ...props }: ComponentProps<"main"> & { width?: "wide" | "reading" }) {
  return <main data-ui="page" className={cn(styles.page, styles.sectionStack, width === "reading" && styles.reading, className)} {...props} />
}
export function Surface<T extends ElementType = "section">({ as, className, stack = false, muted = false, density = "default", ...props }: BoxProps<T> & { stack?: boolean; muted?: boolean; density?: "default" | "compact" | "flush" }) {
  const Comp: ElementType = as || "section"
  return <Comp data-ui="panel" className={cn(styles.surface, density === "flush" && styles.flush, density === "compact" && styles.compactSurface, stack && styles.stack, muted && styles.muted, className)} {...props} />
}
export function PanelHeading<T extends ElementType = "div">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="panel-heading" className={cn(styles.heading, className)} {...props} />
}
export function FormStack<T extends ElementType = "div">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="form-stack" className={cn(styles.stack, className)} {...props} />
}
export function FormGrid<T extends ElementType = "div">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="form-grid" className={cn(styles.grid, className)} {...props} />
}
export function Field<T extends ElementType = "label">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "label"
  return <Comp data-ui="field" className={cn(styles.field, className)} {...props} />
}
export function CheckboxRow<T extends ElementType = "label">({ as, boxed = false, className, ...props }: BoxProps<T> & { boxed?: boolean }) {
  const Comp: ElementType = as || "label"
  return <Comp data-ui="checkbox-row" className={cn(styles.checkbox, boxed && styles.checkboxBox, className)} {...props} />
}
export function InfoList<T extends ElementType = "dl">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "dl"
  return <Comp data-ui="info-list" className={cn(styles.infoList, className)} {...props} />
}
export function ActionBar<T extends ElementType = "div">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="actions" className={cn(styles.actions, className)} {...props} />
}
export function ActionIcon<T extends ElementType = "div">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="action-icon" className={cn(styles.actionIcon, className)} {...props} />
}
export function ActionSection<T extends ElementType = "section">({ as, className, tone = "warning", compact = false, ...props }: BoxProps<T> & { tone?: "warning" | "inverse" | "danger"; compact?: boolean }) {
  const Comp: ElementType = as || "section"
  return <Comp data-ui="action-section" className={cn(styles.callout, tone === "inverse" && styles.inverse, tone === "danger" && styles.danger, compact && styles.compact, className)} {...props} />
}
export function Input({ className, type, trailingAction = false, leadingIcon = false, ...props }: ComponentProps<"input"> & { trailingAction?: boolean; leadingIcon?: boolean }) {
  return <input data-ui="input" type={type} className={cn(type === "checkbox" || type === "radio" ? styles.checkInput : styles.input, trailingAction && styles.trailingAction, leadingIcon && styles.leadingIcon, className)} {...props} />
}
export function Select({ className, ...props }: ComponentProps<"select">) { return <select data-ui="select" className={cn(styles.input, className)} {...props} /> }
export function Textarea({ className, ...props }: ComponentProps<"textarea">) { return <textarea data-ui="textarea" className={cn(styles.input, styles.textarea, className)} {...props} /> }

export function CenteredPage<T extends ElementType = "main">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "main"
  return <Comp data-ui="centered-page" className={cn(styles.centered, className)} {...props} />
}
export function CompletionCard<T extends ElementType = "section">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "section"
  return <Comp data-ui="completion-card" className={cn(styles.completion, className)} {...props} />
}

export function TableContainer<T extends ElementType = "div">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="table-container" className={cn(styles.tableContainer, className)} {...props} />
}
export function CompletionIcon<T extends ElementType = "span">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "span"
  return <Comp data-ui="completion-icon" className={cn(styles.completionIcon, className)} {...props} />
}
export function ResponsiveGrid<T extends ElementType = "div">({ as, className, balance = "equal", ...props }: BoxProps<T> & { balance?: "equal" | "wide-left" }) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="responsive-grid" className={cn(styles.grid, balance === "wide-left" && styles.wideLeft, className)} {...props} />
}

export function SectionStack<T extends ElementType = "div">({ as, className, ...props }: BoxProps<T>) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="section-stack" className={cn(styles.sectionStack, className)} {...props} />
}

export function InputAction({ className, ...props }: ComponentProps<"div">) {
  return <div data-ui="input-action" className={cn(styles.inputAction, className)} {...props} />
}

export function InfoRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <div className={styles.infoRow}><dt>{label}</dt><dd>{children}</dd></div>
}
