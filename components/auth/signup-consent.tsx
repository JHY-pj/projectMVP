"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { LegalDocumentDialog } from "@/components/legal/legal-document-dialog"

export function SignupConsent({ onChange }: { onChange: (complete: boolean) => void }) {
  const [termsDone, setTermsDone] = useState(false)
  const [privacyDone, setPrivacyDone] = useState(false)
  const [active, setActive] = useState<"terms" | "privacy" | null>(null)
  function agree(type: "terms" | "privacy") {
    const nextTerms = termsDone || type === "terms"
    const nextPrivacy = privacyDone || type === "privacy"
    setTermsDone(nextTerms)
    setPrivacyDone(nextPrivacy)
    onChange(nextTerms && nextPrivacy)
    setActive(null)
  }
  return (
    <div className="signup-consent">
      <div className="signup-consent-row">
        <span><strong>[필수]</strong> 이용약관 <span className="signup-consent-state">{termsDone ? "완료" : "미완료"}</span></span>
        <button type="button" className="button button-outline button-small" onClick={() => setActive("terms")}>{termsDone ? "다시 보기" : "내용 보기"}</button>
      </div>
      <div className="signup-consent-row">
        <span><strong>[필수]</strong> 개인정보 수집·이용 동의 <span className="signup-consent-state">{privacyDone ? "완료" : "미완료"}</span></span>
        <button type="button" className="button button-outline button-small" onClick={() => setActive("privacy")}>{privacyDone ? "다시 보기" : "내용 보기"}</button>
      </div>
      <div className="checkbox-row signup-consent-final">
        <Checkbox checked={termsDone && privacyDone} disabled aria-label="필수 동의 완료 상태" />
        <span>필수 항목 전체 동의 {termsDone && privacyDone ? "완료" : "(두 항목을 모두 완료해 주세요)"}</span>
      </div>
      <LegalDocumentDialog type="terms" open={active === "terms"} onOpenChange={(open) => { if (!open) setActive(null) }} onAgree={() => agree("terms")} />
      <LegalDocumentDialog type="privacy" open={active === "privacy"} onOpenChange={(open) => { if (!open) setActive(null) }} onAgree={() => agree("privacy")} />
    </div>
  )
}
