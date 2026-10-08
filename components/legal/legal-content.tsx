export type LegalType = "terms" | "privacy" | "disclaimer" | "data-policy"

export const legalContent: Record<LegalType, { title: string; lead: string; sections: Array<[string, string]> }> = {
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


export function LegalDocumentContent({ type }: { type: LegalType }) {
  return <>{legalContent[type].sections.map(([title, body], index) => (
    <section className="legal-section motion-enter" key={title}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div><h2>{title}</h2><p>{body}</p></div>
    </section>
  ))}</>
}

export function TermsContent() { return <LegalDocumentContent type="terms" /> }
export function PrivacyContent() { return <LegalDocumentContent type="privacy" /> }
