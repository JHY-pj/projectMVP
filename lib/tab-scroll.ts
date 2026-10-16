/** Scroll only the tab strip, leaving the document's vertical position intact. */
export function visibleTabScrollLeft(current: number, viewportLeft: number, viewportWidth: number, tabLeft: number, tabWidth: number) {
  if (tabLeft < viewportLeft || tabWidth > viewportWidth) return current + tabLeft - viewportLeft
  const overflow = tabLeft + tabWidth - (viewportLeft + viewportWidth)
  return overflow > 0 ? current + overflow : current
}
