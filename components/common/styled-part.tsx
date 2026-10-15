import type { ComponentPropsWithRef, ElementType } from "react"
import { cn } from "@/lib/utils"

/** A semantic, polymorphic part whose component owns its CSS Module. */
export function styledPart<D extends ElementType>(tag: D, style: string) {
  return function StyledPart<T extends ElementType = D>({ as, className, ...props }:
    { as?: T; className?: string } & Omit<ComponentPropsWithRef<T>, "as" | "className">) {
    const Component: ElementType = as || tag
    return <Component className={cn(style, className)} {...props} />
  }
}
