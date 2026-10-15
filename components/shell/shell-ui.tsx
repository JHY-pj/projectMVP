import type { ComponentProps } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./shell-ui.module.css"

export const uiClass = scopedClasses(styles)

export const BrandMark = styledPart("span", styles["brand-mark"])
export const BrandCopy = styledPart("span", styles["brand-copy"])
export const BottomNavigation = styledPart("nav", styles["mobile-bottom-nav"])
export const ShellFrame = styledPart("div", styles["site-shell"])
export const SiteHeader = styledPart("header", styles["site-header"])
export const HeaderInner = styledPart("div", styles["header-inner"])
export const HeaderBrand = styledPart("div", styles["header-brand"])
export const DemoLabel = styledPart("span", styles["demo-label"])
export const DesktopNav = styledPart("nav", styles["desktop-nav"])
export const HeaderActions = styledPart("div", styles["header-actions"])
export const MobileMenu = styledPart("details", styles["mobile-menu"])
export const AdminBand = styledPart("div", styles["admin-band"])
export const DemoBanner = styledPart("div", styles["demo-banner"])
export const SiteFooter = styledPart("footer", styles["site-footer"])
export const FooterInner = styledPart("div", styles["footer-inner"])

export function NavigationLink({ active = false, className, ...props }: ComponentProps<typeof Link> & { active?: boolean }) {
  return <Link className={cn(styles["nav-link"], active && styles["is-active"], className)} aria-current={active ? "page" : undefined} {...props} />
}
export function BottomNavigationLink({ active = false, className, ...props }: ComponentProps<typeof Link> & { active?: boolean }) {
  return <Link className={cn(active && styles["is-active"], className)} aria-current={active ? "page" : undefined} {...props} />
}
