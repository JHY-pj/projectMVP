"use client"

import {
  uiClass,
  SupportChat,
  SupportChatHeader,
  SupportChatTitle,
  SupportChatIcon,
  SupportChatActions,
  SupportChatNotice,
  SupportChatMessages,
  ChatMessage,
  ChatAvatar,
  ChatError,
  ChatQuickQuestions,
  ChatComposer,
  SupportChatFooter,
  SupportTools,
} from "@/components/support/chat-ui"
import { InputAction } from "@/components/common/primitives"
import { PageLayout, Textarea } from "@/components/common/primitives"

import { Button } from "@/components/ui/button"

import { Breadcrumbs, Notice, PageHeader } from "@/components/screen-kit"
import {
  faArrowUp,
  faCommentDots,
  faFileArrowDown,
  faFloppyDisk,
  faList,
  faPlus,
  faRotateLeft,
  faScaleBalanced,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@/lib/fontawesome"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"

type ChatRole = "assistant" | "user"

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "안녕하세요. 어떤 일이 있었는지 편하게 말씀해 주세요. 처음부터 모두 정리해서 말씀하지 않으셔도 괜찮아요. 이야기를 들으며 하나씩 함께 정리해볼게요.",
}

const quickQuestions = [
  "판결은 받았는데 다음에 무엇을 해야 할지 모르겠어요.",
  "상대방이 돈을 주지 않는데 어떤 정보를 먼저 확인해야 하나요?",
  "집행을 시작하기 전에 비용과 기간을 알고 싶어요.",
]

function toApiHistory(messages: ChatMessage[]) {
  return messages.map(({ role, content }) => ({ role, content }))
}

const chatbotApiUrl =
  (import.meta as ImportMeta & { env?: { VITE_CHATBOT_API_URL?: string } }).env
    ?.VITE_CHATBOT_API_URL ?? "/api/chat"

const isStaticPagesDemo = (import.meta as ImportMeta & { env?: { VITE_STATIC_DEMO?: string } }).env?.VITE_STATIC_DEMO === "true";

export function SupportChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([isStaticPagesDemo ? { ...welcomeMessage, content: "GitHub Pages 정적 데모에서는 상담 서버가 연결되지 않습니다. 일반 절차와 화면 구성은 둘러볼 수 있습니다." } : welcomeMessage])
  const [draft, setDraft] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const messageIdRef = useRef(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messageListRef = useRef<HTMLDivElement>(null)
  const canSend = useMemo(() => draft.trim().length > 0 && !isSending, [draft, isSending])

  useEffect(() => {
    const messageList = messageListRef.current
    if (!messageList) return

    messageList.scrollTo({
      top: messageList.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isSending])

  function downloadConversation() {
    if (messages.length <= 1) {
      setError("저장할 상담 내용이 없습니다.")
      return
    }

    const savedAt = new Date().toLocaleString("ko-KR")
    const transcript = [
      "민사 챗봇 상담 기록",
      "",
      `저장일시: ${savedAt}`,
      "",
      "==================================================",
      "",
      ...messages.flatMap((message) => [
        `[${message.role === "user" ? "사용자" : "민사 챗봇"}]`,
        message.content,
        "",
      ]),
      "==================================================",
      "",
      "※ 본 자료는 AI 챗봇과의 대화 기록입니다.",
      "※ 개별 사건에 대한 법률전문가의 법률의견을 의미하지 않습니다.",
    ].join("\n")
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `civil-chat-${new Date().toISOString().replace(/[:.]/g, "-")}-full.txt`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  function resetConversation() {
    setMessages([welcomeMessage])
    setDraft("")
    setError("")
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  async function sendMessage(event?: FormEvent, quickQuestion?: string) {
    event?.preventDefault()
    const content = (quickQuestion ?? draft).trim()
    if (!content || isSending) return

    const history = messages
    const userMessage: ChatMessage = { id: `user-${++messageIdRef.current}`, role: "user", content }
    setMessages((current) => [...current, userMessage])
    setDraft("")
    setError("")
    setIsSending(true)

    if (isStaticPagesDemo) {
      setError("상담 API가 연결되지 않은 정적 데모입니다. 실제 상담 답변은 제공되지 않습니다.");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(chatbotApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content, history: toApiHistory(history) }),
      })
      const data = (await response.json().catch(() => ({}))) as { answer?: string; detail?: string }
      const answer = data.answer?.trim()
      if (!response.ok || !answer) {
        throw new Error(data.detail || "답변을 받아오지 못했습니다.")
      }
      const reply: ChatMessage = { id: `assistant-${++messageIdRef.current}`, role: "assistant", content: answer }
      setMessages((current) => [...current, reply])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "상담 서버와 연결하지 못했습니다.")
    } finally {
      setIsSending(false)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  return (
    <PageLayout width="reading" id="main-content" className={uiClass("support-main")}>
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "고객센터" }]} />
      <PageHeader
        eyebrow="고객센터 · 실시간 안내"
        title="민사 절차를 함께 정리해 볼까요?"
        description="AI가 사건을 대신 판단하지 않습니다. 현재 상황을 듣고, 다음에 확인할 가장 중요한 한 가지를 차분히 안내합니다."
      />

      <SupportChat className={uiClass("motion-enter")} aria-label="민사 안내 챗봇">
        <SupportChatHeader>
          <SupportChatTitle>
            <SupportChatIcon><FontAwesomeIcon icon={faScaleBalanced} /></SupportChatIcon>
            <span><strong>민사 절차 안내</strong><small><i /> {isStaticPagesDemo ? "상담 서버 미연결" : "실시간 상담 중"}</small></span>
          </SupportChatTitle>
          <SupportChatActions>
            <Button variant="ghost" size="default" type="button" onClick={downloadConversation}>
              <FontAwesomeIcon icon={faFloppyDisk} /> 저장
            </Button>
            <Button variant="ghost" size="default" type="button" onClick={resetConversation}>
              <FontAwesomeIcon icon={faPlus} /> 새 상담
            </Button>
          </SupportChatActions>
        </SupportChatHeader>

        <SupportChatNotice>
          <FontAwesomeIcon icon={faCommentDots} />
          <span>판결·채권·계약·손해배상 등 민사 문제를 중심으로 안내합니다. 한 번에 하나씩 확인해요.</span>
        </SupportChatNotice>

        <SupportChatMessages  ref={messageListRef} aria-live="polite" aria-busy={isSending}>
          {messages.map((message) => (
            <ChatMessage role={message.role} key={message.id}>
              {message.role === "assistant" && <ChatAvatar  aria-hidden="true"><FontAwesomeIcon icon={faScaleBalanced} /></ChatAvatar>}
              <p>{message.content}</p>
            </ChatMessage>
          ))}
          {isSending && (
            <ChatMessage className={uiClass("chat-message-assistant chat-message-loading")}>
              <ChatAvatar  aria-hidden="true"><FontAwesomeIcon icon={faScaleBalanced} /></ChatAvatar>
              <p role="status"><FontAwesomeIcon icon={faSpinner} spin /> 말씀해주신 내용을 정리하고 있어요.</p>
            </ChatMessage>
          )}
        </SupportChatMessages>

        {error && (
          <ChatError  role="alert">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>{error} Python 챗봇 서버가 실행 중인지 확인한 뒤 다시 시도해 주세요.</span>
          </ChatError>
        )}

        {messages.length === 1 && !isSending && (
          <ChatQuickQuestions>
            <span>이렇게 시작해 보세요</span>
            {quickQuestions.map((question) => (
              <Button variant="outline" size="sm" type="button" key={question} onClick={() => sendMessage(undefined, question)}>
                {question}
              </Button>
            ))}
          </ChatQuickQuestions>
        )}

        <ChatComposer  onSubmit={sendMessage}>
          <InputAction>
          <label className={uiClass("sr-only")} htmlFor="support-chat-input">상담 내용 입력</label>
          <Textarea
            id="support-chat-input"
            ref={inputRef}
            value={draft}
            rows={2}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                sendMessage()
              }
            }}
            placeholder="어떤 일이 있었는지 편하게 말씀해 주세요."
          />
          <Button variant="default" size="default" type="submit" disabled={!canSend} aria-label="메시지 보내기">
            <FontAwesomeIcon icon={faArrowUp} />
            <span>보내기</span>
          </Button>
          </InputAction>
        </ChatComposer>
        <SupportChatFooter>
          <span>이 상담은 일반적인 정보 안내이며, 사건별 법률 자문이나 결과 보장을 하지 않습니다.</span>
          <Button variant="link" size="sm" type="button" onClick={resetConversation}><FontAwesomeIcon icon={faRotateLeft} /> 대화 초기화</Button>
        </SupportChatFooter>
      </SupportChat>

      <SupportTools className={uiClass("motion-enter")} aria-label="고객센터 보조 메뉴">
        <Link href="/faq"><FontAwesomeIcon icon={faList} /><span><strong>자주 묻는 질문</strong><small>서비스 범위와 기본 절차 확인</small></span></Link>
        <Link href="/guide"><FontAwesomeIcon icon={faFileArrowDown} /><span><strong>승소 후 절차</strong><small>집행 전 확인할 네 가지</small></span></Link>
      </SupportTools>

      <Notice tone="warning" title="중요한 신청·기한·금액 판단 전 확인">
        법원 안내 또는 법률 전문가를 통해 실제 사건의 최신 요건과 비용을 확인해 주세요.
      </Notice>
    </PageLayout>
  )
}
