"use client"

import { legalContent, LegalDocumentContent, type LegalType } from "@/components/legal/legal-content"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function LegalDocumentDialog({
  type, open, onOpenChange, onAgree,
}: {
  type: "terms" | "privacy"
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgree: () => void
}) {
  const document = legalContent[type]
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="legal-consent-dialog">
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
          <DialogDescription>{document.lead}</DialogDescription>
        </DialogHeader>
        <div className="legal-consent-scroll" tabIndex={0}>
          <p className="legal-consent-warning">MVP 초안 · 법률 및 개인정보 전문가 검토 전</p>
          <LegalDocumentContent type={type} />
        </div>
        <DialogFooter>
          <button type="button" className="button button-outline" onClick={() => onOpenChange(false)}>닫기</button>
          <button type="button" className="button button-primary" onClick={onAgree}>동의하고 완료</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
