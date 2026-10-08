"use client"

import { Breadcrumbs, Notice, PageHeader, StatusBadge } from "@/components/screen-kit"
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
  faFileArrowUp,
  faFileCircleCheck,
  faFileLines,
  faGaugeHigh,
  faListCheck,
  faPenToSquare,
  faScaleBalanced,
  faTrashCan,
  faUserShield,
  faWallet,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const demoCase = {
  id: "EC-2026-0001",
  type: "대여금",
  amount: "300만 원 이상 ~ 500만 원 미만",
  status: "진행 중",
  updatedAt: "2026.08.29",
  sufficiency: 72,
  score: 68,
}

export function DashboardScreen() {
  return (
    <main id="main-content" className="content-width page-main dashboard-main">
      <PageHeader
        eyebrow="대시보드"
        title="안녕하세요, 지현님"
        description="사건의 현재 상태와 지금 해야 할 일을 확인하세요."
        actions={<Link className="button button-primary" href="/app/cases/new"><FontAwesomeIcon icon={faFileLines} /> 새 사건 등록</Link>}
      />
      <section className="dashboard-metrics motion-enter" aria-label="사건 요약">
        <article><span><FontAwesomeIcon icon={faFileCircleCheck} /></span><div><small>진행 중 사건</small><strong>1</strong></div></article>
        <article><span className="accent"><FontAwesomeIcon icon={faCalendarCheck} /></span><div><small>결과 입력 필요</small><strong>1</strong></div></article>
        <article><span className="success"><FontAwesomeIcon icon={faCircleCheck} /></span><div><small>완료한 사건</small><strong>0</strong></div></article>
      </section>

      <section className="next-action-card motion-enter">
        <div className="next-action-icon"><FontAwesomeIcon icon={faBell} /></div>
        <div>
          <StatusBadge tone="warning">확인 필요</StatusBadge>
          <h2>집행 진행 상태를 알려주세요</h2>
          <p>마지막 업데이트 후 30일이 지났습니다. 1분이면 현재 상태를 기록할 수 있어요.</p>
        </div>
        <Link className="button button-primary" href="/app/cases/demo-2026/status">상태 갱신 <FontAwesomeIcon icon={faArrowRight} /></Link>
      </section>

      <div className="dashboard-grid">
        <section className="panel motion-enter">
          <div className="panel-heading"><div><p className="eyebrow">내 사건</p><h2>진행 중인 사건</h2></div><Link href="/app/cases">전체 보기</Link></div>
          <article className="case-card">
            <div className="case-card-top"><span className="case-icon"><FontAwesomeIcon icon={faScaleBalanced} /></span><div><small>{demoCase.id}</small><h3>{demoCase.type} 청구 사건</h3></div><StatusBadge tone="info">{demoCase.status}</StatusBadge></div>
            <dl className="case-summary"><div><dt>채권 금액</dt><dd>{demoCase.amount}</dd></div><div><dt>데이터 충분도</dt><dd>{demoCase.sufficiency}%</dd></div><div><dt>최근 갱신</dt><dd>{demoCase.updatedAt}</dd></div></dl>
            <Progress value={demoCase.sufficiency} aria-label={`데이터 충분도 ${demoCase.sufficiency}%`} />
            <div className="case-actions"><Link className="button button-outline" href="/app/cases/demo-2026">사건 상세</Link><Link className="button button-primary" href="/app/cases/demo-2026/report">리포트 보기</Link></div>
          </article>
        </section>
        <aside className="panel motion-enter trans">
          <div className="panel-heading"><div><p className="eyebrow">최근 리포트</p><h2>실익 판단 기준선</h2></div><StatusBadge tone="warning">데모</StatusBadge></div>
          <div className="mini-score"><strong>{demoCase.score}</strong><span>/ 100</span></div>
          <p>현재 데이터 기준 <b>추가 확인 후 착수 검토</b> 구간입니다.</p>
          <Link className="text-link" href="/app/cases/demo-2026/report">판단 근거 6개 확인 <FontAwesomeIcon icon={faChevronRight} /></Link>
        </aside>
      </div>
      <Notice tone="info" title="점수는 성공 확률이 아닙니다">
        현재 리포트는 룰 기반 시범 점수입니다. 회수 결과를 보장하지 않으며 데이터 충분도와 한계를 함께 확인해야 합니다.
      </Notice>
    </main>
  )
}

const wizardSteps = ["대상 확인", "입력 방식", "사건 정보", "집행 경험", "정보 확인", "제출"]

const caseTypeLabels: Record<string, string> = { loan: "대여금", sale: "매매대금", construction: "공사대금", other: "기타" }
const amountLabels: Record<string, string> = { "under-100": "100만 원 미만", "100-300": "100만~300만 원", "300-500": "300만~500만 원" }
const regionLabels: Record<string, string> = { capital: "수도권", metro: "광역시", other: "그 외 지역", unknown: "모름" }
const statusLabels: Record<string, string> = { in_progress: "진행 중", success_partial: "일부 회수", fail_confirmed: "전혀 회수 못함", abandoned: "중단함" }
const attemptLabels: Record<string, string> = { bank: "통장 압류", wage: "급여 압류", car: "차량", estate: "부동산", none: "아직 안 함" }

export function CaseListScreen() {
  const cases = [
    { id: "demo-2026", caseNo: "EC-2026-0001", type: "대여금", amount: "300만 원 이상 ~ 500만 원 미만", status: "진행 중", next: "신청 비용·선순위 권리 확인", updatedAt: "2026.08.29", tone: "info" as const },
    { id: "demo-2025-02", caseNo: "EC-2025-0002", type: "매매대금", amount: "100만 원 이상 ~ 300만 원 미만", status: "완료", next: "집행 결과 기록 완료", updatedAt: "2026.07.14", tone: "positive" as const },
    { id: "demo-2025-03", caseNo: "EC-2025-0003", type: "기타", amount: "100만 원 미만", status: "중단", next: "필요 시 사건 다시 검토", updatedAt: "2026.05.02", tone: "neutral" as const },
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
            <Link className="button button-outline" href={`/app/cases/${item.id}`}>사건 보기 <FontAwesomeIcon icon={faChevronRight} /></Link>
          </article>
        ))}
      </section>
    </main>
  )
}

export function CaseWizardScreen() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState("manual")
  const [caseType, setCaseType] = useState("loan")
  const [amount, setAmount] = useState("300-500")
  const [region, setRegion] = useState("capital")
  const [attempts, setAttempts] = useState<string[]>(["none"])
  const [status, setStatus] = useState("in_progress")
  const [documentConsent, setDocumentConsent] = useState(false)
  const [fileName, setFileName] = useState("")
  const [judgmentCheck, setJudgmentCheck] = useState<"idle" | "checking" | "true" | "false" | "unknown">("idle")
  const [judgmentMessage, setJudgmentMessage] = useState("")
  async function checkJudgment(file: File) {
    setJudgmentCheck("checking")
    setJudgmentMessage("판결문 형식을 확인하고 있습니다.")
    try {
      const payload = new FormData()
      payload.append("file", file)
      const response = await fetch("http://localhost:8000/documents/validate-judgment", { method: "POST", body: payload })
      if (!response.ok) throw new Error("판별 서버 응답 오류")
      const result = await response.json() as {result: "true" | "false" | "unknown"; reason: string}
      setJudgmentCheck(result.result)
      setJudgmentMessage(result.reason)
      if (result.result !== "true") setFileName("")
    } catch {
      setJudgmentCheck("unknown")
      setJudgmentMessage("판별 서버에 연결하지 못했습니다. 서버를 실행하거나 직접 입력을 선택해 주세요.")
      setFileName("")
    }
  }
  const [signals, setSignals] = useState<Record<string, string>>({
    judgment_elapsed_band: "1년 미만",
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
  })
  function setSignal(key: string, value: string) {
    setSignals((current) => ({ ...current, [key]: value }))
  }

  const progress = Math.round((step / wizardSteps.length) * 100)
  const displaySignal = (value: string) => value === "Unknown" ? "미확인" : value

  const reviewItems: Array<[string, string]> = [
    ["입력 방식", method === "manual" ? "직접 입력" : "판결문 업로드"],
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
  ]

  function next() {
    if (step === 2 && method === "upload" && judgmentCheck !== "true") {
      toast.error(
        judgmentCheck === "false"
          ? "업로드한 파일이 민사 판결문 형식으로 확인되지 않았습니다. 판결문 PDF를 다시 선택해 주세요."
          : judgmentCheck === "unknown"
            ? "업로드한 PDF가 판결문인지 확인할 수 없습니다. 다른 PDF를 선택하거나 직접 입력해 주세요."
            : judgmentCheck === "checking"
              ? "판결문 PDF를 확인하고 있습니다. 잠시 후 다시 시도해 주세요."
              : "민사 판결문 PDF를 먼저 업로드해 주세요."
      )
      return
    }
    if (step === 2 && method === "upload" && !documentConsent) {
      toast.error("문서 처리 안내를 확인해 주세요.")
      return
    }
    setStep((current) => Math.min(6, current + 1))
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
      process_status: status === "abandoned" ? "중단" : status === "in_progress" ? "진행 중" : "완료",
      result_source: "user",
      is_dummy: "N",
    }
    try {
      const previous = JSON.parse(window.localStorage.getItem("mvp-case-drafts") || "[]") as unknown[]
      window.localStorage.setItem("mvp-case-drafts", JSON.stringify([...previous, record]))
      toast.success("입력값을 이 브라우저에 임시 저장했습니다. 데모 리포트로 이동합니다.")
      router.push("/app/cases/demo-2026/report")
    } catch {
      toast.error("임시 저장에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.")
    }
  }

  return (
    <main id="main-content" className="content-width page-main case-wizard">
      <Breadcrumbs items={[{ label: "대시보드", href: "/app" }, { label: "새 사건 등록" }]} />
      <PageHeader eyebrow={`새 사건 등록 · ${step}/${wizardSteps.length}`} title={wizardSteps[step - 1]} description="정확한 이름·주소·금액 대신 분석에 필요한 구간 정보만 입력합니다." />
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
            <h2>사건 정보를 어떻게 입력할까요?</h2>
            <RadioGroup className="choice-grid" value={method} onValueChange={setMethod}>
              <label className={method === "manual" ? "choice-card is-selected" : "choice-card"}>
                <RadioGroupItem value="manual" />
                <FontAwesomeIcon icon={faPenToSquare} />
                <span><strong>직접 입력</strong><small>권장 · 개인정보 처리 범위가 가장 작습니다.</small></span>
              </label>
              <label className={method === "upload" ? "choice-card is-selected" : "choice-card"}>
                <RadioGroupItem value="upload" />
                <FontAwesomeIcon icon={faFileArrowUp} />
                <span><strong>판결문 업로드</strong><small>필요 변수 확인 후 원문 폐기 흐름</small></span>
              </label>
            </RadioGroup>
            {method === "upload" && (
              <div className="upload-panel">
                <label className="upload-zone">
                  <FontAwesomeIcon icon={faFileArrowUp} />
                  <strong>{fileName || "PDF 판결문을 선택하세요"}</strong>
                  <span>PDF · 최대 10MB · 암호화 문서 제외</span>
                  <input type="file" accept=".pdf,application/pdf" onChange={(event) => {
                    const file = event.target.files?.[0]
                    setJudgmentCheck("idle")
                    setJudgmentMessage("")
                    if (!file) { setFileName(""); return }
                    const isPdf = file.name.toLowerCase().endsWith(".pdf") && (file.type === "application/pdf" || file.type === "")
                    if (!isPdf) {
                      event.target.value = ""
                      setFileName("")
                      toast.error("PDF 파일만 업로드할 수 있습니다.")
                      return
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      event.target.value = ""
                      setFileName("")
                      toast.error("PDF 파일은 최대 10MB까지 선택할 수 있습니다.")
                      return
                    }
                    setFileName(file.name)
                    void checkJudgment(file)
                  }} />
                </label>
                {judgmentCheck !== "idle" && <Notice tone={judgmentCheck === "true" ? "secure" : judgmentCheck === "checking" ? "info" : "warning"} title={judgmentCheck === "checking" ? "판별 중" : judgmentCheck === "true" ? "판결문 형식 확인" : "판결문 확인 필요"}>{judgmentMessage}</Notice>}
                <label className="checkbox-row"><Checkbox checked={documentConsent} onCheckedChange={(value) => setDocumentConsent(Boolean(value))} /><span><strong>[필수]</strong> 문서 처리·식별정보 제거·원문 폐기 원칙을 확인했습니다.</span></label>
                <Notice tone="info" title="현재는 UI 프로토타입입니다">선택한 파일은 브라우저 밖으로 전송되지 않습니다. 실제 파싱 API와 단기보관 정책 연결 전 화면 흐름만 검증합니다.</Notice>
              </div>
            )}
          </div>
        )}
        {step === 3 && (
          <div className="wizard-section">
            <h2>비식별 사건 정보를 입력해 주세요</h2>
            <div className="form-grid">
              <label className="field"><span>사건 유형</span><select value={caseType} onChange={(event) => setCaseType(event.target.value)}><option value="loan">대여금</option><option value="sale">매매대금</option><option value="construction">공사대금</option><option value="other">기타</option></select></label>
              <label className="field"><span>채권 금액 구간</span><select value={amount} onChange={(event) => setAmount(event.target.value)}><option value="under-100">100만 원 미만</option><option value="100-300">100만~300만 원</option><option value="300-500">300만~500만 원</option></select></label>
              <label className="field"><span>판결 후 경과 기간</span><select value={signals.judgment_elapsed_band} onChange={(event) => setSignal("judgment_elapsed_band", event.target.value)}><option>1년 미만</option><option>1~3년</option><option>3~5년</option><option>5년 이상</option></select></label>
              <label className="field"><span>채무자 유형</span><select value={signals.debtor_type} onChange={(event) => setSignal("debtor_type", event.target.value)}><option>개인</option><option>개인사업자</option><option>법인</option><option>모름</option></select></label>
              <label className="field"><span>지역 범위</span><select value={region} onChange={(event) => setRegion(event.target.value)}><option value="capital">수도권</option><option value="metro">광역시</option><option value="other">그 외 지역</option><option value="unknown">모름</option></select></label>
              <label className="field"><span>법원 급</span><select><option>지방법원</option><option>지원</option><option>기타·모름</option></select></label>
            </div>
            <Notice tone="secure" title="정확한 값은 입력하지 않습니다">채무자의 이름, 주민번호, 상세주소, 정확한 청구금액은 저장 대상이 아닙니다.</Notice>
          </div>
        )}
        {step === 4 && (
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
        {step === 5 && (
          <div className="wizard-section">
            <h2>분석에 사용할 정보를 확인해 주세요</h2>
            <dl className="review-list">
              {reviewItems.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <Notice tone="info" title="추가 정보가 필요한 경우">데이터가 부족하면 점수를 단정하지 않고, 리포트에서 먼저 확인할 항목을 안내합니다.</Notice>
          </div>
        )}
        {step === 6 && (
          <div className="wizard-section submit-summary">
            <span className="submit-icon"><FontAwesomeIcon icon={faFileCircleCheck} /></span>
            <h2>사건을 등록할 준비가 되었습니다</h2>
            <p>제출하면 룰 기반 시범 리포트가 생성됩니다. 입력 정보는 이후 사건 상세에서 수정할 수 있습니다.</p>
            <dl className="review-list submit-review-list">{reviewItems.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <Notice tone="warning" title="분석 결과는 법률 자문이 아닙니다">최종 집행 여부와 실행 책임은 사용자에게 있으며, 필요한 경우 법률 전문가와 상담하세요.</Notice>
          </div>
        )}
      </section>
      <div className="wizard-actions">
        {step > 1 ? <button className="button button-outline" onClick={previous}>이전</button> : <Link className="button button-outline" href="/app">취소</Link>}
        {step < 6 ? <button className="button button-primary button-large" onClick={next}>다음 <FontAwesomeIcon icon={faArrowRight} /></button> : <button className="button button-primary button-large" onClick={submitCase}>사건 등록하고 리포트 보기 <FontAwesomeIcon icon={faArrowRight} /></button>}
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

export function CaseDetailScreen({ section = "summary" }: { section?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const active = caseTabs.find(([, , href]) => href === pathname)?.[0] ?? section

  return (
    <main id="main-content" className="content-width page-main case-detail-main">
      <Breadcrumbs items={[{ label: "대시보드", href: "/app" }, { label: "내 사건", href: "/app/cases/demo-2026" }, { label: demoCase.id }]} />
      <section className="case-identity">
        <div><div className="eyebrow">{demoCase.id}</div><h1>{demoCase.type} 청구 사건</h1><p>{demoCase.amount} · 최근 업데이트 {demoCase.updatedAt}</p></div>
        <div><StatusBadge tone="info">{demoCase.status}</StatusBadge><Link className="button button-primary" href="/app/cases/demo-2026/result">결과 수정</Link></div>
      </section>
      <Tabs value={active} onValueChange={(value) => router.push(caseTabs.find(([id]) => id === value)?.[2] ?? pathname)}>
        <TabsList variant="line" className="case-tabs">
          {caseTabs.map(([id, label]) => <TabsTrigger key={id} value={id}>{label}</TabsTrigger>)}
        </TabsList>
        <TabsContent value={active} className="case-tab-content motion-enter">
          {active === "summary" && <CaseSummary />}
          {active === "report" && <ReportView />}
          {active === "plan" && <PlanView />}
          {active === "status" && <StatusView />}
          {active === "result" && <ResultView />}
          {active === "data" && <DataView />}
        </TabsContent>
      </Tabs>
    </main>
  )
}

function CaseSummary() {
  return (
    <>
      <div className="case-overview-grid">
        <section className="panel">
          <div className="panel-heading"><h2>현재 상태</h2><StatusBadge tone="info">분석 가능</StatusBadge></div>
          <div className="status-journey"><div className="is-done"><span><FontAwesomeIcon icon={faCheck} /></span><strong>사건 등록</strong></div><div className="is-done"><span><FontAwesomeIcon icon={faCheck} /></span><strong>리포트 생성</strong></div><div className="is-current"><span>3</span><strong>진행 중</strong></div><div><span>4</span><strong>결과 확정</strong></div></div>
        </section>
        <section className="panel">
          <div className="panel-heading"><h2>데이터 충분도</h2><strong>{demoCase.sufficiency}%</strong></div>
          <Progress value={demoCase.sufficiency} />
          <p>집행 대상의 선순위 권리와 실제 비용 정보가 추가되면 판단 근거가 더 선명해집니다.</p>
        </section>
      </div>
      <section className="next-action-card compact"><div className="next-action-icon"><FontAwesomeIcon icon={faListCheck} /></div><div><p className="eyebrow">권장되는 다음 행동</p><h2>신청 비용과 선순위 권리를 먼저 확인하세요</h2><p>두 정보를 확인한 뒤 집행 착수 여부를 결정하는 흐름입니다.</p></div><Link className="button button-primary" href="/app/cases/demo-2026/plan">체크리스트 열기</Link></section>
      <section className="panel"><div className="panel-heading"><h2>최근 기록</h2><Link href="/app/cases/demo-2026/status">전체 기록</Link></div><ol className="activity-list"><li><span /><div><strong>리포트가 생성되었습니다</strong><small>2026.08.29 · 룰 버전 MVP-0.1</small></div></li><li><span /><div><strong>사건 정보가 등록되었습니다</strong><small>2026.08.29 · 직접 입력</small></div></li></ol></section>
    </>
  )
}

function ReportView() {
  return (
    <>
      <Notice tone="warning" title="데모용 시범 점수입니다">실제 회수 확률이 아니며, 입력된 가상 사건 정보로 화면 구조를 보여줍니다.</Notice>
      <section className="report-hero">
        <div className="score-dial"><span>실익 점수</span><strong>{demoCase.score}</strong><small>/ 100</small><div className="score-track"><span className="score-fill" /></div></div>
        <div><StatusBadge tone="warning">추가 확인 후 착수 검토</StatusBadge><h2>회수 실익은 있으나 비용과 선순위 권리를 먼저 확인해야 합니다</h2><p>금액 구간과 경과 기간은 유리하지만, 재산 정보의 구체성이 낮아 판단 확신도는 중간 수준입니다.</p><div className="report-meta"><span>데이터 충분도 <b>72%</b></span><span>룰 버전 <b>MVP-0.1</b></span></div></div>
      </section>
      <section className="factor-grid">
        <article className="factor-card positive"><h3><FontAwesomeIcon icon={faArrowRight} /> 유리한 요인</h3><ul><li>초기 지원 금액 구간에 해당</li><li>판결 후 경과 기간이 짧음</li><li>집행 상태를 직접 확인함</li></ul></article>
        <article className="factor-card negative"><h3><FontAwesomeIcon icon={faCircleExclamation} /> 불리·불확실 요인</h3><ul><li>구체적인 재산 정보 없음</li><li>선순위 권리 미확인</li><li>실제 신청 비용 미입력</li></ul></article>
      </section>
      <section className="panel"><div className="panel-heading"><h2>예상 부담 범위</h2><StatusBadge>사건별 확인 필요</StatusBadge></div><div className="burden-grid"><div><FontAwesomeIcon icon={faCoins} /><span><small>비용</small><strong>법원·수단별 산정 필요</strong></span></div><div><FontAwesomeIcon icon={faClockRotateLeft} /><span><small>기간</small><strong>송달·재산 상태에 따라 변동</strong></span></div><div><FontAwesomeIcon icon={faGaugeHigh} /><span><small>확신도</small><strong>중간 · 정보 2개 부족</strong></span></div></div></section>
      <section className="report-action"><div><p className="eyebrow">다음 선택</p><h2>추가 확인 후 결정하세요</h2><p>신청 비용과 선순위 권리 정보를 확보하면 착수·보류 판단을 갱신할 수 있습니다.</p></div><div><Link className="button button-primary" href="/app/cases/demo-2026/plan">확인 체크리스트</Link><Link className="button button-outline" href="/guide">일반 절차 보기</Link></div></section>
    </>
  )
}

function PlanView() {
  const items = [
    {
      id: "judgment",
      title: "집행권원과 확정 여부 확인",
      status: "완료",
      description: "등록된 증빙에서 집행권원과 확정 여부를 확인했습니다.",
      action: "증빙 보기",
    },
    {
      id: "cost",
      title: "신청 비용·송달료 확인",
      status: "확인 필요",
      description: "신청할 집행 절차에 따라 실제 비용을 확인해야 합니다.",
      action: "확인 방법 보기",
    },
    {
      id: "priority",
      title: "선순위 권리 여부 확인",
      status: "확인 필요",
      description: "배당 가능성을 판단하기 위해 권리관계 증빙이 필요합니다.",
      action: "증빙 등록",
    },
    {
      id: "target",
      title: "우선 검토할 집행 수단 선택",
      status: "대기",
      description: "필요한 확인이 끝나면 적합한 집행 수단을 검토합니다.",
      action: null,
    },
  ]

  const completedCount = items.filter((item) => item.status === "완료").length

  return (
    <>
      <div className="plan-heading"><div><p className="eyebrow">통장 압류 검토 경로</p><h2>집행 착수 전 확인 항목</h2></div><strong>{completedCount} / {items.length} 확인 완료</strong></div>
      <Progress value={(completedCount / items.length) * 100} />
      <section className="checklist-panel">
        {items.map((item, index) => (
          <div className="plan-item" key={item.id}>
            <span className="plan-index">{index + 1}</span>
            <div className="plan-item-content">
              <strong>{item.title}</strong>
              <small>{item.description}</small>
              {item.action && <button className="text-link" type="button" onClick={() => toast.info(`${item.action} 기능은 증빙 관리 화면과 연결할 예정입니다.`)}>{item.action}</button>}
            </div>
            <StatusBadge tone={item.status === "완료" ? "positive" : item.status === "확인 필요" ? "warning" : item.status === "검토중" ? "info" : "neutral"}>{item.status}</StatusBadge>
          </div>
        ))}
      </section>
      <Notice tone="info" title="상태는 증빙 확인 결과에 따라 변경됩니다">사용자가 직접 완료 처리하지 않습니다. 증빙이 적합하면 완료, 증빙이 없거나 추가 확인이 필요하면 확인 필요, 제출된 증빙을 확인 중이면 검토중, 선행 확인이 필요한 단계는 대기로 표시합니다.</Notice>
    </>
  )
}

function StatusView() {
  const [status, setStatus] = useState("in_progress")
  function save(event: FormEvent) { event.preventDefault(); toast.success("진행 상태가 저장되었습니다.") }
  return (
    <div className="form-layout">
      <form className="panel form-stack" onSubmit={save}>
        <div><p className="eyebrow">현재 상태 갱신</p><h2>이 사건은 지금 어떻게 진행되고 있나요?</h2></div>
        <RadioGroup className="radio-list" value={status} onValueChange={setStatus}>
          {["진행 중", "전액 회수", "일부 회수", "회수 실패", "중단함"].map((label, index) => { const values = ["in_progress", "success_full", "success_partial", "fail_confirmed", "abandoned"]; return <label key={label}><RadioGroupItem value={values[index]} /><span><strong>{label}</strong><small>{index === 0 ? "다음 상태 확인 알림을 예약합니다." : "최종 결과 입력 단계로 이어집니다."}</small></span></label> })}
        </RadioGroup>
        <label className="field"><span>다음 확인일 (선택)</span><input type="date" /></label>
        <label className="field"><span>메모 (선택)</span><textarea placeholder="진행 중 확인한 내용을 식별정보 없이 기록하세요." /></label>
        <button className="button button-primary button-large" type="submit">상태 저장</button>
      </form>
      <aside className="panel"><h2>진행 기록</h2><ol className="activity-list"><li><span /><div><strong>진행 중으로 등록</strong><small>2026.08.29 · 사용자 입력</small></div></li><li><span /><div><strong>30일 확인 알림 예정</strong><small>미응답은 실패로 확정하지 않습니다.</small></div></li></ol></aside>
    </div>
  )
}

function ResultView() {
  const router = useRouter()
  const [result, setResult] = useState("success_partial")
  const [reasons, setReasons] = useState<string[]>([])
  function save(event: FormEvent) { event.preventDefault(); toast.success("결과 입력이 완료되었습니다."); router.push("/app/cases/demo-2026") }
  return (
    <form className="result-form" onSubmit={save}>
      <section className="panel form-stack">
        <div><p className="eyebrow">최종 결과</p><h2>회수 결과는 어땠나요?</h2><p>직접 확인한 결과만 선택해 주세요. 진행 중이면 최종 결과를 입력하지 않아도 됩니다.</p></div>
        <RadioGroup className="result-choice-grid" value={result} onValueChange={setResult}>
          {[["success_full", "전액 회수", faCircleCheck], ["success_partial", "일부 회수", faCoins], ["fail_confirmed", "회수 실패", faCircleExclamation], ["abandoned", "중도 포기", faClockRotateLeft]].map(([value, label, icon]) => <label className={result === value ? "is-selected" : ""} key={String(value)}><RadioGroupItem value={String(value)} /><FontAwesomeIcon icon={icon as typeof faCircleCheck} /><strong>{String(label)}</strong></label>)}
        </RadioGroup>
        {result === "success_partial" && <label className="field"><span>회수 금액 구간</span><select><option>청구액의 25% 미만</option><option>25% 이상 ~ 50% 미만</option><option>50% 이상 ~ 75% 미만</option><option>75% 이상</option></select></label>}
        {(result === "fail_confirmed" || result === "abandoned") && <div><h3>실패·중단 이유 (복수 선택)</h3><div className="reason-grid">{["재산 없음", "소재 불명", "비용 부담", "시간 오래 걸림", "기타"].map((reason) => <label className="checkbox-row" key={reason}><Checkbox checked={reasons.includes(reason)} onCheckedChange={(value) => setReasons((current) => value ? [...current, reason] : current.filter((item) => item !== reason))} /><span>{reason}</span></label>)}</div></div>}
        <div className="form-grid"><label className="field"><span>총 소요 기간</span><select><option>1개월 미만</option><option>1~3개월</option><option>3~6개월</option><option>6개월~1년</option><option>1년 이상</option></select></label><label className="field"><span>집행 비용 구간</span><select><option>10만 원 미만</option><option>10만~30만 원</option><option>30만~50만 원</option><option>50만 원 이상</option></select></label></div>
      </section>
      <Notice tone="secure" title="성공과 실패를 같은 기준으로 기록합니다">사용자 직접 입력 결과는 `result_source=user`로 구분되며, 장기 미응답은 실패가 아닌 `unresolved`로 유지합니다.</Notice>
      <button className="button button-primary button-large" type="submit">결과 저장하고 완료</button>
    </form>
  )
}

function DataView() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <>
      <section className="panel"><div className="panel-heading"><h2>저장된 사건 변수</h2><StatusBadge tone="positive">비식별</StatusBadge></div><dl className="review-list"><div><dt>사건 유형</dt><dd>대여금</dd></div><div><dt>금액</dt><dd>300만~500만 원</dd></div><div><dt>지역</dt><dd>수도권</dd></div><div><dt>경과 기간</dt><dd>1년 미만</dd></div><div><dt>직접식별정보</dt><dd>저장 안 함</dd></div></dl></section>
      <section className="danger-zone"><div><h2>사건 데이터 관리</h2><p>삭제 요청은 본인 확인 후 운영자가 처리하고 결과를 알려드립니다.</p></div><Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><DialogTrigger asChild><button className="button button-danger-outline"><FontAwesomeIcon icon={faTrashCan} /> 사건 삭제 요청</button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>사건 삭제를 요청할까요?</DialogTitle><DialogDescription asChild><div className="delete-request-notice"><strong>삭제 요청 전 반드시 확인하세요!</strong><ul><li>삭제 요청 후 운영 검토 시작</li><li>처리 전까지 삭제 요청 취소 가능</li><li>삭제 완료 시 사건 원본 및 계정과 연결된 데이터 삭제</li><li><strong>이미 비식별 처리된 데이터는 삭제되지 않으며, 동의한 범위에서 판단 기준 검증·서비스 개선에 계속 활용</strong></li></ul></div></DialogDescription></DialogHeader><DialogFooter><button className="button button-danger" onClick={() => { toast.success("삭제 요청이 접수되었습니다."); setDeleteDialogOpen(false) }}>삭제 요청 접수</button></DialogFooter></DialogContent></Dialog></section>
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
        <TabsContent value="rights"><div className="rights-grid"><section className="panel"><FontAwesomeIcon icon={faUserShield} /><h2>내 데이터 요청</h2><p>열람·정정·다운로드 요청을 접수할 수 있습니다.</p><button className="button button-outline" onClick={() => toast.success("권리 요청이 접수되었습니다.")}>요청 접수</button></section><section className="danger-zone"><div><FontAwesomeIcon icon={faTrashCan} /><h2>회원 탈퇴</h2><p>탈퇴 요청 후 세션 해지와 데이터 처리 절차가 시작됩니다.</p></div><button className="button button-danger-outline">탈퇴 요청</button></section></div></TabsContent>
      </Tabs>
    </main>
  )
}
