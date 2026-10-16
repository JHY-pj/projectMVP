import { ProcessCard, PrivacyItem } from "@/components/public/public-ui"
import styles from "@/components/public/public-ui.module.css"
import { clsx } from "clsx"
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
  return (<section className={styles["hero-section"]}>
        <div className={clsx(styles["hero-grid"], "content-width")}>
          <div className={styles["hero-copy"]}>
            <div className={clsx("eyebrow", "motion-enter")}>
              승소 이후의 다음 판단
            </div>
            <h1 className="motion-enter">
              판결은 끝났지만,
              <br />
              <em>회수는 아직</em>이라면
            </h1>
            <p className={clsx(styles["hero-description"], "motion-enter")}>
              사건 조건과 공개 데이터를 바탕으로 집행 실익의 근거, 예상 부담,
              다음 확인사항을 한곳에서 정리해드립니다.
            </p>
            <div className={clsx(styles["hero-actions"], "motion-enter")}>
              <Button asChild variant="default" size="lg"><Link href="/app/cases/new">
                내 사건 분석 시작 <FontAwesomeIcon icon={faArrowRight} />
              </Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="/guide">
                승소 후 절차 보기
              </Link></Button>
            </div>
            <p className={clsx(styles["hero-footnote"], "motion-enter")}>
              초기 대상 · 민사 승소 판결을 보유한 500만 원 미만 개인 채권자
            </p>
          </div>
          <div className={clsx(styles["hero-compass"], "motion-enter")} aria-label="집행 판단 구성 요소">
            <div className={clsx(styles["compass-orbit"], styles["orbit-one"])} />
            <div className={clsx(styles["compass-orbit"], styles["orbit-two"])} />
            <span className={clsx(styles["axis"], styles["axis-top"])}>근거</span>
            <span className={clsx(styles["axis"], styles["axis-right"])}>비용</span>
            <span className={clsx(styles["axis"], styles["axis-bottom"])}>기간</span>
            <span className={clsx(styles["axis"], styles["axis-left"])}>실익</span>
            <div className={styles["compass-center"]}>
              <FontAwesomeIcon className="compass-needle" icon={faCompass} />
              <strong>다음 행동</strong>
              <small>착수 · 추가 확인 · 보류</small>
            </div>
            <div className={clsx(styles["floating-card"], styles["floating-card-top"])}>
              <StatusBadge tone="info">기준선</StatusBadge>
              <strong>설명 가능한 룰 기반</strong>
            </div>
            <div className={clsx(styles["floating-card"], styles["floating-card-bottom"])}>
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>식별정보는 저장하지 않아요</span>
            </div>
          </div>
        </div>
      </section>)
}

export function HowItWorks() {
  return (<section className={clsx(styles["section"], "content-width")}>
        <SectionHeading className="motion-enter">
          <p className="eyebrow">어떻게 작동하나요?</p>
          <h2>점수보다 먼저, 판단의 근거를 보여드립니다</h2>
          <p>처음부터 결과 기록까지 하나의 사건 흐름으로 연결합니다.</p>
        </SectionHeading>
        <div className={styles["process-grid"]}>
          {[
            ["01", faClipboardCheck, "사건 조건 입력", "판결과 집행 현황을 직접 입력하고 필요한 변수만 남깁니다."],
            ["02", faLayerGroup, "실익 근거 확인", "유리·불리 요인, 데이터 충분도, 비용·기간의 확인 범위를 봅니다."],
            ["03", faArrowTrendUp, "다음 행동과 결과", "착수·추가 확인·보류를 선택하고 실제 결과를 다시 기록합니다."],
          ].map(([step, icon, title, body]) => (
            <ProcessCard key={String(step)} step={String(step)} icon={<FontAwesomeIcon icon={icon as typeof faCompass} />} title={String(title)}>{String(body)}</ProcessCard>
          ))}
        </div>
      </section>)
}

export function PrivacyPrinciples() {
  return (<section className={clsx(styles["section"], styles["section-soft"])}>
        <div className={clsx(styles["trust-grid"], "content-width")}>
          <SectionHeading className="motion-enter">
            <p className="eyebrow">데이터 최소화 원칙</p>
            <h2>사람을 추적하지 않고, 사건의 조건을 봅니다</h2>
            <p>
              특정 채무자의 자산이나 온라인 활동을 추적하지 않습니다. 이름·상세주소·원문은
              분석 변수에 포함하지 않는 것이 기본 원칙입니다.
            </p>
            <Button asChild variant="link" size="sm"><Link href="/data-policy">
              데이터 처리 원칙 자세히 보기 <FontAwesomeIcon icon={faArrowRight} />
            </Link></Button>
          </SectionHeading>
          <div className={clsx(styles["privacy-stack"], "motion-enter")}>
            <PrivacyItem icon={<FontAwesomeIcon icon={faUserLock} />} title="이름·주민번호" detail="저장하지 않음" />
            <PrivacyItem icon={<FontAwesomeIcon icon={faDatabase} />} title="정확한 금액·주소" detail="구간·광역 단위로 변환" />
            <PrivacyItem icon={<FontAwesomeIcon icon={faFileShield} />} title="판결문 원문" detail="변수 확인 후 폐기 원칙" />
          </div>
        </div>
      </section>)
}

export function StartCase() {
  return (<section className={clsx(styles["section"], "content-width")}>
        <CallToAction className="motion-enter">
          <div>
            <p className="eyebrow">첫 판단을 시작하세요</p>
            <h2>내 사건에서 지금 확인해야 할 것을 정리해보세요</h2>
            <p>회수 가능성을 보장하지 않습니다. 대신 결정에 필요한 질문을 빠뜨리지 않게 돕습니다.</p>
          </div>
          <Button asChild variant="default" size="lg"><Link href="/app/cases/new">
            무료로 시작하기 <FontAwesomeIcon icon={faArrowRight} />
          </Link></Button>
        </CallToAction>
      </section>)
}
