"use client"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import styles from "./tabs.module.css"
function Tabs({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" data-orientation={orientation} orientation={orientation} className={cn(styles.root, className)} {...props} />
}
const tabsListVariants = cva(styles.list, { variants: { variant: { default: "", line: styles.line } }, defaultVariants: { variant: "default" } })
function TabsList({ className, variant = "default", layout = "flow", columns = 6, style, ...props }: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants> & { layout?: "flow" | "responsive"; columns?: number }) {
  return <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={cn(tabsListVariants({ variant }), layout === "responsive" && styles.responsive, className)} style={{ "--tab-columns": columns, ...style } as React.CSSProperties} {...props} />
}
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) { return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn(styles.trigger, className)} {...props} /> }
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) { return <TabsPrimitive.Content data-slot="tabs-content" className={cn(styles.content, className)} {...props} /> }
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
