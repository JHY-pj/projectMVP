"use client"

import { assessCase, type RuleEntries } from "@/lib/case-assessment"
import { CaseInputEditor } from "@/components/case-input-editor"
import { Breadcrumbs, Notice, PageHeader, StatusBadge } from "@/components/screen-kit"
import { ActionCard } from "@/components/common/panel"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  faArrowRight,
  faBank,
  faBell,
  faBuilding,
  faCalendarCheck,
  faCar,
  faCheck,
  faChevronRight,
  faCircleCheck,
  faCircleExclamation,
  faClockRotateLeft,
  faCoins,
  faFileCircleCheck,
  faFileLines,
  faListCheck,
  faScaleBalanced,
  faTrashCan,
  faUserShield,
  faWallet,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

type DraftCase = { case_id: string; claim_type: string; claim_amount_band: string; region: string; outcome_status: string; process_status: string; [key: string]: unknown }
const signalLabels: Record<string, string> = { judgment_elapsed_band: "판결 후 경과 기간", debtor_type: "채무자 유형", debtor_contact_status: "연락 상태", asset_signal: "재산 단서", income_signal: "소득 단서", enforcement_title_confirmed: "집행권원 확인", service_status: "송달 상태", known_bank: "은행 단서", known_employer: "근무처 단서", known_real_estate: "부동산 단서", known_vehicle: "차량 단서" }
function readDrafts(): DraftCase[] {
  const value: unknown = JSON.parse(localStorage.getItem("mvp-case-drafts") || "[]")
  if (!Array.isArray(value)) throw new Error("Invalid case storage")
  return value.filter((item): item is DraftCase => Boolean(item && typeof item.case_id === "string" && typeof item.claim_type === "string"))
}

const demoCase = {
  id: "EC-2026-0001",
  type: "대여금",
  amount: "300만 원 이상 ~ 500만 원 미만",
  status: "진행 중",
  updatedAt: "2026.08.29",
  sufficiency: 72,
}

export function DashboardScreen() {
  return <main id="main-content" className="content-width page-main dashboard-main">
    <PageHeader eyebrow="데모" title="집행나침반 체험" description="가상 사건을 입력하고, 확인할 정보와 다음 행동을 정리해 보세요." />
    <section className="panel"><h2>어디서 시작할까요?</h2><p>새 사건을 등록하거나 준비된 예시 사건을 살펴볼 수 있습니다.</p><div className="case-actions"><Link className="button button-primary" href="/app/cases/new">가상 사건 등록</Link><Link className="button button-outline" href="/app/cases">사건 목록</Link></div></section>
    <Notice tone="info" title="이번 데모의 범위">사건 입력 → 정보 확인 → 집행 계획 → 진행·결과 기록을 체험합니다. 입력 기반 규칙으로 검토 순서를 안내합니다. 서버 저장은 아직 연결하지 않았습니다.</Notice>
  </main>
}

const wizardSteps = ["대상 확인", "사건 정보", "집행 경험", "정보 확인 및 제출"]

const caseTypeLabels: Record<string, string> = { loan: "대여금", sale: "매매대금", construction: "공사대금", other: "기타" }
const amountLabels: Record<string, string> = { "under-100": "100만 원 미만", "100-300": "100만~300만 원", "300-500": "300만~500만 원", unknown: "모름" }
const regionLabels: Record<string, string> = { capital: "수도권", metro: "광역시", other: "그 외 지역", unknown: "모름" }
const statusLabels: Record<string, string> = { in_progress: "진행 중", success_partial: "일부 회수", fail_confirmed: "전혀 회수 못함", abandoned: "중단함" }
const attemptLabels: Record<string, string> = { bank: "통장 압류", wage: "급여 압류", car: "차량", estate: "부동산", none: "아직 안 함" }

export function CaseListScreen() {
  const [drafts, setDrafts] = useState<DraftCase[]>([])
  useEffect(() => { const sync = () => { try { setDrafts(readDrafts()) } catch { toast.error("저장된 사건을 불러오지 못했습니다.") } }; sync(); window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync) }, [])
  const cases = [
    ...drafts.map((item) => ({ id: item.case_id, caseNo: item.case_id, type: item.claim_type, amount: item.claim_amount_band, status: item.process_status, next: "입력 정보와 추가 확인사항 검토", updatedAt: "브라우저 저장", tone: "info" as const })),
    { id: "demo-2026", caseNo: "EC-2026-0001", type: "대여금", amount: "300만 원 이상 ~ 500만 원 미만", status: "진행 중", next: "신청 비용·선순위 권리 확인", updatedAt: "2026.08.29", tone: "info" as const },
  ]

  return (
    <main id="main-content" className="content-width page-main cases-main">
      <Breadcrumbs items={[{ label: "대시보드", href: "/app" }, { label: "내 사건" }]} />
      <PageHeader
        eyebrow="내 사건"
        title="등록한 사건"
        description="사건별 진행 상태와 다음 할 일을 확인하세요."
        actions={<Link className="button button-primary" href="/app/cases/new"><FontAwesomeIcon icon={faFileLines} /> 새 사건 등록</Link>}
      />
      <div className="case-list-summary">
        <span>전체 <strong>{cases.length}</strong></span>
        <span>진행 중 <strong>{cases.filter((item) => item.status === "진행 중").length}</strong></span>
        <span>완료 <strong>{cases.filter((item) => item.status === "완료").length}</strong></span>
        <span>중단 <strong>{cases.filter((item) => item.status === "중단").length}</strong></span>
      </div>
      <section className="case-list" aria-label="등록한 사건 목록">
        {cases.map((item) => (
          <article className="case-list-item" key={item.id}>
            <div className="case-list-primary">
              <span className="case-icon"><FontAwesomeIcon icon={faScaleBalanced} /></span>
              <div>
                <small>{item.caseNo}</small>
                <h2>{item.type} 청구 사건</h2>
                <p>{item.amount}</p>
              </div>
            </div>
            <div className="case-list-next"><small>다음 할 일</small><strong>{item.next}</strong></div>
            <div className="case-list-meta"><StatusBadge tone={item.tone}>{item.status}</StatusBadge><small>최근 업데이트 {item.updatedAt}</small></div>
            <Link className="button button-outline button-small" href={`/app/cases/${item.id}`}>사건 보기 <FontAwesomeIcon icon={faChevronRight} /></Link>
          </article>
        ))}
      </section>
    </main>
  )
}

export function CaseWizardScreen() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [caseType, setCaseType] = useState("other")
  const [amount, setAmount] = useState("unknown")
  const [region, setRegion] = useState("unknown")
  const [attempts, setAttempts] = useState<string[]>(["none"])
  const [status, setStatus] = useState("in_progress")
  const [signals, setSignals] = useState<Record<string, string>>({
    judgment_elapsed_band: "모름",
    debtor_type: "개인",
    debtor_contact_status: "Unknown",
    asset_signal: "Unknown",
    income_signal: "Unknown",
    enforcement_title_confirmed: "Unknown",
    service_status: "Unknown",
    known_bank: "Unknown",
    known_employer: "Unknown",
    known_real_estate: "Unknown",
    known_vehicle: "Unknown",
    expected_cost_band: "Unknown",
    priority_right_risk: "Unknown",
  })
  function setSignal(key: string, value: string) {
    setSignals((current) => ({ ...current, [key]: value }))
  }

  const progress = Math.round((step / wizardSteps.length) * 100)
  const displaySignal = (value: string) => value === "Unknown" ? "미확인" : value

  const reviewItems: Array<[string, string]> = [
    ["입력 방식", "직접 입력"],
    ["사건 유형", caseTypeLabels[caseType]],
    ["채권 금액", amountLabels[amount]],
    ["지역 범위", regionLabels[region]],
    ["집행 시도", attempts.map((attempt) => attemptLabels[attempt]).join(", ") || "선택 안 함"],
    ["현재 상태", statusLabels[status]],
    ["판결 후 경과 기간", signals.judgment_elapsed_band],
    ["채무자 유형", signals.debtor_type],
    ["채무자 연락 상태", displaySignal(signals.debtor_contact_status)],
    ["재산 단서", displaySignal(signals.asset_signal)],
    ["소득 단서", displaySignal(signals.income_signal)],
    ["집행권원 확인", displaySignal(signals.enforcement_title_confirmed)],
    ["송달 상태", displaySignal(signals.service_status)],
    ["은행 정보", displaySignal(signals.known_bank)],
    ["근무처 정보", displaySignal(signals.known_employer)],
    ["부동산 정보", displaySignal(signals.known_real_estate)],
    ["차량 정보", displaySignal(signals.known_vehicle)],
    ["예상 비용 구간", ({ "under-10": "10만 원 미만", "10-30": "10만~30만 원", "30-50": "30만~50만 원", "over-50": "50만 원 이상" } as Record<string, string>)[signals.expected_cost_band] || "모름"],
    ["선순위 권리", signals.priority_right_risk === "Y" ? "있음" : signals.priority_right_risk === "N" ? "없음 (사용자 확인)" : "모름"],
  ]

  function next() {
    setStep((current) => Math.min(wizardSteps.length, current + 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function previous() {
    setStep((current) => Math.max(1, current - 1))
  }

  function toggleAttempt(value: string, checked: boolean) {
    setAttempts((current) => {
      if (value === "none" && checked) return ["none"]
      const withoutNone = current.filter((item) => item !== "none")
      return checked ? [...new Set([...withoutNone, value])] : withoutNone.filter((item) => item !== value)
    })
  }

  function submitCase() {
    const record = {
      case_id: "LOCAL-" + Date.now(),
      claim_type: caseTypeLabels[caseType],
      claim_amount_band: amountLabels[amount],
      region: regionLabels[region],
      ...signals,
      attempted_actions: attempts,
      outcome_status: status,
      process_status: status === "abandoned" ? "중단" : status === "success_full" ? "완료" : status === "success_partial" ? "일부 회수" : status === "fail_confirmed" ? "회수 실패" : "진행 중",
      result_source: "user",
      is_dummy: "N",
    }
    try {
      const previous = readDrafts()
      window.localStorage.setItem("mvp-case-drafts", JSON.stringify([...previous, record]))
      toast.success("가상 사건을 이 브라우저에 저장했습니다.")
      router.push(`/app/cases/${record.case_id}/report`)
    } catch {
      toast.error("임시 저장에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.")
    }
  }

  return (
    <main id="main-content" className="content-width page-main case-wizard">
      <Breadcrumbs items={[{ label: "대시보드", href: "/app" }, { label: "새 사건 등록" }]} />
      <PageHeader eyebrow={`새 사건 등록 · ${step}/${wizardSteps.length}`} title={wizardSteps[step - 1]} description="가상 사건만 입력해 주세요. 모르는 내용은 모름으로 두고 진행할 수 있습니다. 판결문 자동 업로드는 추후 지원합니다." />
      <div className="wizard-progress motion-enter">
        <Progress value={progress} aria-label={`사건 등록 진행률 ${progress}%`} />
        <ol>{wizardSteps.map((label, index) => <li className={index + 1 === step ? "is-current" : index + 1 < step ? "is-complete" : ""} key={label}><span>{index + 1 < step ? <FontAwesomeIcon icon={faCheck} /> : index + 1}</span><small>{label}</small></li>)}</ol>
      </div>

      <section className="wizard-card motion-enter">
        {step === 1 && (
          <div className="wizard-section">
            <h2>초기 지원 범위에 해당하나요?</h2>
            <p>현재 MVP는 다음 세 조건을 모두 충족하는 사건을 우선 지원합니다.</p>
            <ul className="eligibility-list">
              <li><FontAwesomeIcon icon={faCheck} /><div><strong>민사 승소 판결 보유</strong><span>지급명령 등 다른 집행권원은 후속 지원 예정</span></div></li>
              <li><FontAwesomeIcon icon={faCheck} /><div><strong>개인 채권자</strong><span>기업·기관의 대량 사건은 지원하지 않음</span></div></li>
              <li><FontAwesomeIcon icon={faCheck} /><div><strong>채권액 500만 원 미만</strong><span>초기 무료 검증 구간</span></div></li>
            </ul>
            <Notice tone="warning" title="서비스 한계를 확인해 주세요">법률 상담이나 회수 보장이 아니라, 집행 전 판단 요소와 다음 확인사항을 정리하는 서비스입니다.</Notice>
          </div>
        )}
        {step === 2 && (
          <div className="wizard-section">
            <h2>비식별 사건 정보를 입력해 주세요</h2>
            <div className="form-grid">
              <label className="field"><span>사건 유형</span><select value={caseType} onChange={(event) => setCaseType(event.target.value)}><option value="loan">대여금</option><option value="sale">매매대금</option><option value="construction">공사대금</option><option value="other">기타</option></select></label>
              <label className="field"><span>채권 금액 구간</span><select value={amount} onChange={(event) => setAmount(event.target.value)}><option value="unknown">모름</option><option value="under-100">100만 원 미만</option><option value="100-300">100만~300만 원</option><option value="300-500">300만~500만 원</option></select></label>
              <label className="field"><span>판결 후 경과 기간</span><select value={signals.judgment_elapsed_band} onChange={(event) => setSignal("judgment_elapsed_band", event.target.value)}><option>모름</option><option>1년 미만</option><option>1~3년</option><option>3~5년</option><option>5년 이상</option></select></label>
              <label className="field"><span>채무자 유형</span><select value={signals.debtor_type} onChange={(event) => setSignal("debtor_type", event.target.value)}><option>개인</option><option>개인사업자</option><option>법인</option><option>모름</option></select></label>
              <label className="field"><span>지역 범위</span><select value={region} onChange={(event) => setRegion(event.target.value)}><option value="capital">수도권</option><option value="metro">광역시</option><option value="other">그 외 지역</option><option value="unknown">모름</option></select></label>

            </div>
            <Notice tone="secure" title="정확한 값은 입력하지 않습니다">채무자의 이름, 주민번호, 상세주소, 정확한 청구금액은 저장 대상이 아닙니다.</Notice>
          </div>
        )}
        {step === 3 && (
          <div className="wizard-section">
            <h2>어떤 집행을 시도하셨나요?</h2>
            <div className="execution-options">
              {[["bank", faBank, "통장 압류"], ["wage", faWallet, "급여 압류"], ["car", faCar, "차량"], ["estate", faBuilding, "부동산"], ["none", faClockRotateLeft, "아직 안 함"]].map(([value, icon, label]) => (
                <label className={attempts.includes(String(value)) ? "execution-option is-selected" : "execution-option"} key={String(value)}>
                  <Checkbox checked={attempts.includes(String(value))} onCheckedChange={(checked) => toggleAttempt(String(value), Boolean(checked))} />
                  <FontAwesomeIcon icon={icon as typeof faBank} />
                  <span>{String(label)}</span>
                </label>
              ))}
            </div>
            <h3>채무자 정보와 집행 단서</h3>
            <p>집행을 시도한 적이 있는지와 재산 단서를 알고 있는지는 별개입니다. 모르는 내용은 모름으로 선택하세요.</p>
            <div className="form-grid">
              <label className="field"><span>채무자 연락 상태</span><select value={signals.debtor_contact_status} onChange={(event) => setSignal("debtor_contact_status", event.target.value)}><option value="Unknown">모름</option><option value="연락 가능">연락 가능</option><option value="연락 불안정">연락 불안정</option><option value="소재 불명">소재 불명</option></select></label>
              <label className="field"><span>재산 단서</span><select value={signals.asset_signal} onChange={(event) => setSignal("asset_signal", event.target.value)}><option value="Unknown">모름</option><option value="있음">있음</option><option value="약함">약함</option><option value="없음">없음</option></select></label>
              <label className="field"><span>소득 단서</span><select value={signals.income_signal} onChange={(event) => setSignal("income_signal", event.target.value)}><option value="Unknown">모름</option><option value="있음">있음</option><option value="약함">약함</option><option value="없음">없음</option></select></label>
              <label className="field"><span>집행권원·확정 여부</span><select value={signals.enforcement_title_confirmed} onChange={(event) => setSignal("enforcement_title_confirmed", event.target.value)}><option value="Unknown">확인 필요</option><option value="Y">확인함 (사용자 진술)</option><option value="N">아직 확인하지 못함</option></select></label>
              <label className="field"><span>송달 상태</span><select value={signals.service_status} onChange={(event) => setSignal("service_status", event.target.value)}><option value="Unknown">모름</option><option value="정상">정상</option><option value="불명">확인 필요</option></select></label>
              <label className="field"><span>은행 단서</span><select value={signals.known_bank} onChange={(event) => setSignal("known_bank", event.target.value)}><option value="Unknown">모름</option><option value="Y">알고 있음</option><option value="N">없음 / 알지 못함</option></select></label>
              <label className="field"><span>근무처 단서</span><select value={signals.known_employer} onChange={(event) => setSignal("known_employer", event.target.value)}><option value="Unknown">모름</option><option value="Y">알고 있음</option><option value="N">없음 / 알지 못함</option></select></label>
              <label className="field"><span>부동산 단서</span><select value={signals.known_real_estate} onChange={(event) => setSignal("known_real_estate", event.target.value)}><option value="Unknown">모름</option><option value="Y">알고 있음</option><option value="N">없음 / 알지 못함</option></select></label>
              <label className="field"><span>차량 단서</span><select value={signals.known_vehicle} onChange={(event) => setSignal("known_vehicle", event.target.value)}><option value="Unknown">모름</option><option value="Y">알고 있음</option><option value="N">없음 / 알지 못함</option></select></label>
            </div>
            <div className="form-grid"><label className="field"><span>예상 비용 구간</span><select value={signals.expected_cost_band} onChange={(event) => setSignal("expected_cost_band", event.target.value)}><option value="Unknown">모름</option><option value="under-10">10만 원 미만</option><option value="10-30">10만~30만 원</option><option value="30-50">30만~50만 원</option><option value="over-50">50만 원 이상</option></select></label><label className="field"><span>선순위 권리 확인 결과</span><select value={signals.priority_right_risk} onChange={(event) => setSignal("priority_right_risk", event.target.value)}><option value="Unknown">모름 / 확인 중</option><option value="Y">있음</option><option value="N">없음 (사용자 확인)</option></select></label></div>
            <section className="wizard-subsection" aria-labelledby="case-progress-heading">
              <h3 id="case-progress-heading">현재 상태는 어떤가요?</h3>
              <p>재산 단서와 별개로, 지금까지의 집행 진행·회수 상황을 선택해 주세요.</p>
              <RadioGroup className="radio-list" value={status} onValueChange={setStatus}>
              {[["in_progress", "진행 중", "결과를 기다리고 있어요"], ["success_partial", "일부 회수", "채권 일부를 회수했어요"], ["fail_confirmed", "전혀 회수 못함", "현재까지 회수액이 없어요"], ["abandoned", "중단함", "비용·시간 등의 이유로 중단했어요"]].map(([value, label, hint]) => (
                <label key={value}><RadioGroupItem value={value} /><span><strong>{label}</strong><small>{hint}</small></span></label>
              ))}
              </RadioGroup>
            </section>
          </div>
        )}
        {step === 4 && (
          <div className="wizard-section submit-summary">
            <h2>입력 정보를 확인하고 제출해 주세요</h2>
            <p>아래 내용을 확인한 뒤 사건을 등록할 수 있습니다. 수정할 내용이 있다면 이전 단계로 돌아가세요.</p>
            <dl className="review-list submit-review-list">
              {reviewItems.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <Notice tone="info" title="추가 정보가 필요한 경우">입력 정보에 따라 확인 우선순위와 검토할 집행 수단이 달라집니다. 회수 확률은 산출하지 않습니다.</Notice>
            <Notice tone="warning" title="분석 결과는 법률 자문이 아닙니다">최종 집행 여부와 실행 책임은 사용자에게 있으며, 필요한 경우 법률 전문가와 상담하세요.</Notice>
          </div>
        )}
      </section>
      <div className="wizard-actions">
        {step > 1 ? <button className="button button-outline" onClick={previous}>이전</button> : <Link className="button button-outline" href="/app">취소</Link>}
        {step < wizardSteps.length ? <button className="button button-primary button-large" onClick={next}>다음 <FontAwesomeIcon icon={faArrowRight} /></button> : <button className="button button-primary button-large" onClick={submitCase}>사건 등록하고 리포트 보기 <FontAwesomeIcon icon={faArrowRight} /></button>}
      </div>
    </main>
  )
}

const caseTabs = [
  ["summary", "요약", `/app/cases/demo-2026`],
  ["report", "리포트", `/app/cases/demo-2026/report`],
  ["plan", "집행 계획", `/app/cases/demo-2026/plan`],
  ["status", "진행 기록", `/app/cases/demo-2026/status`],
  ["result", "결과", `/app/cases/demo-2026/result`],
  ["data", "데이터 관리", `/app/cases/demo-2026/data`],
]

const caseDeletionKey = (caseId: string) => `jibhaeng-case-deletion-${caseId}`
const caseDeletionEvent = "jibhaeng-case-deletion-changed"
function getCaseDeletionPending(caseId: string) {
  try { return window.localStorage.getItem(caseDeletionKey(caseId)) === "requested" } catch { return false }
}

export function CaseDetailScreen({ section = "summary" }: { section?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const caseId = pathname.split("/")[3] || "demo-2026"
  const [record, setRecord] = useState<DraftCase | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  useEffect(() => {
    const sync = () => {
    try { setRecord(readDrafts().find((item) => item.case_id === caseId) || null); setLoadError(false) } catch { setLoadError(true) }
    setLoaded(true)
    }; sync(); window.addEventListener("mvp-case-updated", sync); window.addEventListener("storage", sync); return () => { window.removeEventListener("mvp-case-updated", sync); window.removeEventListener("storage", sync) }
  }, [caseId])
  const currentCase = record ? { ...demoCase, id: record.case_id, type: record.claim_type, amount: record.claim_amount_band, status: record.process_status, updatedAt: "브라우저 저장" } : demoCase
  const active = caseTabs.find(([id]) => pathname === `/app/cases/${caseId}${id === "summary" ? "" : `/${id}`}`)?.[0] ?? section
  const [deletionPending, setDeletionPending] = useState<boolean | null>(null)
  useEffect(() => {
    const sync = () => setDeletionPending(getCaseDeletionPending(caseId))
    sync()
    window.addEventListener("storage", sync)
    window.addEventListener(caseDeletionEvent, sync)
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(caseDeletionEvent, sync) }
  }, [caseId])

  if (!loaded) return <main id="main-content" className="content-width page-main" aria-busy="true">사건을 불러오는 중입니다.</main>
  if (loadError || (!record && !["demo-2026"].includes(caseId))) return <main id="main-content" className="content-width page-main"><h1>{loadError ? "사건을 불러오지 못했습니다" : "등록되지 않은 사건입니다"}</h1><p>현재 브라우저의 사건 목록에서 다시 선택해 주세요.</p><Link className="button button-primary" href="/app/cases">사건 목록</Link></main>
  if (deletionPending === null) return <main id="main-content" className="content-width page-main case-detail-main" aria-busy="true" />
  if (deletionPending) return (
    <main id="main-content" className="content-width page-main case-detail-main">
      <Breadcrumbs items={[{ label: "대시보드", href: "/app" }, { label: "내 사건", href: "/app/cases" }, { label: demoCase.id }]} />
      <section className="panel case-deletion-pending" role="status">
        <StatusBadge tone="warning">삭제 검토 중</StatusBadge>
        <h1>사건 삭제 요청을 검토 중입니다</h1>
        <p>해당 사건의 삭제 요청이 접수되어 검토 중입니다. 검토가 끝나거나 요청이 취소될 때까지 이 사건의 모든 상세 화면과 기록 기능을 이용할 수 없습니다.</p>
        <p className="case-deletion-pending-note">현재는 브라우저에 저장되는 시연 상태이며 실제 운영자에게 요청이 전송되지는 않습니다.</p>
        <div className="case-deletion-pending-actions">
          <Link className="button button-outline" href="/app/cases">내 사건 목록</Link>
          <button type="button" className="button button-primary" onClick={() => {
            if (!window.confirm("사건 삭제 요청을 취소하고 다시 이용할까요?")) return
            try {
              window.localStorage.removeItem(caseDeletionKey(caseId))
              window.dispatchEvent(new Event(caseDeletionEvent))
              toast.success("삭제 요청을 취소했습니다.")
            } catch { toast.error("삭제 요청 취소에 실패했습니다.") }
          }}>삭제 요청 취소</button>
        </div>
      </section>
    </main>
  )

  return (
    <main id="main-content" className="content-width page-main case-detail-main">
      <Breadcrumbs items={[{ label: "대시보드", href: "/app" }, { label: "내 사건", href: "/app/cases" }, { label: demoCase.id }]} />
      <section className="case-identity">
        <div><div className="eyebrow">{currentCase.id}</div><h1>{currentCase.type} 청구 사건</h1><p>{currentCase.amount} · 최근 업데이트 {currentCase.updatedAt}</p></div>
        <div><StatusBadge tone="info">{currentCase.status}</StatusBadge><Link className="button button-primary button-small" href={`/app/cases/${caseId}/result`}>결과 수정</Link></div>
      </section>
      <Tabs value={active} onValueChange={(value) => router.push(`/app/cases/${caseId}${value === "summary" ? "" : `/${value}`}`)}>
        <TabsList variant="line" className="case-tabs">
          {caseTabs.map(([id, label]) => <TabsTrigger key={id} value={id}>{label}</TabsTrigger>)}
        </TabsList>
        <TabsContent value={active} className="case-tab-content motion-enter">
          {active === "summary" && <CaseOverview key={caseId} record={record} caseId={caseId} />}
          {active === "report" && <DemoReport record={record} caseId={caseId} />}
          {active === "plan" && <PlanView key={caseId} caseId={caseId} record={record} />}
          {active === "status" && <StatusView key={caseId} />}
          {active === "result" && <ResultView key={caseId} />}
          {active === "data" && <DataView caseId={caseId} record={record} />}
        </TabsContent>
      </Tabs>
    </main>
  )
}

const reportSample: DraftCase = {
  case_id: "demo-2026", claim_type: "대여금", claim_amount_band: demoCase.amount,
  region: "수도권", outcome_status: "in_progress", process_status: "진행 중",
  enforcement_title_confirmed: "Unknown", service_status: "Unknown",
  known_bank: "Unknown", known_employer: "Unknown", known_real_estate: "Unknown", known_vehicle: "Unknown",
}

function CaseOverview({ record, caseId }: { record: DraftCase | null; caseId: string }) {
  const current = record || reportSample
  const { assessment, loaded } = useAssessment(record, caseId)
  const { saved: progress } = useCaseRecordForm("status")
  const { saved: result } = useCaseRecordForm("result")
  const recent = [
    ...(progress.updatedAt ? [{ title: "진행 상태 저장", date: progress.updatedAt, text: progress.memo || "진행 상태를 기록했습니다.", section: "status" }] : []),
    ...(result.updatedAt ? [{ title: "회수 결과 저장", date: result.updatedAt, text: "입력한 결과를 확인하거나 수정할 수 있습니다.", section: "result" }] : []),
  ].sort((a, b) => b.date.localeCompare(a.date, "ko"))
  return <>
    {!record && <Notice tone="info" title="예시 사건">화면 체험용으로 준비된 사건입니다. 직접 등록한 사건은 사건 목록에서 선택하세요.</Notice>}
    <div className="case-overview-grid">
      <section className="panel"><div className="panel-heading"><h2>사건 기본 정보</h2><StatusBadge>{record ? "직접 입력" : "예시"}</StatusBadge></div><dl className="review-list"><div><dt>사건 유형</dt><dd>{current.claim_type}</dd></div><div><dt>채권 금액</dt><dd>{current.claim_amount_band}</dd></div><div><dt>지역</dt><dd>{current.region}</dd></div></dl></section>
      <section className="panel"><h2>현재 진행 상태</h2><StatusBadge tone="info">{current.process_status}</StatusBadge><p>진행 상황과 회수 결과를 각각 기록하고 다시 확인할 수 있습니다.</p><div className="case-actions"><Link className="button button-outline button-small" href={`/app/cases/${caseId}/status`}>진행 기록</Link><Link className="button button-outline button-small" href={`/app/cases/${caseId}/result`}>결과 수정</Link></div></section>
    </div>
    <section className="next-action-card compact"><div><p className="eyebrow">지금 할 일</p><h2>{loaded ? assessment.title : "확인사항을 불러오는 중입니다"}</h2><p>{loaded ? assessment.explanation : "입력 정보와 집행 기록을 확인합니다."}</p></div><Link className="button button-primary button-small" href={`/app/cases/${caseId}/report`}>리포트 보기</Link></section>
    <section className="panel"><div className="panel-heading"><h2>최근 기록</h2><Link href={`/app/cases/${caseId}/status`}>진행 기록 보기</Link></div>{recent.length ? <ol className="activity-list">{recent.map((item) => <li key={item.section}><span /><div><strong>{item.title}</strong><p>{item.text}</p><small>{item.date}</small></div></li>)}</ol> : <p>아직 저장한 진행·결과 기록이 없습니다. 집행 계획을 확인한 뒤 진행 상황을 남겨 주세요.</p>}</section>
  </>
}

const planChangedEvent = "mvp-plan-changed"
function useAssessment(record: DraftCase | null, caseId: string) {
  const [entries, setEntries] = useState<RuleEntries>({})
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    const sync = () => {
      try {
        const value: unknown = JSON.parse(localStorage.getItem(`mvp-plan-${caseId}`) || "{}")
        if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid plan")
        for (const group of Object.values(value)) if (!Array.isArray(group)) throw new Error("Invalid records")
        setEntries(value as RuleEntries); setError(false)
      } catch { setError(true) }
      setLoaded(true)
    }
    sync(); window.addEventListener(planChangedEvent, sync); window.addEventListener("storage", sync)
    return () => { window.removeEventListener(planChangedEvent, sync); window.removeEventListener("storage", sync) }
  }, [caseId])
  return { assessment: assessCase(record || reportSample, entries), loaded, error }
}

function DemoReport({ record, caseId }: { record: DraftCase | null; caseId: string }) {
  const { assessment, loaded, error } = useAssessment(record, caseId)
  function saveInput(patch: Record<string, string>) {
    try {
      const records = readDrafts()
      if (!records.some((item) => item.case_id === caseId)) throw new Error("Missing case")
      localStorage.setItem("mvp-case-drafts", JSON.stringify(records.map((item) => item.case_id === caseId ? { ...item, ...patch } : item)))
      window.dispatchEvent(new Event("mvp-case-updated"))
      toast.success("입력 정보와 판단 결과를 갱신했습니다.")
    } catch { toast.error("정보를 저장하지 못했습니다. 기존 입력은 유지됩니다.") }
  }
  if (!loaded) return <p role="status">입력과 집행 기록을 확인하고 있습니다.</p>
  if (error) return <Notice tone="warning" title="집행 기록 확인 필요">저장된 집행 기록을 불러오지 못해 판단을 갱신할 수 없습니다. 브라우저 저장 데이터를 확인해 주세요.</Notice>
  return <>
    <Notice tone="info" title="입력 기반 검토 안내">사용자 입력과 최근 집행 기록에 따른 검토 순서입니다. 회수 확률이나 법률상 집행 가능 여부를 판정하지 않습니다.</Notice>
    <section className="panel" aria-live="polite"><div className="panel-heading"><h2>{assessment.title}</h2><StatusBadge tone={assessment.status === "ready" || assessment.status === "closed" ? "info" : "warning"}>규칙 {assessment.version}</StatusBadge></div><p>{assessment.explanation}</p></section>
    <section className="panel"><h2>이렇게 안내한 이유</h2><ul className="rule-reasons">{assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><p className="report-check-note">사용한 정보: {assessment.sources.join(" · ")}</p></section>
    {assessment.status !== "closed" && <section className="panel"><h2>입력 단서로 검토할 수단</h2>{assessment.candidates.length ? <ul className="rule-reasons">{assessment.candidates.map((item) => <li key={item}>{item}</li>)}</ul> : <p>구체적인 단서가 없어 특정 수단을 제시하지 않습니다.</p>}<p className="report-check-note">단서에 따른 후보이며, 수단별 착수 권고나 회수 보장은 아닙니다.</p></section>}
    <section className="panel"><h2>다음 판단을 위해 확인할 사항</h2>{assessment.checks.length ? <ol className="report-check-list">{assessment.checks.map((item) => <li key={item.id}><div><h3>{item.title}</h3><p>{item.reason}</p></div><Link className="button button-outline button-small" href={`/app/cases/${caseId}/plan#plan-${item.id}`}>{item.action}</Link></li>)}</ol> : <p>{assessment.status === "closed" ? "전액 회수 기록을 결과 화면에서 확인하세요." : "기본 정보의 미확인 항목은 없습니다. 아래 집행 계획에서 실제 확인 근거와 검토 결과를 정리하세요."}</p>}</section>
    {record ? <CaseInputEditor record={record} onSave={saveInput} /> : <Notice tone="info" title="예시 사건">입력값을 바꾸며 비교하려면 새 가상 사건을 등록해 주세요.</Notice>}
    <section className="report-action"><div><h2>{assessment.status === "closed" ? "회수 결과 확인" : "확인 순서에 맞춰 기록하세요"}</h2><p>{assessment.status === "closed" ? "전액 회수 여부와 결과 기록을 확인할 수 있습니다." : "리포트와 집행 계획은 같은 규칙을 사용하며, 기록을 수정하거나 삭제하면 다시 계산합니다."}</p></div><Link className="button button-primary button-small" href={`/app/cases/${caseId}/${assessment.status === "closed" ? "result" : "plan"}`}>{assessment.status === "closed" ? "결과 확인" : "집행 계획 열기"}</Link></section>
  </>
}

type PlanRecordType = "progress" | "cost" | "recovery"
type PlanEntry = {
  id: string; note: string; reference: string; updatedAt: string; savedAt?: number
  type?: PlanRecordType; amount?: number; occurredOn?: string; category?: string; details?: Record<string,string>
  attachmentName?: string; attachmentType?: string
}
const planRecordLabels: Record<PlanRecordType, string> = { progress: "진행", cost: "비용", recovery: "회수" }
const planFileDbName = "jibhaeng-plan-evidence"
function planFileStore(mode: IDBTransactionMode): Promise<{ db: IDBDatabase; transaction: IDBTransaction; store: IDBObjectStore }> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(planFileDbName, 1)
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains("files")) request.result.createObjectStore("files") }
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction("files", mode)
      resolve({ db, transaction, store: transaction.objectStore("files") })
    }
  })
}
async function writePlanFile(id: string, file: File): Promise<void> {
  const { db, transaction, store } = await planFileStore("readwrite")
  return new Promise((resolve, reject) => {
    store.put(file, id)
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error) }
    transaction.onabort = () => { db.close(); reject(transaction.error) }
  })
}
async function readPlanFile(id: string): Promise<Blob | undefined> {
  const { db, store } = await planFileStore("readonly")
  return new Promise((resolve, reject) => {
    const request = store.get(id)
    request.onsuccess = () => { db.close(); resolve(request.result as Blob | undefined) }
    request.onerror = () => { db.close(); reject(request.error) }
  })
}
async function deletePlanFile(id: string): Promise<void> {
  const { db, transaction, store } = await planFileStore("readwrite")
  return new Promise((resolve, reject) => {
    store.delete(id)
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error) }
    transaction.onabort = () => { db.close(); reject(transaction.error) }
  })
}
type PlanItem = { id: string; title: string; description: string; action: string; initialStatus: "확인 필요" | "대기"; guide: string }
const planItems: PlanItem[] = [
  { id: "judgment", title: "집행권원과 확정 여부 확인", description: "판결문·확정증명 등 집행권원 관련 자료를 확인합니다.", action: "증빙 관리", initialStatus: "확인 필요", guide: "판결문과 확정 여부를 확인할 수 있는 자료를 준비해 주세요. 문서 진위 및 확정 여부는 별도 검증이 필요합니다." },
  { id: "cost", title: "신청 비용·송달료 확인", description: "신청할 집행 절차에 따라 실제 비용을 확인해야 합니다.", action: "비용 등록", initialStatus: "확인 필요", guide: "법원·집행 절차별 신청 수수료와 송달료를 확인하고 금액 구간 또는 참고 근거를 기록하세요." },
  { id: "priority", title: "선순위 권리 여부 확인", description: "배당 가능성을 판단하기 위해 권리관계 증빙이 필요합니다.", action: "증빙 등록", initialStatus: "확인 필요", guide: "선순위 채권·담보권 여부를 확인한 경로와 결과를 기록하세요. 상대방의 직접식별정보는 입력하지 마세요." },
  { id: "target", title: "우선 검토할 집행 수단 선택", description: "필요한 확인이 끝나면 적합한 집행 수단을 검토합니다.", action: "집행 수단 관리", initialStatus: "대기", guide: "통장·급여·차량·부동산 등 검토 중인 수단과 그 이유를 기록하세요. 실제 착수 결정은 별도 판단이 필요합니다." },
]

function PlanView({ caseId, record }: { caseId: string; record: DraftCase | null }) {
  const planStorageKey = `mvp-plan-${caseId}`
  const [entries, setEntries] = useState<Record<string, PlanEntry[]>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [reference, setReference] = useState("")
  const editingEntry = (entries[activeId || ""] || []).find((item) => item.id === editingId)
  const editingDetails = editingEntry?.details || {}
  const [editFile, setEditFile] = useState<File | null>(null)
  const [removeFile, setRemoveFile] = useState(false)

  // Browser-only demo persistence; no evidence files or personal identifiers are stored.
  useEffect(() => {
    const sync = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(planStorageKey) || "{}") as Record<string, PlanEntry[]>
      if (stored && typeof stored === "object" && !Array.isArray(stored)) setEntries(stored)
    } catch {
      toast.error("저장된 집행 계획 정보를 불러오지 못했습니다.")
    }
    }; sync(); window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync)
  }, [planStorageKey])

  function persist(next: Record<string, PlanEntry[]>) {
    try {
      window.localStorage.setItem(planStorageKey, JSON.stringify(next))
      setEntries(next)
      window.dispatchEvent(new Event(planChangedEvent))
      return true
    } catch {
      toast.error("저장에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.")
      return false
    }
  }

  function openItem(id: string) {
    setActiveId(id)
    setEditingId(null)
    setNote("")
    setReference("")
  }

  function startEdit(entry: PlanEntry) {
    setEditingId(entry.id)
    setNote(entry.note)
    setReference(entry.reference)
  }

  function cancelEdit() {
    setEditingId(null)
    setNote("")
    setReference("")
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault()
    if (!activeId || !editingId || !note.trim()) { toast.error("기록 내용을 입력해 주세요."); return }
    const original = (entries[activeId] || []).find((item) => item.id === editingId)
    if (!original) return
    const data = new FormData(event.currentTarget as HTMLFormElement)
    const details: Record<string,string> = {}
    for (const [key,value] of data.entries()) if (key.startsWith("detail_")) details[key.slice(7)] = String(value)
    const amount = activeId === "cost" ? Number(data.get("amount")) : undefined
    if (activeId === "cost" && (!Number.isSafeInteger(amount) || amount! <= 0)) { toast.error("유효한 금액을 입력해 주세요."); return }
    if (editFile && (!["application/pdf","image/jpeg","image/png"].includes(editFile.type) || editFile.size > 10485760)) { toast.error("PDF·JPG·PNG, 최대 10MB만 첨부할 수 있습니다."); return }
    const nextEntry: PlanEntry = { ...original, savedAt: Date.now(), note: note.trim(), reference: reference.trim(), details, amount, occurredOn: String(data.get("occurredOn") || ""), updatedAt: new Date().toLocaleDateString("ko-KR"), attachmentName: editFile?.name || (removeFile ? undefined : original.attachmentName), attachmentType: editFile?.type || (removeFile ? undefined : original.attachmentType) }
    try {
      if (editFile) await writePlanFile(editingId, editFile)
      if (persist({ ...entries, [activeId]: entries[activeId].map((item) => item.id === editingId ? nextEntry : item) })) {
        if (removeFile && !editFile) await deletePlanFile(editingId)
        toast.success("기록을 수정했습니다."); cancelEdit(); setEditFile(null); setRemoveFile(false)
      }
    } catch { toast.error("첨부파일 수정에 실패했습니다.") }
  }

  async function saveTypedEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeId) return
    const form = event.currentTarget
    const data = new FormData(form)
    const noteValue = String(data.get("description") || "").trim()
    const amount = activeId === "cost" ? Number(data.get("amount")) : undefined
    if (!noteValue || (activeId === "cost" && (!Number.isSafeInteger(amount) || amount! <= 0))) { toast.error("내용과 유효한 금액을 입력해 주세요."); return }
    const details: Record<string,string> = {}
    for (const [key,value] of data.entries()) if (key.startsWith("detail_")) details[key.slice(7)] = String(value)
    const fileValue = data.get("evidence")
    const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : undefined
    if (file && (!["application/pdf","image/jpeg","image/png"].includes(file.type) || file.size > 10485760)) { toast.error("PDF·JPG·PNG, 최대 10MB만 첨부할 수 있습니다."); return }
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())
    const entry: PlanEntry = { id, savedAt: Date.now(), note: noteValue, reference: String(data.get("reference") || "").trim(), details, amount, occurredOn: String(data.get("occurredOn") || ""), updatedAt: new Date().toLocaleDateString("ko-KR"), attachmentName: file?.name, attachmentType: file?.type }
    try {
      if (file) await writePlanFile(id, file)
      if (persist({ ...entries, [activeId]: [...(entries[activeId] || []), entry] })) { toast.success("기록을 등록했습니다."); form.reset() }
      else if (file) await deletePlanFile(id)
    } catch { toast.error("증빙 저장에 실패했습니다.") }
  }

  async function downloadPlanEvidence(entry: PlanEntry) {
    try {
      const blob = await readPlanFile(entry.id)
      if (!blob) { toast.error("이 브라우저에서 첨부파일을 찾을 수 없습니다."); return }
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = entry.attachmentName || "evidence"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      toast.error("첨부파일을 열 수 없습니다.")
    }
  }

  function deleteEntry(id: string) {
    if (!activeId || !window.confirm("이 기록을 삭제할까요? 삭제 후 복구할 수 없습니다.")) return
    const nextEntries = (entries[activeId] || []).filter((entry) => entry.id !== id)
    if (persist({ ...entries, [activeId]: nextEntries })) {
      void deletePlanFile(id).catch(() => toast.error("첨부파일 삭제에 실패했습니다."))
      if (editingId === id) { setEditingId(null); setNote(""); setReference("") }
      toast.success("기록을 삭제했습니다.")
    }
  }

  function resetDemo() {
    if (!window.confirm("이 브라우저에 저장된 집행 계획 시연 기록을 모두 초기화할까요?")) return
    try {
      window.localStorage.removeItem(planStorageKey)
      window.dispatchEvent(new Event(planChangedEvent))
      for (const item of Object.values(entries).flat()) void deletePlanFile(item.id).catch(() => toast.error("일부 첨부파일 삭제에 실패했습니다."))
      setEntries({})
      setActiveId(null)
      setEditingId(null)
      setNote("")
      setReference("")
      toast.success("시연 기록을 초기화했습니다.")
    } catch {
      toast.error("초기화에 실패했습니다.")
    }
  }

  const assessment = assessCase(record || reportSample, entries)
  const orderedItems = assessment.planOrder.map((id) => planItems.find((item) => item.id === id)!)
  const activeItem = planItems.find((item) => item.id === activeId)
  const completedCount = 0 // 실제 검증 완료 데이터가 연결되기 전에는 완료로 표시하지 않음
  return (
    <>
      <Notice tone="info" title={assessment.title}>{assessment.explanation} · 규칙 {assessment.version}</Notice>
      {assessment.status !== "closed" && <section className="panel"><h2>입력 단서에 따른 검토 후보</h2>{assessment.candidates.length ? <ul className="rule-reasons">{assessment.candidates.map((candidate) => <li key={candidate}>{candidate}</li>)}</ul> : <p>구체적 대상 단서를 먼저 정리해 주세요.</p>}<p className="report-check-note">후보는 입력 단서 기준이며, 실제 집행 가능 여부를 확정하지 않습니다.</p></section>}
      <div className="plan-heading"><div><p className="eyebrow">집행 수단 검토 · 데모</p><h2>집행 착수 전 확인 항목</h2></div><div className="plan-heading-actions"><strong>{completedCount} / {planItems.length} 확인 완료</strong><button type="button" className="button button-outline" onClick={resetDemo}>시연 기록 초기화</button></div></div>
      <Progress value={(completedCount / planItems.length) * 100} />
      <section className="checklist-panel">
        {orderedItems.map((item, index) => {
          const count = (entries[item.id] || []).length
          const status = count > 0 ? "검토중" : assessment.status === "closed" || assessment.status === "paused" ? "대기" : assessment.checks.some((check) => check.id === item.id) ? "확인 필요" : "대기"
          return (
            <div className="plan-item" id={`plan-${item.id}`} key={item.id}>
              <span className="plan-index">{index + 1}</span>
              <div className="plan-item-content">
                <strong>{item.title}</strong>
                <small>{assessment.checks.find((check) => check.id === item.id)?.reason || item.description}</small>
                {count > 0 && <small>등록된 기록 {count}건 · {status === "검토중" ? "확인 대기" : "기록 있음"}</small>}
                <button className="text-link" type="button" onClick={() => openItem(item.id)}>{count ? "기록 관리" : item.action}</button>
              </div>
              <StatusBadge tone={status === "확인 필요" ? "warning" : status === "검토중" ? "info" : "neutral"}>{status}</StatusBadge>
            </div>
          )
        })}
      </section>
      <Notice tone="info" title="상태는 증빙 확인 결과에 따라 변경됩니다">기록을 등록하면 검토중으로 표시합니다. 사용자가 직접 완료 처리하지 않으며, 완료는 운영 검증 이후 반영할 예정입니다. 입력 기록은 리포트 검토 순서에 반영되며, 검증 완료를 뜻하지 않습니다.</Notice>
      <Dialog open={Boolean(activeItem)} onOpenChange={(open) => { if (!open) { setActiveId(null); setEditingId(null); setNote(""); setReference("") } }}>
        <DialogContent className="plan-manage-dialog">
          <DialogHeader className="plan-manage-header">
            <DialogTitle>{activeItem?.title || "집행 계획 관리"}</DialogTitle>
            <DialogDescription>{activeItem?.guide}</DialogDescription>
          </DialogHeader>
          <div className="plan-manage-content">
            <h3>등록된 기록</h3>
            {(activeId && entries[activeId]?.length) ? (
              <ul className="plan-record-list">
                {entries[activeId].map((entry) => (
                  <li key={entry.id}>
                    {editingId === entry.id ? (
                      <form key={editingId} className="form-stack plan-inline-editor" onSubmit={saveEdit}>
                        {activeId === "judgment" && <><label className="field"><span>집행권원 종류</span><select name="detail_kind" defaultValue={editingDetails.kind || ""} required><option value="" disabled>선택</option><option value="판결문">판결문</option><option value="지급명령">지급명령</option><option value="조정조서">조정조서</option><option value="화해조서">화해조서</option><option value="공정증서">공정증서</option><option value="기타">기타</option></select></label><label className="field"><span>확정 여부</span><select name="detail_finality" defaultValue={editingDetails.finality || ""} required><option value="" disabled>선택</option><option value="확정">확정</option><option value="미확정">미확정</option><option value="확인 중">확인 중</option><option value="확정 불요·별도 확인">확정 불요·별도 확인</option></select></label></>}
{activeId === "cost" && <><label className="field"><span>비용 항목</span><select name="detail_costKind" defaultValue={editingDetails.costKind || ""} required><option value="" disabled>선택</option><option value="인지대">인지대</option><option value="송달료">송달료</option><option value="집행문·증명 발급">집행문·증명 발급</option><option value="재산조회">재산조회</option><option value="법무사 수수료">법무사 수수료</option><option value="기타">기타</option></select></label><label className="field"><span>지출 구분</span><select name="detail_costStatus" defaultValue={editingDetails.costStatus || ""} required><option value="" disabled>선택</option><option value="예상">예상</option><option value="실제 지출">실제 지출</option></select></label><label className="field"><span>금액 (원)</span><input name="amount" type="number" min="1" step="1" defaultValue={editingEntry?.amount} required /></label><label className="field"><span>기준일·지출일</span><input name="occurredOn" type="date" defaultValue={editingEntry?.occurredOn} required /></label></>}
{activeId === "priority" && <><label className="field"><span>확인 대상</span><select name="detail_subject" defaultValue={editingDetails.subject || ""} required><option value="" disabled>선택</option><option value="예금채권">예금채권</option><option value="급여채권">급여채권</option><option value="부동산">부동산</option><option value="차량">차량</option><option value="기타">기타</option></select></label><label className="field"><span>선순위 권리</span><select name="detail_priorityResult" defaultValue={editingDetails.priorityResult || ""} required><option value="" disabled>선택</option><option value="있음">있음</option><option value="없음">없음</option><option value="확인 중">확인 중</option></select></label></>}
{activeId === "target" && <><label className="field"><span>집행 수단</span><select name="detail_method" defaultValue={editingDetails.method || ""} required><option value="" disabled>선택</option><option value="예금채권 압류·추심">예금채권 압류·추심</option><option value="급여채권 압류·추심">급여채권 압류·추심</option><option value="차량 집행">차량 집행</option><option value="부동산 집행">부동산 집행</option><option value="기타">기타</option></select></label><label className="field"><span>검토 결과</span><select name="detail_decision" defaultValue={editingDetails.decision || ""} required><option value="" disabled>선택</option><option value="우선 검토">우선 검토</option><option value="추가 확인 필요">추가 확인 필요</option><option value="보류">보류</option><option value="제외">제외</option></select></label></>}
                        <label className="field"><span>확인 내용 / 검토 결과</span><textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} required /></label>
                        <label className="field"><span>확인 근거 (선택)</span><input value={reference} onChange={(event) => setReference(event.target.value)} maxLength={200} /></label>
                        {editingEntry?.attachmentName && <label className="plan-file-notice"><input type="checkbox" checked={removeFile} onChange={(event) => setRemoveFile(event.target.checked)} /> 기존 첨부파일 삭제</label>}
                        <label className="field"><span>증빙파일 교체 (선택)</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setEditFile(event.target.files?.[0] || null)} /></label>
                        <div className="plan-record-actions"><button type="button" className="button button-outline button-small" onClick={cancelEdit}>취소</button><button type="submit" className="button button-primary">변경 저장</button></div>
                      </form>
                    ) : (
                      <>
                        <div>
                          <strong>{entry.note}</strong>{entry.details && Object.entries(entry.details).map(([key,value]) => <small key={key}>{({kind:"집행권원",finality:"확정 여부",costKind:"비용 항목",costStatus:"지출 구분",subject:"확인 대상",priorityResult:"선순위 권리",method:"집행 수단",decision:"검토 결과"} as Record<string,string>)[key] || key}: {value}</small>)}
                          {entry.category && <small>항목: {entry.category}</small>}
                          {entry.amount !== undefined && <small>비용: {entry.amount.toLocaleString("ko-KR")}원</small>}
                          {entry.occurredOn && <small>발생일: {entry.occurredOn}</small>}
                          {entry.reference && <small>확인 근거: {entry.reference}</small>}
                          {entry.attachmentName && <button type="button" className="plan-evidence-link" onClick={() => downloadPlanEvidence(entry)}>첨부파일: {entry.attachmentName} (다운로드)</button>}
                          <small>{entry.updatedAt} · 사용자 입력 · 검토 필요</small>
                        </div>
                        <div className="plan-record-actions">
                          <button type="button" className="button button-outline button-small" onClick={() => startEdit(entry)}>수정</button>
                          <button type="button" className="button button-outline button-small" onClick={() => deleteEntry(entry.id)}>삭제</button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : <p>아직 등록된 기록이 없습니다.</p>}
            <form key={activeId} className="form-stack plan-typed-entry" onSubmit={saveTypedEntry}>
              <h3>{activeId === "judgment" ? "집행권원 확인 기록" : activeId === "cost" ? "비용 기록" : activeId === "priority" ? "선순위 권리 확인 기록" : "집행 수단 검토 기록"}</h3>
              {activeId === "judgment" && <><label className="field"><span>집행권원 종류</span><select name="detail_kind" defaultValue="" required><option value="" disabled>선택</option><option value="판결문">판결문</option><option value="지급명령">지급명령</option><option value="조정조서">조정조서</option><option value="화해조서">화해조서</option><option value="공정증서">공정증서</option><option value="기타">기타</option></select></label><label className="field"><span>확정 여부</span><select name="detail_finality" defaultValue="" required><option value="" disabled>선택</option><option value="확정">확정</option><option value="미확정">미확정</option><option value="확인 중">확인 중</option><option value="확정 불요·별도 확인">확정 불요·별도 확인</option></select></label></>}
{activeId === "cost" && <><label className="field"><span>비용 항목</span><select name="detail_costKind" defaultValue="" required><option value="" disabled>선택</option><option value="인지대">인지대</option><option value="송달료">송달료</option><option value="집행문·증명 발급">집행문·증명 발급</option><option value="재산조회">재산조회</option><option value="법무사 수수료">법무사 수수료</option><option value="기타">기타</option></select></label><label className="field"><span>지출 구분</span><select name="detail_costStatus" defaultValue="" required><option value="" disabled>선택</option><option value="예상">예상</option><option value="실제 지출">실제 지출</option></select></label><label className="field"><span>금액 (원)</span><input name="amount" type="number" min="1" step="1"  required /></label><label className="field"><span>기준일·지출일</span><input name="occurredOn" type="date"  required /></label></>}
{activeId === "priority" && <><label className="field"><span>확인 대상</span><select name="detail_subject" defaultValue="" required><option value="" disabled>선택</option><option value="예금채권">예금채권</option><option value="급여채권">급여채권</option><option value="부동산">부동산</option><option value="차량">차량</option><option value="기타">기타</option></select></label><label className="field"><span>선순위 권리</span><select name="detail_priorityResult" defaultValue="" required><option value="" disabled>선택</option><option value="있음">있음</option><option value="없음">없음</option><option value="확인 중">확인 중</option></select></label></>}
{activeId === "target" && <><label className="field"><span>집행 수단</span><select name="detail_method" defaultValue="" required><option value="" disabled>선택</option><option value="예금채권 압류·추심">예금채권 압류·추심</option><option value="급여채권 압류·추심">급여채권 압류·추심</option><option value="차량 집행">차량 집행</option><option value="부동산 집행">부동산 집행</option><option value="기타">기타</option></select></label><label className="field"><span>검토 결과</span><select name="detail_decision" defaultValue="" required><option value="" disabled>선택</option><option value="우선 검토">우선 검토</option><option value="추가 확인 필요">추가 확인 필요</option><option value="보류">보류</option><option value="제외">제외</option></select></label></>}
              <label className="field"><span>확인 근거 (선택)</span><input name="reference" maxLength={200} placeholder="확인한 자료나 경로" /></label>
              <label className="field"><span>증빙자료 (선택)</span><input name="evidence" type="file" accept=".pdf,.jpg,.jpeg,.png" /></label>
              <p className="plan-file-notice">PDF·JPG·PNG, 최대 10MB. 파일은 이 브라우저에만 저장됩니다. 민감정보를 가린 후 첨부하세요.</p>
              <label className="field" htmlFor="plan-record-description">{activeId === "target" ? "선택 이유 / 검토 내용" : "확인 내용 / 검토 결과"}</label>
              <div className="plan-input-action"><textarea id="plan-record-description" name="description" maxLength={1000} required placeholder="확인한 사실과 판단 근거를 입력하세요." /><button className="button button-primary" type="submit">등록</button></div>
            </form>

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function useCaseRecordForm(kind: string) {
  const pathname = usePathname()
  const caseId = pathname.split("/")[3]
  const key = `mvp-${kind}-${caseId}`
  const [saved, setSaved] = useState<Record<string, string>>({})
  useEffect(() => { const sync = () => { try { setSaved(JSON.parse(localStorage.getItem(key) || "{}")) } catch { toast.error("저장된 기록을 불러오지 못했습니다.") } }; sync(); window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync) }, [key])
  function persist(event: FormEvent, status: string, reasons: string[] = []) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const values = Object.fromEntries(new FormData(form).entries())
    const next = { ...values, status, reasons: reasons.join(", "), updatedAt: new Date().toLocaleString("ko-KR") }
    try {
      localStorage.setItem(key, JSON.stringify(next))
      const records = readDrafts().map((record) => record.case_id === caseId ? { ...record, outcome_status: status, process_status: status === "abandoned" ? "중단" : status === "success_full" ? "완료" : status === "success_partial" ? "일부 회수" : status === "fail_confirmed" ? "회수 실패" : "진행 중" } : record)
      localStorage.setItem("mvp-case-drafts", JSON.stringify(records))
      window.dispatchEvent(new Event("mvp-case-updated"))
      setSaved(next)
      toast.success("이 브라우저에 기록을 저장했습니다.")
    } catch { toast.error("기록을 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.") }
  }
  return { saved, persist }
}

function StatusView() {
  const [status, setStatus] = useState("in_progress")
  const { saved, persist } = useCaseRecordForm("status")
  useEffect(() => { const restore = () => { if (saved.status) setStatus(saved.status) }; restore() }, [saved])
  function save(event: FormEvent) { persist(event, status) }
  return (
    <div className="form-layout">
      <form className="panel form-stack" onSubmit={save}>
        <div><p className="eyebrow">현재 상태 갱신</p><h2>이 사건은 지금 어떻게 진행되고 있나요?</h2></div>
        <RadioGroup className="radio-list" value={status} onValueChange={setStatus}>
          {["진행 중", "전액 회수", "일부 회수", "회수 실패", "중단함"].map((label, index) => { const values = ["in_progress", "success_full", "success_partial", "fail_confirmed", "abandoned"]; return <label key={label}><RadioGroupItem value={values[index]} /><span><strong>{label}</strong><small>{index === 0 ? "현재 진행 상황을 기록합니다." : "회수·중단 상태를 기록합니다."}</small></span></label> })}
        </RadioGroup>
        <label className="field"><span>다음 확인일 (선택)</span><input key={saved.updatedAt} name="nextDate" type="date" defaultValue={saved.nextDate || ""} /></label>
        <label className="field"><span>메모 (선택)</span><textarea key={saved.updatedAt} name="memo" defaultValue={saved.memo || ""} placeholder="진행 중 확인한 내용을 식별정보 없이 기록하세요." /></label>
        <button className="button button-primary button-large" type="submit">상태 저장</button>
      </form>
      <aside className="panel"><h2>진행 기록</h2><ol className="activity-list"><li><span /><div><strong>{saved.status ? "진행 상태 저장됨" : "아직 저장된 진행 기록이 없습니다"}</strong><small>{saved.updatedAt || "상태를 선택하고 저장하세요."}</small></div></li><li><span /><div><strong>자동 알림은 추후 지원 예정</strong><small>미응답은 실패로 확정하지 않습니다.</small></div></li></ol></aside>
    </div>
  )
}

function ResultView() {
  const [result, setResult] = useState("success_partial")
  const [reasons, setReasons] = useState<string[]>([])
  const { saved, persist } = useCaseRecordForm("result")
  useEffect(() => { const restore = () => { if (saved.status) setResult(saved.status); setReasons(saved.reasons ? saved.reasons.split(", ") : []) }; restore() }, [saved])
  function save(event: FormEvent) { persist(event, result, reasons) }
  return (
    <form className="result-form" onSubmit={save}>
      <section className="panel form-stack">
        <div><p className="eyebrow">최종 결과</p><h2>회수 결과는 어땠나요?</h2><p>직접 확인한 결과만 선택해 주세요. 진행 중이면 최종 결과를 입력하지 않아도 됩니다.</p></div>
        <RadioGroup className="result-choice-grid" value={result} onValueChange={setResult}>
          {[["success_full", "전액 회수", faCircleCheck], ["success_partial", "일부 회수", faCoins], ["fail_confirmed", "회수 실패", faCircleExclamation], ["abandoned", "중도 포기", faClockRotateLeft]].map(([value, label, icon]) => <label className={result === value ? "is-selected" : ""} key={String(value)}><RadioGroupItem value={String(value)} /><FontAwesomeIcon icon={icon as typeof faCircleCheck} /><strong>{String(label)}</strong></label>)}
        </RadioGroup>
        {result === "success_partial" && <label className="field"><span>회수 금액 구간</span><select key={saved.updatedAt} name="recoveryBand" defaultValue={saved.recoveryBand}><option>청구액의 25% 미만</option><option>25% 이상 ~ 50% 미만</option><option>50% 이상 ~ 75% 미만</option><option>75% 이상</option></select></label>}
        {(result === "fail_confirmed" || result === "abandoned") && <div className="field result-reason-field"><span>실패·중단 이유 (복수 선택)</span><div className="reason-grid">{["재산 없음", "소재 불명", "비용 부담", "시간 오래 걸림", "기타"].map((reason) => <label className="checkbox-row" key={reason}><Checkbox checked={reasons.includes(reason)} onCheckedChange={(value) => setReasons((current) => value ? [...current, reason] : current.filter((item) => item !== reason))} /><span>{reason}</span></label>)}</div></div>}
        <div className="form-grid"><label className="field"><span>총 소요 기간</span><select key={saved.updatedAt} name="durationBand" defaultValue={saved.durationBand}><option>1개월 미만</option><option>1~3개월</option><option>3~6개월</option><option>6개월~1년</option><option>1년 이상</option></select></label><label className="field"><span>집행 비용 구간</span><select key={saved.updatedAt} name="costBand" defaultValue={saved.costBand}><option>10만 원 미만</option><option>10만~30만 원</option><option>30만~50만 원</option><option>50만 원 이상</option></select></label></div>
      </section>
      <Notice tone="secure" title="성공과 실패를 같은 기준으로 기록합니다">직접 확인한 결과만 기록해 주세요. 응답이 없다는 이유로 회수 실패로 처리하지 않습니다.</Notice>
      {saved.updatedAt && <p role="status">최근 저장: {saved.updatedAt}</p>}<button className="button button-primary button-large" type="submit">결과 저장</button>
    </form>
  )
}

function DataView({ caseId, record }: { caseId: string; record: DraftCase | null }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <>
      <section className="panel"><div className="panel-heading"><h2>저장된 사건 변수</h2><StatusBadge tone="positive">비식별</StatusBadge></div><dl className="review-list"><div><dt>사건 유형</dt><dd>{record?.claim_type || "대여금 (예시)"}</dd></div><div><dt>금액</dt><dd>{record?.claim_amount_band || demoCase.amount}</dd></div><div><dt>지역</dt><dd>{record?.region || "수도권 (예시)"}</dd></div><div><dt>경과 기간</dt><dd>{String(record?.judgment_elapsed_band || "1년 미만 (예시)")}</dd></div><div><dt>직접식별정보</dt><dd>저장 안 함</dd></div></dl></section>
      <section className="danger-zone"><div><h2>사건 데이터 관리</h2><p>삭제 요청은 본인 확인 후 운영자가 처리하고 결과를 알려드립니다.</p></div><Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><DialogTrigger asChild><button className="button button-danger-outline"><FontAwesomeIcon icon={faTrashCan} /> 사건 삭제 요청</button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>사건 삭제를 요청할까요?</DialogTitle><DialogDescription>삭제 요청 내용을 확인해 주세요.</DialogDescription></DialogHeader><div className="app-dialog-body"><div className="delete-request-notice"><strong>삭제 요청 전 반드시 확인하세요!</strong><ul><li>삭제 요청 후 운영 검토 시작</li><li>처리 전까지 삭제 요청 취소 가능</li><li>삭제 완료 시 사건 원본 및 계정과 연결된 데이터 삭제</li><li><strong>이미 비식별 처리된 데이터는 삭제되지 않으며, 동의한 범위에서 판단 기준 검증·서비스 개선에 계속 활용</strong></li></ul></div><p className="delete-request-summary">삭제 요청은 운영 검토 후 처리됩니다.</p></div><DialogFooter><button className="button button-danger" onClick={() => {
          try {
            window.localStorage.setItem(caseDeletionKey(caseId), "requested")
            window.dispatchEvent(new Event(caseDeletionEvent))
            toast.success("삭제 요청이 접수되었습니다.")
            setDeleteDialogOpen(false)
          } catch { toast.error("삭제 요청을 저장하지 못했습니다.") }
        }}>삭제 요청 접수</button></DialogFooter></DialogContent></Dialog></section>
    </>
  )
}

export function NotificationsScreen() {
  return (
    <main id="main-content" className="content-width page-main narrow-main">
      <PageHeader eyebrow="알림" title="알림함" description="상태 확인 요청과 처리 결과를 모아봅니다." />
      <section className="notification-list motion-enter">
        <article className="is-unread"><span><FontAwesomeIcon icon={faBell} /></span><div><StatusBadge tone="warning">상태 확인</StatusBadge><h2>집행 결과가 나왔나요?</h2><p>1분이면 입력할 수 있습니다. 당신의 결과는 다음 사람의 판단 기준이 됩니다.</p><small>오늘</small></div><Link className="button button-primary" href="/app/cases/demo-2026/status">상태 입력</Link></article>
        <article><span><FontAwesomeIcon icon={faFileCircleCheck} /></span><div><StatusBadge tone="info">리포트</StatusBadge><h2>실익 리포트가 준비되었습니다</h2><p>점수보다 판단 근거와 데이터 한계를 먼저 확인하세요.</p><small>2026.08.29</small></div><Link className="button button-outline" href="/app/cases/demo-2026/report">리포트 보기</Link></article>
      </section>
    </main>
  )
}

export function SettingsScreen() {
  return (
    <main id="main-content" className="content-width page-main">
      <PageHeader eyebrow="내 정보" title="계정·동의 설정" description="프로필, 알림, 동의 내역과 개인정보 권리 요청을 관리합니다." />
      <Tabs defaultValue="profile" className="settings-tabs motion-enter">
        <TabsList variant="line"><TabsTrigger value="profile">프로필</TabsTrigger><TabsTrigger value="consent">동의 내역</TabsTrigger><TabsTrigger value="notification">알림 설정</TabsTrigger><TabsTrigger value="rights">데이터·탈퇴</TabsTrigger></TabsList>
        <TabsContent value="profile"><section className="panel form-stack"><div><h2>프로필</h2><p>이메일은 Supabase Auth에서 관리하며 프로필 테이블에 중복 저장하지 않습니다.</p></div><label className="field"><span>이름 또는 별칭</span><input defaultValue="지현" /></label><label className="field"><span>이메일</span><input defaultValue="jihyun@example.com" disabled /></label><button className="button button-primary" onClick={() => toast.success("프로필이 저장되었습니다.")}>변경사항 저장</button></section></TabsContent>
        <TabsContent value="consent"><section className="panel"><div className="panel-heading"><h2>동의 이력</h2><StatusBadge tone="positive">이력 보존</StatusBadge></div><div className="consent-history">{[["이용약관", "1.0", "필수", true], ["개인정보처리방침", "1.0", "필수", true], ["판결문·사건정보 및 데이터 활용", "1.0", "필수", true]].map(([title, version, required, granted]) => <div key={String(title)}><div><strong>{String(title)}</strong><small>버전 {String(version)} · {String(required)}</small></div><StatusBadge tone={granted ? "positive" : "neutral"}>{granted ? "동의" : "미동의"}</StatusBadge></div>)}</div></section></TabsContent>
        <TabsContent value="notification"><section className="panel setting-list"><div><span><strong>사건 상태 알림</strong><small>30일·60일 상태 확인</small></span><Switch defaultChecked /></div><div><span><strong>처리 결과 알림</strong><small>삭제·정정·문의 처리 결과</small></span><Switch defaultChecked /></div><div><span><strong>마케팅 알림</strong><small>서비스 소식과 참여 안내</small></span><Switch /></div></section></TabsContent>
        <TabsContent value="rights"><div className="rights-grid"><ActionCard icon={<FontAwesomeIcon icon={faUserShield} />} title="내 데이터 요청" description="열람·정정·다운로드 요청을 접수할 수 있습니다." action={<button className="button button-outline button-small" onClick={() => toast.success("권리 요청이 접수되었습니다.")}>요청 접수</button>} /><ActionCard danger icon={<FontAwesomeIcon icon={faTrashCan} />} title="회원 탈퇴" description="탈퇴 요청 후 세션 해지와 데이터 처리 절차가 시작됩니다." action={<button className="button button-danger-outline button-small">탈퇴 요청</button>} /></div></TabsContent>
      </Tabs>
    </main>
  )
}
