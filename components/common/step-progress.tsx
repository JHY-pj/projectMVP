import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import styles from "./step-progress.module.css"

export function StepProgress({ steps, current, className, ...props }: ComponentProps<"div"> & { steps: string[]; current: number }) {
  const value = Math.round(current / steps.length * 100)
  return <div className={cn(styles.root, className)} {...props}>
    <Progress value={value} aria-label={`사건 등록 진행률 ${value}%`} />
    <ol>{steps.map((label, index) => <li className={index + 1 === current ? styles.current : index + 1 < current ? styles.complete : undefined} aria-current={index + 1 === current ? "step" : undefined} key={label}><span aria-hidden="true">{index + 1 < current ? "✓" : index + 1}</span><small>{label}</small></li>)}</ol>
  </div>
}
