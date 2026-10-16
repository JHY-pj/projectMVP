import type { ComponentProps } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import styles from "./shell-ui.module.css"

export const uiClass = scopedClasses(styles)

export function BrandMark({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["brand-mark"], className)} {...props} />
}
export function BrandCopy({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["brand-copy"], className)} {...props} />
}
export function BottomNavigation({ className, ...props }: ComponentProps<"nav">) {
  return <nav className={cn(styles["mobile-bottom-nav"], className)} {...props} />
}
export function ShellFrame({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["site-shell"], className)} {...props} />
}
export function SiteHeader({ className, ...props }: ComponentProps<"header">) {
  return <header className={cn(styles["site-header"], className)} {...props} />
}
export function HeaderInner({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["header-inner"], className)} {...props} />
}
export function HeaderBrand({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["header-brand"], className)} {...props} />
}
export function DemoLabel({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["demo-label"], className)} {...props} />
}
export function DesktopNav({ className, ...props }: ComponentProps<"nav">) {
  return <nav className={cn(styles["desktop-nav"], className)} {...props} />
}
export function HeaderActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["header-actions"], className)} {...props} />
}
export function MobileMenu({ className, ...props }: ComponentProps<"details">) {
  return <details className={cn(styles["mobile-menu"], className)} {...props} />
}
export function AdminBand({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["admin-band"], className)} {...props} />
}
export function DemoBanner({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["demo-banner"], className)} {...props} />
}
export function SiteFooter({ className, ...props }: ComponentProps<"footer">) {
  return <footer className={cn(styles["site-footer"], className)} {...props} />
}
export function FooterInner({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["footer-inner"], className)} {...props} />
}

export function NavigationLink({ active = false, className, ...props }: ComponentProps<typeof Link> & { active?: boolean }) {
  return <Link className={cn(styles["nav-link"], active && styles["is-active"], className)} aria-current={active ? "page" : undefined} {...props} />
}
export function BottomNavigationLink({ active = false, className, ...props }: ComponentProps<typeof Link> & { active?: boolean }) {
  return <Link className={cn(active && styles["is-active"], className)} aria-current={active ? "page" : undefined} {...props} />
}
