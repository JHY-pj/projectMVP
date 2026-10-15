"use client"

import { uiClass } from "@/components/member/case-ui"
import { Surface, FormStack, FormGrid, Field, Select } from "@/components/common/primitives"

import { Button } from "@/components/ui/button"

import { FormEvent } from "react"

const fields = [
  { key: "enforcement_title_confirmed", label: "집행권원·확정 여부", options: [["Unknown", "모름"], ["Y", "확인함 (사용자 진술)"], ["N", "아직 확인하지 못함"]] },
  { key: "service_status", label: "송달 상태", options: [["Unknown", "모름"], ["정상", "정상"], ["불명", "확인 필요"]] },
  ...[["known_bank", "은행 단서"], ["known_employer", "근무처 단서"], ["known_real_estate", "부동산 단서"], ["known_vehicle", "차량 단서"]].map(([key, label]) => ({ key, label, options: [["Unknown", "모름"], ["Y", "알고 있음"], ["N", "알지 못함"]] })),
  { key: "expected_cost_band", label: "예상 비용 구간", options: [["Unknown", "모름"], ["under-10", "10만 원 미만"], ["10-30", "10만~30만 원"], ["30-50", "30만~50만 원"], ["over-50", "50만 원 이상"]] },
  { key: "priority_right_risk", label: "선순위 권리 확인 결과", options: [["Unknown", "모름 / 확인 중"], ["Y", "있음"], ["N", "없음 (사용자 확인)"]] },
]

export function CaseInputEditor({ record, onSave }: { record: Record<string, unknown>; onSave: (patch: Record<string, string>) => void }) {
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const patch: Record<string, string> = {}
    for (const field of fields) {
      const value = String(data.get(field.key) || "Unknown")
      if (field.options.some(([option]) => option === value)) patch[field.key] = value
    }
    onSave(patch)
  }
  return <Surface as="details" className={uiClass("case-input-editor")} id="case-input-editor">
    <summary>판단에 사용할 정보 보완</summary>
    <p>아는 내용만 변경하고 저장하면 리포트와 집행 계획이 함께 갱신됩니다. 구체적인 집행 계획 기록이 있으면 해당 항목은 최근 기록을 우선 사용합니다.</p>
    <FormStack as="form" key={JSON.stringify(record)} onSubmit={save}>
      <FormGrid>{fields.map((field) => <Field key={field.key}><span>{field.label}</span><Select name={field.key} defaultValue={String(record[field.key] || "Unknown")}>{field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field>)}</FormGrid>
      <Button variant="default" size="sm" type="submit">정보 저장하고 판단 갱신</Button>
    </FormStack>
  </Surface>
}
