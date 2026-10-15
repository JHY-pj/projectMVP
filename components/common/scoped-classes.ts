import { clsx, type ClassValue } from "clsx"

/** Keep component states local while allowing shared typography and motion utilities. */
export function scopedClasses(styles: Record<string, string>) {
  return (...values: ClassValue[]) => clsx(values).split(/\s+/).map(name => styles[name] || name).join(" ")
}
