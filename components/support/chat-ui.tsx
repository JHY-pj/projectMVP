import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import styles from "./chat-ui.module.css"

export const uiClass = scopedClasses(styles)

export function SupportChat({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["support-chat"], className)} {...props} />
}
export function SupportChatHeader({ className, ...props }: ComponentProps<"header">) {
  return <header className={cn(styles["support-chat-header"], className)} {...props} />
}
export function SupportChatTitle({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["support-chat-title"], className)} {...props} />
}
export function SupportChatIcon({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["support-chat-icon"], className)} {...props} />
}
export function SupportChatActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["support-chat-actions"], className)} {...props} />
}
export function SupportChatNotice({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["support-chat-notice"], className)} {...props} />
}
export function SupportChatMessages({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["support-chat-messages"], className)} {...props} />
}
export function ChatMessage({ role = "assistant", loading = false, className, ...props }: Omit<ComponentProps<"article">, "role"> & { role?: "user" | "assistant"; loading?: boolean }) {
  return <article className={cn(styles["chat-message"], styles[`chat-message-${role}`], loading && styles["chat-message-loading"], className)} {...props} />
}
export function ChatAvatar({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(styles["chat-avatar"], className)} {...props} />
}
export function ChatError({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["chat-error"], className)} {...props} />
}
export function ChatQuickQuestions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles["chat-quick-questions"], className)} {...props} />
}
export function ChatComposer({ className, ...props }: ComponentProps<"form">) {
  return <form className={cn(styles["chat-composer"], className)} {...props} />
}
export function SupportChatFooter({ className, ...props }: ComponentProps<"footer">) {
  return <footer className={cn(styles["support-chat-footer"], className)} {...props} />
}
export function SupportTools({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(styles["support-tools"], className)} {...props} />
}
