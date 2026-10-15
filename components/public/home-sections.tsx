import {
  uiClass,
  HeroSection,
  HeroGrid,
  HeroCopy,
  HeroDescription,
  HeroActions,
  HeroFootnote,
  HeroCompass,
  CompassOrbit,
  Axis,
  CompassCenter,
  FloatingCard,
  PublicSection,
  ProcessGrid,
  ProcessCard,
  StepNumber,
  TrustGrid,
  PrivacyStack,
} from "@/components/public/public-ui"
import { CallToAction } from "@/components/common/call-to-action"
import { SectionHeading } from "@/components/screen-kit"


import { Button } from "@/components/ui/button"

import { StatusBadge } from "@/components/screen-kit"

import {
  faArrowRight,
  faArrowTrendUp,
  faClipboardCheck,
  faCompass,
  faDatabase,
  faFileShield,
  faLayerGroup,
  faShieldHalved,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@/lib/fontawesome"
import Link from "next/link"

export function HomeHero() {
  return (<HeroSection>
        <HeroGrid className={uiClass("content-width")}>
          <HeroCopy>
            <div className={uiClass("eyebrow motion-enter")}>
              승소 이후의 다음 판단
            </div>
            <h1 className={uiClass("motion-enter")}>
              판결은 끝났지만,
              <br />
              <em>회수는 아직</em>이라면
            </h1>
            <HeroDescription className={uiClass("motion-enter")}>
              사건 조건과 공개 데이터를 바탕으로 집행 실익의 근거, 예상 부담,
              다음 확인사항을 한곳에서 정리해드립니다.
            </HeroDescription>
            <HeroActions className={uiClass("motion-enter")}>
              <Button asChild variant="default" size="lg"><Link href="/app/cases/new">
                내 사건 분석 시작 <FontAwesomeIcon icon={faArrowRight} />
              </Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="/guide">
                승소 후 절차 보기
              </Link></Button>
            </HeroActions>
            <HeroFootnote className={uiClass("motion-enter")}>
              초기 대상 · 민사 승소 판결을 보유한 500만 원 미만 개인 채권자
            </HeroFootnote>
          </HeroCopy>
          <HeroCompass className={uiClass("motion-enter")} aria-label="집행 판단 구성 요소">
            <CompassOrbit className={uiClass("orbit-one")} />
            <CompassOrbit className={uiClass("orbit-two")} />
            <Axis className={uiClass("axis-top")}>근거</Axis>
            <Axis className={uiClass("axis-right")}>비용</Axis>
            <Axis className={uiClass("axis-bottom")}>기간</Axis>
            <Axis className={uiClass("axis-left")}>실익</Axis>
            <CompassCenter>
              <FontAwesomeIcon className={uiClass("compass-needle")} icon={faCompass} />
              <strong>다음 행동</strong>
              <small>착수 · 추가 확인 · 보류</small>
            </CompassCenter>
            <FloatingCard className={uiClass("floating-card-top")}>
              <StatusBadge tone="info">기준선</StatusBadge>
              <strong>설명 가능한 룰 기반</strong>
            </FloatingCard>
            <FloatingCard className={uiClass("floating-card-bottom")}>
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>식별정보는 저장하지 않아요</span>
            </FloatingCard>
          </HeroCompass>
        </HeroGrid>
      </HeroSection>)
}

export function HowItWorks() {
  return (<PublicSection className={uiClass("content-width")}>
        <SectionHeading className={uiClass("motion-enter")}>
          <p className={uiClass("eyebrow")}>어떻게 작동하나요?</p>
          <h2>점수보다 먼저, 판단의 근거를 보여드립니다</h2>
          <p>처음부터 결과 기록까지 하나의 사건 흐름으로 연결합니다.</p>
        </SectionHeading>
        <ProcessGrid>
          {[
            ["01", faClipboardCheck, "사건 조건 입력", "판결과 집행 현황을 직접 입력하고 필요한 변수만 남깁니다."],
            ["02", faLayerGroup, "실익 근거 확인", "유리·불리 요인, 데이터 충분도, 비용·기간의 확인 범위를 봅니다."],
            ["03", faArrowTrendUp, "다음 행동과 결과", "착수·추가 확인·보류를 선택하고 실제 결과를 다시 기록합니다."],
          ].map(([step, icon, title, body]) => (
            <ProcessCard className={uiClass("motion-enter")} key={String(step)}>
              <StepNumber>{String(step)}</StepNumber>
              <FontAwesomeIcon icon={icon as typeof faCompass} />
              <h3>{String(title)}</h3>
              <p>{String(body)}</p>
            </ProcessCard>
          ))}
        </ProcessGrid>
      </PublicSection>)
}

export function PrivacyPrinciples() {
  return (<PublicSection className={uiClass("section-soft")}>
        <TrustGrid className={uiClass("content-width")}>
          <SectionHeading className={uiClass("motion-enter")}>
            <p className={uiClass("eyebrow")}>데이터 최소화 원칙</p>
            <h2>사람을 추적하지 않고, 사건의 조건을 봅니다</h2>
            <p>
              특정 채무자의 자산이나 온라인 활동을 추적하지 않습니다. 이름·상세주소·원문은
              분석 변수에 포함하지 않는 것이 기본 원칙입니다.
            </p>
            <Button asChild variant="link" size="sm"><Link href="/data-policy">
              데이터 처리 원칙 자세히 보기 <FontAwesomeIcon icon={faArrowRight} />
            </Link></Button>
          </SectionHeading>
          <PrivacyStack className={uiClass("motion-enter")}>
            <div><FontAwesomeIcon icon={faUserLock} /><span><strong>이름·주민번호</strong><small>저장하지 않음</small></span></div>
            <div><FontAwesomeIcon icon={faDatabase} /><span><strong>정확한 금액·주소</strong><small>구간·광역 단위로 변환</small></span></div>
            <div><FontAwesomeIcon icon={faFileShield} /><span><strong>판결문 원문</strong><small>변수 확인 후 폐기 원칙</small></span></div>
          </PrivacyStack>
        </TrustGrid>
      </PublicSection>)
}

export function StartCase() {
  return (<PublicSection className={uiClass("content-width")}>
        <CallToAction className={uiClass("motion-enter")}>
          <div>
            <p className={uiClass("eyebrow")}>첫 판단을 시작하세요</p>
            <h2>내 사건에서 지금 확인해야 할 것을 정리해보세요</h2>
            <p>회수 가능성을 보장하지 않습니다. 대신 결정에 필요한 질문을 빠뜨리지 않게 돕습니다.</p>
          </div>
          <Button asChild variant="default" size="lg"><Link href="/app/cases/new">
            무료로 시작하기 <FontAwesomeIcon icon={faArrowRight} />
          </Link></Button>
        </CallToAction>
      </PublicSection>)
}
