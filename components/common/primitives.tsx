import type { ComponentProps, ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./primitives.module.css"

type BoxProps<T extends ElementType> = { as?: T; className?: string; children?: ReactNode } & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">
function primitive<D extends ElementType>(defaultTag: D, slot: string, style: string) {
  return function Box<T extends ElementType = D>({ as, className, ...props }: BoxProps<T>) {
    const Comp: ElementType = as || defaultTag
    return <Comp data-ui={slot} className={cn(style, className)} {...props} />
  }
}
export function PageLayout({ width = "wide", className, ...props }: ComponentProps<"main"> & { width?: "wide" | "reading" }) {
  return <main data-ui="page" className={cn(styles.page, width === "reading" && styles.reading, className)} {...props} />
}
export function Surface<T extends ElementType = "section">({ as, className, stack = false, muted = false, density = "default", ...props }: BoxProps<T> & { stack?: boolean; muted?: boolean; density?: "default" | "compact" | "flush" }) {
  const Comp: ElementType = as || "section"
  return <Comp data-ui="panel" className={cn(styles.surface, density === "flush" && styles.flush, density === "compact" && styles.compactSurface, stack && styles.stack, muted && styles.muted, className)} {...props} />
}
export const PanelHeading = primitive("div", "panel-heading", styles.heading)
export const FormStack = primitive("div", "form-stack", styles.stack)
export const FormGrid = primitive("div", "form-grid", styles.grid)
export const Field = primitive("label", "field", styles.field)
export const CheckboxRow = primitive("label", "checkbox-row", styles.checkbox)
export const InfoList = primitive("dl", "info-list", styles.infoList)
export const ActionBar = primitive("div", "actions", styles.actions)
export const ActionIcon = primitive("div", "action-icon", styles.actionIcon)
export function ActionSection<T extends ElementType = "section">({ as, className, tone = "warning", compact = false, ...props }: BoxProps<T> & { tone?: "warning" | "inverse"; compact?: boolean }) {
  const Comp: ElementType = as || "section"
  return <Comp data-ui="action-section" className={cn(styles.callout, tone === "inverse" && styles.inverse, compact && styles.compact, className)} {...props} />
}
export function Input({ className, type, trailingAction = false, ...props }: ComponentProps<"input"> & { trailingAction?: boolean }) {
  return <input data-ui="input" type={type} className={cn(type === "checkbox" || type === "radio" ? styles.checkInput : styles.input, trailingAction && styles.trailingAction, className)} {...props} />
}
export function Select({ className, ...props }: ComponentProps<"select">) { return <select data-ui="select" className={cn(styles.input, className)} {...props} /> }
export function Textarea({ className, ...props }: ComponentProps<"textarea">) { return <textarea data-ui="textarea" className={cn(styles.input, styles.textarea, className)} {...props} /> }

export const CenteredPage = primitive("main", "centered-page", styles.centered)
export const CompletionCard = primitive("section", "completion-card", styles.completion)

export const TableContainer = primitive("div", "table-container", styles.tableContainer)
export const CompletionIcon = primitive("span", "completion-icon", styles.completionIcon)
export function ResponsiveGrid<T extends ElementType = "div">({ as, className, balance = "equal", ...props }: BoxProps<T> & { balance?: "equal" | "wide-left" }) {
  const Comp: ElementType = as || "div"
  return <Comp data-ui="responsive-grid" className={cn(styles.grid, balance === "wide-left" && styles.wideLeft, className)} {...props} />
}
