export type TabBounds = { left: number; width: number }
type TabScrollLayout = {
  viewportWidth: number
  scrollWidth: number
  activeIndex: number
  tabs: TabBounds[]
  neighborPreview?: number
}

/** Keep the active tab whole and reveal its actual neighbours on both sides. */
export function visibleTabScrollLeft({ viewportWidth, scrollWidth, activeIndex, tabs, neighborPreview = 24 }: TabScrollLayout) {
  const active = tabs[activeIndex]
  const maxScroll = Math.max(0, scrollWidth - viewportWidth)
  const clamp = (value: number, min = 0, max = maxScroll) => Math.max(min, Math.min(value, max))
  if (!active || viewportWidth <= 0 || !maxScroll) return 0
  if (activeIndex === 0) return 0
  if (activeIndex === tabs.length - 1) return maxScroll

  const previous = tabs[activeIndex - 1]
  const next = tabs[activeIndex + 1]
  const end = active.left + active.width
  const centered = active.left - (viewportWidth - active.width) / 2
  if (active.width >= viewportWidth) return clamp(active.left)

  // Show both neighbours in full when the three-tab group fits.
  const groupEnd = next.left + next.width
  if (groupEnd - previous.left <= viewportWidth) {
    return clamp(centered, Math.max(0, groupEnd - viewportWidth), Math.min(maxScroll, previous.left))
  }

  // Otherwise reserve visible portions of both adjacent tabs, using real gaps.
  const previousEnd = previous.left + previous.width
  const gaps = Math.max(0, active.left - previousEnd) + Math.max(0, next.left - end)
  const preview = Math.min(neighborPreview, Math.max(0, (viewportWidth - active.width - gaps) / 2))
  const lower = Math.max(0, end - viewportWidth, next.left + Math.min(preview, next.width) - viewportWidth)
  const upper = Math.min(maxScroll, active.left, previousEnd - Math.min(preview, previous.width))
  return lower <= upper ? clamp(centered, lower, upper) : clamp(centered)
}
