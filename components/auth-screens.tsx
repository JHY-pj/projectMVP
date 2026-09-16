"use client"

import { Notice, PageHeader } from "@/components/screen-kit"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import {
  faArrowRight,
  faCheck,
  faEnvelopeCircleCheck,
  faEye,
  faEyeSlash,
  faLock,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

type AuthMode = "login" | "signup" | "reset"

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [terms, setTerms] = useState(false)
  const isPasswordChange = mode === "reset" && searchParams.get("mode") === "change"

  const copy = {
    login: ["다시 오신 것을 환영합니다", "사건의 현재 상태와 다음 행동을 이어서 확인하세요."],
    signup: ["판결 다음의 방향을 함께 찾습니다", "회원가입 후 서비스 범위와 데이터 처리 원칙을 먼저 확인합니다."],
    reset: isPasswordChange
      ? ["새 비밀번호 설정", "다른 서비스에서 사용하지 않는 안전한 비밀번호를 입력하세요."]
      : ["비밀번호 재설정", "가입한 이메일로 안전한 재설정 링크를 보내드립니다."],
  } as const

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode === "signup" && (!terms || password !== confirmPassword)) {
      toast.error(!terms ? "필수 약관에 동의해 주세요." : "비밀번호가 일치하지 않습니다.")
      return
    }
    if (isPasswordChange && password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.")
      return
    }

    const supabase = createClient()
    if (!supabase || !isSupabaseConfigured) {
      toast.info("현재는 화면 데모 모드입니다.")
      router.push(mode === "signup" ? "/onboarding" : "/app")
      return
    }

    setLoading(true)
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success("로그인되었습니다.")
        router.push(searchParams.get("next") ?? "/app")
        router.refresh()
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm?next=/onboarding`,
          },
        })
        if (error) throw error
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      } else if (isPasswordChange) {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        toast.success("비밀번호가 변경되었습니다.")
        router.push("/app")
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password?mode=change`,
        })
        if (error) throw error
        toast.success("재설정 메일을 보냈습니다.")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "처리 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="main-content" className={`auth-main auth-${mode}`}>
      <section className="auth-aside">
        <div>
          <span className="auth-icon"><FontAwesomeIcon icon={faCompassMark} /></span>
          <p className="eyebrow">집행나침반</p>
          <h1>{copy[mode][0]}</h1>
          <p>{copy[mode][1]}</p>
        </div>
        <ul>
          <li><FontAwesomeIcon icon={faCheck} /> 식별정보 최소화</li>
          <li><FontAwesomeIcon icon={faCheck} /> 본인 데이터 RLS 격리</li>
          <li><FontAwesomeIcon icon={faCheck} /> 동의·철회 이력 분리 보관</li>
        </ul>
      </section>
      <section className="auth-card motion-enter">
        <div className="auth-card-heading">
          <h2>{copy[mode][0]}</h2>
          <p>{mode === "login" ? "계정 정보를 입력해 주세요." : mode === "signup" ? "서비스 이용 계정을 만듭니다." : "본인 계정의 정보를 입력해 주세요."}</p>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          {!isPasswordChange && (
            <label className="field">
              <span>이메일</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>
          )}
          {(mode !== "reset" || isPasswordChange) && (
            <label className="field">
              <span>비밀번호</span>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="8자 이상 입력"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={8}
                  required
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </label>
          )}
          {(mode === "signup" || isPasswordChange) && (
            <label className="field">
              <span>비밀번호 확인</span>
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />
            </label>
          )}
          {mode === "signup" && (
            <label className="checkbox-row">
              <Checkbox checked={terms} onCheckedChange={(checked) => setTerms(Boolean(checked))} />
              <span><strong>[필수]</strong> <Link href="/terms">이용약관</Link> 및 <Link href="/privacy">개인정보처리방침</Link>에 동의합니다.</span>
            </label>
          )}
          {mode === "login" && <Link className="form-side-link" href="/reset-password">비밀번호를 잊으셨나요?</Link>}
          <button className="button button-primary button-block button-large" disabled={loading} type="submit">
            {loading ? "처리 중..." : mode === "login" ? "로그인" : mode === "signup" ? "회원가입" : isPasswordChange ? "새 비밀번호 저장" : "재설정 메일 받기"}
            {!loading && <FontAwesomeIcon icon={faArrowRight} />}
          </button>
        </form>
        <div className="auth-switch">
          {mode === "login" ? <>처음이신가요? <Link href="/signup">회원가입</Link></> : mode === "signup" ? <>이미 계정이 있나요? <Link href="/login">로그인</Link></> : <Link href="/login">로그인으로 돌아가기</Link>}
        </div>
        <p className="security-note"><FontAwesomeIcon icon={faLock} /> 공개 클라이언트에는 Supabase publishable key만 사용합니다.</p>
      </section>
    </main>
  )
}

const faCompassMark = faShieldHalved

export function VerifyEmailScreen() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  return (
    <main id="main-content" className="centered-page">
      <section className="completion-card motion-enter">
        <span className="completion-icon"><FontAwesomeIcon icon={faEnvelopeCircleCheck} /></span>
        <p className="eyebrow">이메일 인증</p>
        <h1>{status === "error" ? "인증 링크를 확인해 주세요" : "이메일을 확인해 주세요"}</h1>
        <p>{status === "error" ? "링크가 만료되었거나 이미 사용되었습니다. 로그인 화면에서 다시 시도해 주세요." : "가입한 이메일로 인증 링크를 보냈습니다. 인증을 마치면 서비스 동의 단계로 이동합니다."}</p>
        <Link className="button button-primary button-large" href="/login">로그인으로 이동</Link>
      </section>
    </main>
  )
}

const consentItems = [
  ["terms", "[필수] 이용약관", "서비스 제공 범위와 이용자의 책임"],
  ["privacy", "[필수] 개인정보 처리", "계정·문의·권리 요청에 필요한 최소 정보"],
  ["case", "[필수] 판결문·사건정보 처리", "분석 변수 추출, 식별정보 제거, 원문 폐기 원칙"],
  ["model", "[선택] 서비스·모델 개선 참여", "비식별 사건 변수와 확정 결과의 연구 활용"],
  ["marketing", "[선택] 마케팅 정보 수신", "서비스 소식과 참여 안내"],
]

export function OnboardingScreen() {
  const router = useRouter()
  const [checked, setChecked] = useState<string[]>([])
  const [eligible, setEligible] = useState("yes")
  const requiredDone = ["terms", "privacy", "case"].every((item) => checked.includes(item))

  function toggleItem(item: string, value: boolean) {
    setChecked((current) => value ? [...new Set([...current, item])] : current.filter((entry) => entry !== item))
  }

  function continueOnboarding() {
    if (!requiredDone) {
      toast.error("필수 동의 항목을 확인해 주세요.")
      return
    }
    if (eligible !== "yes") {
      toast.info("초기 지원 범위 밖이므로 일반 절차 안내로 이동합니다.")
      router.push("/guide")
      return
    }
    toast.success("동의 내용이 확인되었습니다.")
    router.push("/app/cases/new")
  }

  return (
    <main id="main-content" className="content-width page-main narrow-main">
      <PageHeader eyebrow="시작 전 확인 · 1/2" title="어떤 정보를 왜 처리하는지 먼저 알려드릴게요" description="필수 동의와 선택 동의를 구분하고, 동의·철회 이력은 덮어쓰지 않고 시간순으로 기록합니다." />
      <Progress value={50} className="onboarding-progress" aria-label="온보딩 진행률 50%" />
      <section className="panel consent-panel motion-enter">
        <div className="consent-all">
          <label className="checkbox-row">
            <Checkbox checked={checked.length === consentItems.length} onCheckedChange={(value) => setChecked(value ? consentItems.map(([id]) => id) : [])} />
            <span><strong>전체 동의</strong><small>선택 항목은 동의하지 않아도 서비스를 이용할 수 있습니다.</small></span>
          </label>
        </div>
        {consentItems.map(([id, title, description]) => (
          <div className="consent-row" key={id}>
            <label className="checkbox-row">
              <Checkbox checked={checked.includes(id)} onCheckedChange={(value) => toggleItem(id, Boolean(value))} />
              <span><strong>{title}</strong><small>{description}</small></span>
            </label>
            <Link href={id === "terms" ? "/terms" : id === "privacy" ? "/privacy" : "/data-policy"}>내용 보기</Link>
          </div>
        ))}
      </section>
      <section className="panel eligibility-check motion-enter">
        <h2>초기 서비스 대상 확인</h2>
        <p>민사 승소 판결을 보유했고, 채권액이 500만 원 미만인가요?</p>
        <div className="segmented-control" role="radiogroup" aria-label="서비스 대상 여부">
          <button className={eligible === "yes" ? "is-selected" : ""} onClick={() => setEligible("yes")} role="radio" aria-checked={eligible === "yes"}>예</button>
          <button className={eligible === "no" ? "is-selected" : ""} onClick={() => setEligible("no")} role="radio" aria-checked={eligible === "no"}>아니요</button>
          <button className={eligible === "unknown" ? "is-selected" : ""} onClick={() => setEligible("unknown")} role="radio" aria-checked={eligible === "unknown"}>잘 모르겠어요</button>
        </div>
      </section>
      <Notice tone="secure" title="권한은 분리되어 있습니다">
        회원은 자신의 프로필·설정·동의 이력만 조회할 수 있으며, 역할과 계정 상태는 직접 수정할 수 없습니다.
      </Notice>
      <div className="sticky-actions">
        <Link className="button button-outline" href="/">취소</Link>
        <button className="button button-primary button-large" onClick={continueOnboarding}>확인하고 사건 등록 <FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
    </main>
  )
}
