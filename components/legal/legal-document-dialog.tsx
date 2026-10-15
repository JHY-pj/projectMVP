"use client"

import { Button } from "@/components/ui/button"

import { legalContent, LegalDocumentContent, type LegalType } from "@/components/legal/legal-content"
import { DialogBody, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
        <DialogBody tabIndex={0}>
          <p className="legal-consent-warning">MVP 초안 · 법률 및 개인정보 전문가 검토 전</p>
          <LegalDocumentContent type={type} />
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" type="button" onClick={() => onOpenChange(false)}>닫기</Button>
          <Button variant="default" size="default" type="button" onClick={onAgree}>동의하고 완료</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
