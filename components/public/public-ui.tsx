import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./public-ui.module.css"

export const uiClass = scopedClasses(styles)

export const CheckList = styledPart("ul", styles["check-list"])
export const PlainList = styledPart("ul", styles["plain-list"])
export const GuideTimeline = styledPart("ol", styles["guide-timeline"])
