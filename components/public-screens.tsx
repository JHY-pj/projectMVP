import { IconListItem } from "@/components/common/icon-list-item"
import styles from "@/components/public/public-ui.module.css"
import { clsx } from "clsx"
import { HomeHero, HowItWorks, PrivacyPrinciples, StartCase } from "@/components/public/home-sections"
import { CheckList, PlainList, GuideTimeline, GuideStep } from "@/components/public/public-ui"


import { EligibilityBar } from "@/components/public/eligibility-bar"

import { PageLayout, Surface, TableContainer, ResponsiveGrid } from "@/components/common/primitives"

import { Button } from "@/components/ui/button"
import { LegalDocumentContent, legalContent, type LegalType } from "@/components/legal/legal-content"

import { Breadcrumbs, Notice, PageHeader, StatusBadge } from "@/components/screen-kit"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@/lib/fontawesome"
import Link from "next/link"

export function HomeScreen() {
  return (
    <main id="main-content">
      <HomeHero />

      <EligibilityBar />

      <HowItWorks />

      <PrivacyPrinciples />

      <StartCase />
    </main>
  )
}

export function AboutScreen() {
  return (
    <PageLayout id="main-content">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "서비스 소개" }]} />
      <PageHeader
        title="판결과 회수 사이의 정보 공백을 줄입니다"
        description="승소했지만 어디서부터 무엇을 확인해야 할지 모르는 소액 채권자가 비용을 더 쓰기 전에 판단 근거를 정리하도록 돕습니다."
      />
      <ResponsiveGrid>
        <Surface className={"motion-enter"}>
          <h2>집행나침반이 제공하는 것</h2>
          <CheckList>
            <IconListItem variant="default" icon={<FontAwesomeIcon icon={faCheck} />}> 승소 후 일반 절차와 확인사항</IconListItem>
            <IconListItem variant="default" icon={<FontAwesomeIcon icon={faCheck} />}> 사건 조건 기반의 실익 점수 구간</IconListItem>
            <IconListItem variant="default" icon={<FontAwesomeIcon icon={faCheck} />}> 유리·불리 요인과 데이터 한계</IconListItem>
            <IconListItem variant="default" icon={<FontAwesomeIcon icon={faCheck} />}> 집행 계획과 결과 기록 흐름</IconListItem>
          </CheckList>
        </Surface>
        <Surface muted className={"motion-enter"}>
          <h2>집행나침반이 제공하지 않는 것</h2>
          <PlainList>
            <li>사건별 법률 자문 또는 강제집행 대행</li>
            <li>회수 성공률이나 특정 결과의 보장</li>
            <li>특정 채무자의 자산·SNS 자동 추적</li>
            <li>검증되지 않은 AI 판단의 단정적 표시</li>
          </PlainList>
        </Surface>
      </ResponsiveGrid>
      <Notice tone="warning" title="아직 검증 중인 MVP입니다">
        실제 사용자 결과가 축적되기 전에는 예측 확률이 아니라 설명 가능한 시범 점수와 구간을 제공합니다.
      </Notice>
    </PageLayout>
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
    <PageLayout id="main-content">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "승소 후 절차" }]} />
      <PageHeader
        eyebrow="승소 후 절차 안내"
        title="강제집행 전에 확인할 네 가지"
        description="사건마다 절차와 비용이 달라질 수 있으므로, 아래 순서를 기본 점검표로 활용하세요."
        actions={<Button asChild variant="default" size="default"><Link href="/app/cases/new">내 사건에 적용하기</Link></Button>}
      />
      <GuideTimeline>
        {guideSteps.map(([number, title, body]) => (
          <GuideStep key={number} number={number} title={title}>{body}</GuideStep>
        ))}
      </GuideTimeline>
      <Surface className={"motion-enter"}>
        <h2>주요 집행 수단 비교 전 확인사항</h2>
        <TableContainer>
          <table>
            <thead><tr><th>수단</th><th>먼저 확인할 정보</th><th>비용·기간 검토</th></tr></thead>
            <tbody>
              <tr><td>채권(통장) 압류</td><td>금융기관 특정 가능 여부, 잔액 가능성</td><td>신청·송달 비용과 추심 가능 시점</td></tr>
              <tr><td>급여 압류</td><td>재직 정보, 압류 제한 범위</td><td>회수 기간과 매월 회수 가능액</td></tr>
              <tr><td>차량·부동산</td><td>소유·담보·선순위 권리</td><td>집행 비용과 실제 배당 가능성</td></tr>
            </tbody>
          </table>
        </TableContainer>
      </Surface>
      <Notice tone="warning" title="법률 전문가 확인이 필요한 정보입니다">
        이 화면의 내용은 일반적인 절차 이해를 위한 UI 예시입니다. 실제 신청 전에는 법원 안내 또는 법률 전문가를 통해 최신 요건과 비용을 확인하세요.
      </Notice>
    </PageLayout>
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
    <PageLayout width="reading" id="main-content">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "자주 묻는 질문" }]} />
      <PageHeader eyebrow="FAQ" title="자주 묻는 질문" description="서비스 범위, 점수, 개인정보 처리에 관한 핵심 질문을 모았습니다." />
      <Accordion className={clsx(styles["faq-list"], "motion-enter")} type="single" collapsible>
        {faqs.map(([question, answer], index) => (
          <AccordionItem value={`faq-${index}`} key={question}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent><p>{answer}</p></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageLayout>
  )
}

export function LegalScreen({ type }: { type: LegalType }) {
  const content = legalContent[type]
  return (
    <PageLayout width="reading" id="main-content" className={styles["legal-page"]}>
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: content.title }]} />
      <PageHeader title={content.title} description={content.lead} />
      <Notice tone="warning" title="MVP 초안 · 법률 검토 전">
        실제 서비스 공개 전 변호사·개인정보 전문가 검토와 운영정책 확정이 필요합니다.
      </Notice>
      <LegalDocumentContent type={type} />
    </PageLayout>
  )
}

export function NoticesScreen() {
  return (
    <PageLayout id="main-content">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "공지사항" }]} />
      <PageHeader title="공지사항" description="집행나침반 MVP의 변경사항과 운영 안내입니다." />
      <Surface as="div" className={clsx(styles["notice-list"], "motion-enter")}>
        <article><StatusBadge tone="info">안내</StatusBadge><div><h2>MVP 화면 프로토타입을 공개했습니다</h2><p>2026.08.29 · 핵심 사용자 흐름과 데이터 처리 원칙을 확인할 수 있습니다.</p></div></article>
      </Surface>
    </PageLayout>
  )
}
