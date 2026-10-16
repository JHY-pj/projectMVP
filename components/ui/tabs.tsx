"use client"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"
import { visibleTabScrollLeft } from "@/lib/tab-scroll"
import { cn } from "@/lib/utils"
import styles from "./tabs.module.css"
import layoutStyles from "@/components/common/primitives.module.css"
function Tabs({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" data-orientation={orientation} orientation={orientation} className={cn(styles.root, className)} {...props} />
}
const tabsListVariants = cva(styles.list, { variants: { variant: { default: "", line: styles.line } }, defaultVariants: { variant: "default" } })
function TabsList({ className, variant = "default", layout = "flow", columns = 6, style, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants> & { layout?: "flow" | "responsive"; columns?: number }) {
  const listRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => listRef.current!, [])
  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    let frame = 0
    const revealActive = () => {
      const active = list.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
      if (!active || list.scrollWidth <= list.clientWidth) return
      const viewport = list.getBoundingClientRect()
      const tab = active.getBoundingClientRect()
      const left = visibleTabScrollLeft(list.scrollLeft, viewport.left + list.clientLeft, list.clientWidth, tab.left, tab.width)
      list.scrollLeft = Math.max(0, Math.min(left, list.scrollWidth - list.clientWidth))
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(revealActive)
    }
    revealActive()
    const mutation = new MutationObserver(schedule)
    mutation.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-state"], childList: true })
    const resize = new ResizeObserver(schedule)
    resize.observe(list)
    list.querySelectorAll('[data-slot="tabs-trigger"]').forEach(tab => resize.observe(tab))
    return () => { cancelAnimationFrame(frame); mutation.disconnect(); resize.disconnect() }
  }, [])
  return <TabsPrimitive.List ref={listRef} data-slot="tabs-list" data-variant={variant} className={cn(tabsListVariants({ variant }), layout === "responsive" && styles.responsive, className)} style={{ "--tab-columns": columns, ...style } as React.CSSProperties} {...props} />
}
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) { return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn(styles.trigger, className)} {...props} /> }
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) { return <TabsPrimitive.Content data-slot="tabs-content" className={cn(styles.content, layoutStyles.sectionStack, className)} {...props} /> }
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
