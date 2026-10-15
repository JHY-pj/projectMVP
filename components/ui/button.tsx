import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import styles from "./controls.module.css"

const buttonVariants = cva([styles.control, styles.button], {
  variants: {
    variant: {
      default: styles.primary, destructive: styles.destructive,
      outline: styles.outline, secondary: styles.secondary,
      ghost: styles.ghost, link: styles.link,
      "danger-outline": styles.dangerOutline,
      inverse: styles.inverse, "inverse-outline": styles.inverseOutline,
    },
    size: {
      default: styles.md, xs: styles.xs, sm: styles.sm, lg: styles.lg,
      icon: [styles.md, styles.icon], "icon-xs": [styles.xs, styles.icon],
      "icon-sm": [styles.sm, styles.icon], "icon-lg": [styles.lg, styles.icon],
    },
  },
  defaultVariants: { variant: "default", size: "default" },
})

function Button({ className, variant = "default", size = "default", asChild = false, fullWidth = false, stretch = false, ...props }:
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean; fullWidth?: boolean; stretch?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp data-slot="button" data-variant={variant} data-size={size}
    className={cn(buttonVariants({ variant, size }), fullWidth && styles.block, stretch && styles.stretch, className)} {...props} />
}
export { Button, buttonVariants }
