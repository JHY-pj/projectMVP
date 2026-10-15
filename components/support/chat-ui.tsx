import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { scopedClasses } from "@/components/common/scoped-classes"
import { styledPart } from "@/components/common/styled-part"
import styles from "./chat-ui.module.css"

export const uiClass = scopedClasses(styles)

export const SupportChat = styledPart("section", styles["support-chat"])
export const SupportChatHeader = styledPart("header", styles["support-chat-header"])
export const SupportChatTitle = styledPart("div", styles["support-chat-title"])
export const SupportChatIcon = styledPart("span", styles["support-chat-icon"])
export const SupportChatActions = styledPart("div", styles["support-chat-actions"])
export const SupportChatNotice = styledPart("div", styles["support-chat-notice"])
export const SupportChatMessages = styledPart("div", styles["support-chat-messages"])
export function ChatMessage({ role = "assistant", loading = false, className, ...props }: Omit<ComponentProps<"article">, "role"> & { role?: "user" | "assistant"; loading?: boolean }) {
  return <article className={cn(styles["chat-message"], styles[`chat-message-${role}`], loading && styles["chat-message-loading"], className)} {...props} />
}
export const ChatAvatar = styledPart("span", styles["chat-avatar"])
export const ChatError = styledPart("div", styles["chat-error"])
export const ChatQuickQuestions = styledPart("div", styles["chat-quick-questions"])
export const ChatComposer = styledPart("form", styles["chat-composer"])
export const SupportChatFooter = styledPart("footer", styles["support-chat-footer"])
export const SupportTools = styledPart("section", styles["support-tools"])
