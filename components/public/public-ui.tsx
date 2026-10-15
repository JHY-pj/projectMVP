import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./public-ui.module.css"

export const uiClass = scopedClasses(styles)

export const HeroSection = styledPart("section", styles["hero-section"])
export const HeroGrid = styledPart("div", styles["hero-grid"])
export const HeroCopy = styledPart("div", styles["hero-copy"])
export const HeroDescription = styledPart("p", styles["hero-description"])
export const HeroActions = styledPart("div", styles["hero-actions"])
export const HeroFootnote = styledPart("p", styles["hero-footnote"])
export const HeroCompass = styledPart("div", styles["hero-compass"])
export const CompassOrbit = styledPart("div", styles["compass-orbit"])
export const Axis = styledPart("span", styles["axis"])
export const CompassCenter = styledPart("div", styles["compass-center"])
export const FloatingCard = styledPart("div", styles["floating-card"])
export const PublicSection = styledPart("section", styles["section"])
export const ProcessGrid = styledPart("div", styles["process-grid"])
export const ProcessCard = styledPart("article", styles["process-card"])
export const StepNumber = styledPart("span", styles["step-number"])
export const TrustGrid = styledPart("div", styles["trust-grid"])
export const PrivacyStack = styledPart("div", styles["privacy-stack"])
export const CheckList = styledPart("ul", styles["check-list"])
export const PlainList = styledPart("ul", styles["plain-list"])
export const GuideTimeline = styledPart("ol", styles["guide-timeline"])
