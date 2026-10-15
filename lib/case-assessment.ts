/** MVP information-review rules. No recovery probabilities or legal eligibility decisions. */
export const CASE_RULE_VERSION = "MVP-0.2"
export type PlanGroup = "judgment" | "target" | "cost" | "priority"
export type RuleEntry = { savedAt?: number; details?: Record<string, string>; amount?: number }
export type RuleEntries = Partial<Record<PlanGroup, RuleEntry[]>>
export type RuleCheck = { id: PlanGroup; title: string; reason: string; action: string }
export type Assessment = {
  version: string
  status: "closed" | "paused" | "documents" | "target" | "review" | "ready"
  title: string
  explanation: string
  reasons: string[]
  checks: RuleCheck[]
  candidates: string[]
  planOrder: PlanGroup[]
  sources: string[]
}
const targets = [
  ["known_bank", "은행 단서", "예금채권 검토"],
  ["known_employer", "근무처 단서", "급여채권 검토"],
  ["known_real_estate", "부동산 단서", "부동산 집행 검토"],
  ["known_vehicle", "차량 단서", "차량 집행 검토"],
] as const

// Last saved entry is authoritative within its group; an older clear entry must
// not mask a later correction to unknown, pending, present, or excluded.
export function assessCase(input: Record<string, unknown>, entries: RuleEntries = {}): Assessment {
  const reasons: string[] = []
  const checks: RuleCheck[] = []
  const sources = ["사건 입력값 · 사용자 진술"]
  const latest = (group: PlanGroup) => (entries[group] || []).reduce<RuleEntry | undefined>((previous, entry) => !previous || (entry?.savedAt || 0) >= (previous.savedAt || 0) ? entry : previous, undefined)
  const document = latest("judgment")?.details
  const titleReady = document ? document.finality === "확정" : input.enforcement_title_confirmed === "Y"
  const serviceReady = input.service_status === "정상"
  if (document) sources.push("집행권원 기록 · 사용자 진술")
  reasons.push(titleReady ? "집행권원 확인이 입력되어 있습니다. 문서의 진위나 집행 가능성이 검증됐다는 뜻은 아닙니다." : "집행권원·확정 여부가 확인되지 않았거나 추가 확인 상태입니다.")
  reasons.push(serviceReady ? "송달 상태를 정상으로 입력했습니다." : "송달 상태가 모름 또는 확인 필요로 입력되어 있습니다.")
  if (!titleReady || !serviceReady) checks.push({ id: "judgment", title: "문서·송달 확인을 먼저 정리하세요", reason: "입력된 집행권원·확정 여부와 송달 상태 중 확인이 필요한 항목이 있습니다.", action: "문서 확인 기록" })
  const candidates = targets.filter(([key]) => input[key] === "Y").map(([, , label]) => label as string)
  const targetRecord = latest("target")?.details
  const targetBlocked = targetRecord && ["보류", "제외", "추가 확인 필요"].includes(targetRecord.decision)
  const targetReady = candidates.length > 0 && !targetBlocked
  if (targetRecord) sources.push("집행 수단 검토 기록 · 사용자 진술")
  for (const [key, label] of targets) {
    if (input[key] === "Y") reasons.push(`${label}를 알고 있다고 입력했습니다. 실제 재산·잔액의 존재가 확인된 것은 아닙니다.`)
  }
  if (!targetReady) {
    const allNo = targets.every(([key]) => input[key] === "N")
    checks.push({ id: "target", title: targetBlocked ? "집행 수단 검토 결과를 재확인하세요" : "집행 대상 단서를 먼저 정리하세요", reason: targetBlocked ? `최근 검토 결과가 '${targetRecord.decision}'입니다. 기존 단서가 있어도 해당 검토가 해결된 것으로 처리하지 않습니다.` : allNo ? "구체적 대상 단서를 모두 알지 못한다고 입력했습니다. 이는 채무자에게 재산이 없다는 확정이 아닙니다." : "은행·근무처·부동산·차량의 구체적 단서가 아직 입력되지 않았습니다. 모든 종류의 단서를 확보할 필요는 없습니다.", action: "대상·수단 검토" })
    if (input.asset_signal === "있음" || input.income_signal === "있음") reasons.push("일반 재산·소득 단서는 있으나 구체적인 집행 대상 정보가 부족합니다.")
  }
  if (targetBlocked) reasons.push(`최근 집행 수단 검토: ${targetRecord.decision}.`)
  const costEntry = latest("cost")
  const costReady = costEntry ? Number.isSafeInteger(costEntry.amount) && Number(costEntry.amount) > 0 : ["under-10", "10-30", "30-50", "over-50"].includes(String(input.expected_cost_band))
  if (costEntry) sources.push("최근 비용 기록 · 사용자 진술")
  reasons.push(costReady ? `비용 ${costEntry ? "금액" : "구간"}을 입력했습니다. 전체 지출의 확정이나 비용 대비 회수 실익을 보장하지 않습니다.` : "예상 비용이 미입력 상태여서 비용 비교 정보가 부족합니다.")
  if (!costReady) checks.push({ id: "cost", title: "예상 비용을 확인하세요", reason: "검토 중인 절차의 예상 지출과 확인 근거를 기록해 주세요.", action: "비용 확인·기록" })
  const priorityEntry = latest("priority")?.details
  const priorityScope: Record<string, string> = { "예금채권": "known_bank", "급여채권": "known_employer", "부동산": "known_real_estate", "차량": "known_vehicle" }
  const scopeMatches = !priorityEntry || input[priorityScope[priorityEntry.subject]] === "Y"
  const priority = priorityEntry && !scopeMatches ? "확인 중" : priorityEntry ? priorityEntry.priorityResult : input.priority_right_risk === "Y" ? "있음" : input.priority_right_risk === "N" ? "없음" : "확인 중"
  if (priorityEntry && !scopeMatches) reasons.push("최근 선순위 기록의 확인 대상과 입력된 재산 단서가 일치하지 않아 추가 확인으로 유지합니다.")
  if (priorityEntry) sources.push("최근 선순위 권리 기록 · 사용자 진술")
  if (priority !== "없음") checks.push({ id: "priority", title: priority === "있음" ? "선순위 권리 영향을 검토하세요" : "선순위 권리를 확인하세요", reason: priority === "있음" ? "선순위 권리가 있다고 입력했습니다. 대상별 권리관계와 회수에 미치는 영향을 추가 검토할 항목입니다." : "선순위 권리의 확인 결과가 아직 없습니다.", action: "권리 확인·기록" })
  reasons.push(`선순위 권리: ${priority} (사용자 입력).`)
  if (input.debtor_contact_status === "소재 불명") reasons.push("연락 상태를 소재 불명으로 입력했습니다. 연락 가능 여부만으로 재산 유무나 회수 실패를 판정하지 않습니다.")
  const status: Assessment["status"] = input.outcome_status === "success_full" ? "closed" : input.outcome_status === "abandoned" ? "paused" : !titleReady || !serviceReady ? "documents" : !targetReady ? "target" : !costReady || priority !== "없음" ? "review" : "ready"
  const labels = {
    closed: ["전액 회수 결과가 기록되어 있습니다", "추가 집행 안내보다 결과 기록의 정확성을 먼저 확인하세요."],
    paused: ["중단 사유와 재개 조건을 먼저 확인하세요", "중단 상태를 존중하고, 재검토할 때 필요한 정보만 정리합니다."],
    documents: ["문서·송달 확인이 먼저 필요합니다", "대상 단서가 있더라도 문서 확인 상태를 먼저 정리하는 검토 순서입니다."],
    target: ["집행 대상 단서의 구체화가 필요합니다", "기본 문서 확인이 입력됐지만 검토할 대상이나 수단에 추가 확인이 필요합니다."],
    review: ["대상 단서는 있으나 비용·권리 검토가 필요합니다", "알고 있는 단서를 바탕으로 비용과 권리관계를 추가 확인하세요."],
    ready: ["입력 기준의 기본 검토 정보가 모였습니다", "입력된 정보로 집행 수단을 비교할 수 있는 단계입니다. 실제 착수 가능 여부는 별도 확인이 필요합니다."],
  } as const
  if (input.outcome_status === "success_partial") reasons.unshift("일부 회수 상태입니다. 추가 검토는 남은 채권과 이미 회수한 금액을 구분해 진행해야 합니다.")
  if (input.outcome_status === "fail_confirmed") reasons.unshift("회수 실패 결과가 입력되어 있습니다. 이 결과만으로 영구적인 회수 불가능을 확정하지 않습니다.")
  const order: PlanGroup[] = [...new Set<PlanGroup>([...checks.map((item) => item.id), "judgment", "target", "cost", "priority"])]
  return { version: CASE_RULE_VERSION, status, title: labels[status][0], explanation: labels[status][1], reasons, checks: status === "closed" ? [] : checks, candidates, planOrder: order, sources }
}
