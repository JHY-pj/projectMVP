"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"

export function MotionLayer() {
  const pathname = usePathname()

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reduceMotion) return

    const context = gsap.context(() => {
      gsap.fromTo(
        ".motion-enter",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "transform",
        },
      )
      gsap.fromTo(
        ".compass-needle",
        { rotate: -36 },
        { rotate: 24, duration: 1.2, ease: "elastic.out(1, 0.45)" },
      )
      gsap.utils.toArray<HTMLElement>(".plan-progress [data-slot=progress-indicator]").forEach((indicator) => {
        const progress = indicator.closest<HTMLElement>("[data-slot=progress]")
        const value = Number(progress?.getAttribute("aria-valuenow") ?? 0)
        gsap.fromTo(
          indicator,
          { xPercent: -100 },
          { xPercent: -(100 - value), duration: 0.85, ease: "power3.out" },
        )
      })
      gsap.fromTo(
        ".score-fill",
        { scaleX: 0 },
        { scaleX: 0.68, duration: 1.1, ease: "power3.out" },
      )
    })

    return () => context.revert()
  }, [pathname])

  return null
}
