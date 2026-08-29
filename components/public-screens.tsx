"use client"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faArrowTrendUp,
  faBuildingColumns,
  faCheck,
  faClipboardCheck,
  faCompass,
  faDatabase,
  faFileShield,
  faLayerGroup,
  faScaleBalanced,
  faShieldHalved,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Breadcrumbs, Notice, PageHeader, StatusBadge } from "@/components/screen-kit"

export function HomeScreen() {
  return (
    <main id="main-content">
      <section className="hero-section">
        <div className="content-width hero-grid">
          <div className="hero-copy">
            <div className="eyebrow motion-enter">
              <span className="eyebrow-dot" /> 승소 이후의 다음 판단
            </div>
            <h1 className="motion-enter">
              판결은 끝났지만,
              <br />
              <em>회수는 아직</em>이라면
            </h1>
            <p className="hero-description motion-enter">
              사건 조건과 공개 데이터를 바탕으로 집행 실익의 근거, 예상 부담,
              다음 확인사항을 한곳에서 정리해드립니다.
            </p>
            <div className="hero-actions motion-enter">
              <Link className="button button-primary button-large" href="/signup">
                내 사건 분석 시작 <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <Link className="button button-outline button-large" href="/guide">
                승소 후 절차 보기
              </Link>
            </div>
            <p className="hero-footnote motion-enter">
              초기 대상 · 민사 승소 판결을 보유한 500만 원 미만 개인 채권자
            </p>
          </div>
          <div className="hero-compass motion-enter" aria-label="집행 판단 구성 요소">
            <div className="compass-orbit orbit-one" />
            <div className="compass-orbit orbit-two" />
            <span className="axis axis-top">근거</span>
            <span className="axis axis-right">비용</span>
            <span className="axis axis-bottom">기간</span>
            <span className="axis axis-left">실익</span>
            <div className="compass-center">
              <FontAwesomeIcon className="compass-needle" icon={faCompass} />
              <strong>다음 행동</strong>
              <small>착수 · 추가 확인 · 보류</small>
            </div>
            <div className="floating-card floating-card-top">
              <StatusBadge tone="info">기준선</StatusBadge>
              <strong>설명 가능한 룰 기반</strong>
            </div>
            <div className="floating-card floating-card-bottom">
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>식별정보는 저장하지 않아요</span>
            </div>
          </div>
        </div>
      </section>

      <section className="eligibility-bar">
        <div className="content-width eligibility-grid">
          <div><FontAwesomeIcon icon={faScaleBalanced} /><span><small>대상</small>민사 승소 채권자</span></div>
          <div><FontAwesomeIcon icon={faBuildingColumns} /><span><small>초기 범위</small>채권액 500만 원 미만</span></div>
          <div><FontAwesomeIcon icon={faFileShield} /><span><small>이용 방식</small>MVP 핵심 기능 무료</span></div>
        </div>
      </section>

      <section className="section content-width">
        <div className="section-heading motion-enter">
          <p className="eyebrow">어떻게 작동하나요?</p>
          <h2>점수보다 먼저, 판단의 근거를 보여드립니다</h2>
          <p>처음부터 결과 기록까지 하나의 사건 흐름으로 연결합니다.</p>
        </div>
        <div className="process-grid">
          {[
            ["01", faClipboardCheck, "사건 조건 입력", "판결과 집행 현황을 직접 입력하고 필요한 변수만 남깁니다."],
            ["02", faLayerGroup, "실익 근거 확인", "유리·불리 요인, 데이터 충분도, 비용·기간의 확인 범위를 봅니다."],
            ["03", faArrowTrendUp, "다음 행동과 결과", "착수·추가 확인·보류를 선택하고 실제 결과를 다시 기록합니다."],
          ].map(([step, icon, title, body]) => (
            <article className="process-card motion-enter" key={String(step)}>
              <span className="step-number">{String(step)}</span>
              <FontAwesomeIcon icon={icon as typeof faCompass} />
              <h3>{String(title)}</h3>
              <p>{String(body)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="content-width trust-grid">
          <div className="section-heading motion-enter">
            <p className="eyebrow">데이터 최소화 원칙</p>
            <h2>사람을 추적하지 않고, 사건의 조건을 봅니다</h2>
            <p>
              특정 채무자의 자산이나 온라인 활동을 추적하지 않습니다. 이름·상세주소·원문은
              분석 변수에 포함하지 않는 것이 기본 원칙입니다.
            </p>
            <Link className="text-link" href="/data-policy">
              데이터 처리 원칙 자세히 보기 <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          <div className="privacy-stack motion-enter">
            <div><FontAwesomeIcon icon={faUserLock} /><span><strong>이름·주민번호</strong><small>저장하지 않음</small></span></div>
            <div><FontAwesomeIcon icon={faDatabase} /><span><strong>정확한 금액·주소</strong><small>구간·광역 단위로 변환</small></span></div>
            <div><FontAwesomeIcon icon={faFileShield} /><span><strong>판결문 원문</strong><small>변수 확인 후 폐기 원칙</small></span></div>
          </div>
        </div>
      </section>

      <section className="section content-width cta-panel motion-enter">
        <div>
          <p className="eyebrow">첫 판단을 시작하세요</p>
          <h2>내 사건에서 지금 확인해야 할 것을 정리해보세요</h2>
          <p>회수 가능성을 보장하지 않습니다. 대신 결정에 필요한 질문을 빠뜨리지 않게 돕습니다.</p>
        </div>
        <Link className="button button-primary button-large" href="/signup">
          무료로 시작하기 <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </section>
    </main>
  )
}

export function AboutScreen() {
  return (
    <main id="main-content" className="content-width page-main">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "서비스 소개" }]} />
      <PageHeader
        eyebrow="서비스 소개"
        title="판결과 회수 사이의 정보 공백을 줄입니다"
        description="승소했지만 어디서부터 무엇을 확인해야 할지 모르는 소액 채권자가 비용을 더 쓰기 전에 판단 근거를 정리하도록 돕습니다."
      />
      <div className="two-column-feature">
        <section className="panel motion-enter">
          <h2>집행나침반이 제공하는 것</h2>
          <ul className="check-list">
            <li><FontAwesomeIcon icon={faCheck} /> 승소 후 일반 절차와 확인사항</li>
            <li><FontAwesomeIcon icon={faCheck} /> 사건 조건 기반의 실익 점수 구간</li>
            <li><FontAwesomeIcon icon={faCheck} /> 유리·불리 요인과 데이터 한계</li>
            <li><FontAwesomeIcon icon={faCheck} /> 집행 계획과 결과 기록 흐름</li>
          </ul>
        </section>
        <section className="panel panel-muted motion-enter">
          <h2>집행나침반이 제공하지 않는 것</h2>
          <ul className="plain-list">
            <li>사건별 법률 자문 또는 강제집행 대행</li>
            <li>회수 성공률이나 특정 결과의 보장</li>
            <li>특정 채무자의 자산·SNS 자동 추적</li>
            <li>검증되지 않은 AI 판단의 단정적 표시</li>
          </ul>
        </section>
      </div>
      <Notice tone="warning" title="아직 검증 중인 MVP입니다">
        실제 사용자 결과가 축적되기 전에는 예측 확률이 아니라 설명 가능한 시범 점수와 구간을 제공합니다.
      </Notice>
    </main>
  )
}

const guideSteps = [
  ["1", "판결 내용과 집행권원 확인", "판결의 확정·집행 가능 여부, 채권의 범위와 소멸시효 관련 사항을 먼저 확인합니다."],
  ["2", "알고 있는 재산 정보 정리", "통장·급여·차량·부동산 등 집행 대상별로 알고 있는 정보와 확인이 필요한 정보를 나눕니다."],
  ["3", "수단별 비용과 기간 확인", "신청 비용, 송달, 현금화 가능성, 예상 기간을 사건별로 확인해 투입 대비 실익을 비교합니다."],
  ["4", "착수·추가 확인·보류 결정", "확인된 근거를 바탕으로 다음 행동을 선택하고 진행 결과를 기록합니다."],
]

export function GuideScreen() {
  return (
    <main id="main-content" className="content-width page-main">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "승소 후 절차" }]} />
      <PageHeader
        eyebrow="승소 후 절차 안내"
        title="강제집행 전에 확인할 네 가지"
        description="사건마다 절차와 비용이 달라질 수 있으므로, 아래 순서를 기본 점검표로 활용하세요."
        actions={<Link className="button button-primary" href="/app/cases/new">내 사건에 적용하기</Link>}
      />
      <ol className="guide-timeline">
        {guideSteps.map(([number, title, body]) => (
          <li className="motion-enter" key={number}>
            <span>{number}</span>
            <div><h2>{title}</h2><p>{body}</p></div>
          </li>
        ))}
      </ol>
      <section className="panel motion-enter">
        <h2>주요 집행 수단 비교 전 확인사항</h2>
        <div className="responsive-table">
          <table>
            <thead><tr><th>수단</th><th>먼저 확인할 정보</th><th>비용·기간 검토</th></tr></thead>
            <tbody>
              <tr><td>채권(통장) 압류</td><td>금융기관 특정 가능 여부, 잔액 가능성</td><td>신청·송달 비용과 추심 가능 시점</td></tr>
              <tr><td>급여 압류</td><td>재직 정보, 압류 제한 범위</td><td>회수 기간과 매월 회수 가능액</td></tr>
              <tr><td>차량·부동산</td><td>소유·담보·선순위 권리</td><td>집행 비용과 실제 배당 가능성</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <Notice tone="warning" title="법률 전문가 확인이 필요한 정보입니다">
        이 화면의 내용은 일반적인 절차 이해를 위한 UI 예시입니다. 실제 신청 전에는 법원 안내 또는 법률 전문가를 통해 최신 요건과 비용을 확인하세요.
      </Notice>
    </main>
  )
}

const faqs = [
  ["집행나침반은 법률 상담 서비스인가요?", "아닙니다. 일반 정보와 의사결정 보조를 제공하며, 사건별 법률 판단이나 집행을 대신하지 않습니다."],
  ["분석 점수가 회수 확률인가요?", "초기 MVP 점수는 공공데이터와 전문가 규칙을 설명 가능한 형태로 조합한 시범 구간입니다. 검증 전에는 성공 확률로 표시하지 않습니다."],
  ["판결문 원문을 계속 보관하나요?", "필요한 변수를 확인한 뒤 원문과 직접식별정보를 저장하지 않는 것을 기본 원칙으로 설계했습니다. 실제 보유기간과 파기 방식은 법률 검토 후 확정합니다."],
  ["결과를 꼭 입력해야 하나요?", "강제는 아닙니다. 다만 결과를 남기면 사건 기록이 완성되고, 다음 이용자의 판단 기준과 모델 검증에 도움이 됩니다."],
  ["500만 원 이상 사건도 사용할 수 있나요?", "초기 MVP는 500만 원 미만 소액 채권에 집중합니다. 지원 범위를 벗어나면 일반 절차와 추가 확인사항만 안내합니다."],
  ["채무자의 재산을 찾아주나요?", "아닙니다. 특정 개인의 자산이나 온라인 활동을 추적·식별하는 기능은 초기 범위에서 제외합니다."],
]

export function FaqScreen() {
  return (
    <main id="main-content" className="content-width page-main narrow-main">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "자주 묻는 질문" }]} />
      <PageHeader eyebrow="FAQ" title="자주 묻는 질문" description="서비스 범위, 점수, 개인정보 처리에 관한 핵심 질문을 모았습니다." />
      <Accordion className="faq-list motion-enter" type="single" collapsible>
        {faqs.map(([question, answer], index) => (
          <AccordionItem value={`faq-${index}`} key={question}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent><p>{answer}</p></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}

const legalContent: Record<string, { title: string; lead: string; sections: Array<[string, string]> }> = {
  terms: {
    title: "이용약관",
    lead: "집행나침반 MVP 이용 조건을 안내합니다.",
    sections: [["서비스의 성격", "본 서비스는 승소 이후의 절차와 판단 요소를 정리하는 정보 제공·의사결정 지원 서비스입니다."], ["이용자의 책임", "입력 정보의 정확성과 최종 집행 결정은 이용자에게 있습니다."], ["서비스 변경", "MVP 검증 과정에서 기능과 지원 범위가 변경될 수 있으며 중요한 변경은 공지합니다."]],
  },
  privacy: {
    title: "개인정보처리방침",
    lead: "회원 정보와 사건 데이터의 처리 원칙을 안내합니다.",
    sections: [["최소 수집", "계정 운영과 사건 분석에 필요한 최소 정보만 처리합니다."], ["분리된 동의", "서비스 이용, 개인정보, 사건정보 처리, 모델 개선, 마케팅 동의를 구분합니다."], ["권리 행사", "이용자는 설정 화면에서 동의 내역을 확인하고 철회·삭제·탈퇴를 요청할 수 있습니다."]],
  },
  disclaimer: {
    title: "서비스 한계·면책",
    lead: "분석 결과를 이용하기 전에 반드시 확인하세요.",
    sections: [["법률 자문 아님", "화면에 표시되는 정보는 변호사나 법무사의 사건별 법률 자문을 대신하지 않습니다."], ["결과 보장 아님", "점수와 권고는 회수 성공, 비용, 기간을 보장하지 않습니다."], ["검증 단계", "초기 점수는 시범 기준선이며 실제 결과 데이터로 지속 검증·보정됩니다."]],
  },
  "data-policy": {
    title: "데이터 처리 원칙",
    lead: "개인을 추적하지 않고 사건의 조건을 분석하기 위한 기준입니다.",
    sections: [["저장하지 않는 정보", "이름, 주민번호, 상세주소, 판결문 원문은 분석 데이터로 저장하지 않는 것을 원칙으로 합니다."], ["변환하는 정보", "정확한 금액은 구간으로, 주소는 광역 지역으로, 날짜는 경과 기간으로 변환합니다."], ["금지 경계", "특정 채무자의 SNS 추적, 개인 소유 자산 자동 식별, 무응답의 실패 확정은 하지 않습니다."]],
  },
}

export function LegalScreen({ type }: { type: keyof typeof legalContent }) {
  const content = legalContent[type]
  return (
    <main id="main-content" className="content-width page-main narrow-main legal-page">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: content.title }]} />
      <PageHeader title={content.title} description={content.lead} />
      <Notice tone="warning" title="MVP 초안 · 법률 검토 전">
        실제 서비스 공개 전 변호사·개인정보 전문가 검토와 운영정책 확정이 필요합니다.
      </Notice>
      {content.sections.map(([title, body], index) => (
        <section className="legal-section motion-enter" key={title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><h2>{title}</h2><p>{body}</p></div>
        </section>
      ))}
    </main>
  )
}

export function NoticesScreen() {
  return (
    <main id="main-content" className="content-width page-main">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "공지사항" }]} />
      <PageHeader title="공지사항" description="집행나침반 MVP의 변경사항과 운영 안내입니다." />
      <div className="notice-list panel motion-enter">
        <article><StatusBadge tone="info">안내</StatusBadge><div><h2>MVP 화면 프로토타입을 공개했습니다</h2><p>2026.08.29 · 핵심 사용자 흐름과 데이터 처리 원칙을 확인할 수 있습니다.</p></div></article>
      </div>
    </main>
  )
}
