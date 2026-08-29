"use client"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faBell,
  faCircleExclamation,
  faClockRotateLeft,
  faFileCircleQuestion,
  faFileShield,
  faListCheck,
  faMagnifyingGlass,
  faShieldHalved,
  faSliders,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Notice, PageHeader, StatusBadge } from "@/components/screen-kit"

const queues = [
  ["신규 사건", "12", "오늘 등록", faListCheck, "info"],
  ["파싱 실패", "3", "재처리 필요", faCircleExclamation, "negative"],
  ["검수 대기", "7", "48시간 내 처리", faClockRotateLeft, "warning"],
  ["권리 요청", "2", "삭제 1 · 정정 1", faUserShield, "neutral"],
] as const

export function AdminDashboardScreen() {
  return (
    <main id="main-content" className="content-width page-main admin-main">
      <PageHeader eyebrow="운영 대시보드" title="오늘 처리할 일을 확인하세요" description="원문 접근과 역할 권한을 최소화하고, 비식별 데이터 검수와 권리 요청을 우선 처리합니다." />
      <section className="admin-metrics motion-enter">
        {queues.map(([label, value, hint, icon, tone]) => <article key={label}><span className={`metric-icon metric-${tone}`}><FontAwesomeIcon icon={icon} /></span><div><small>{label}</small><strong>{value}</strong><p>{hint}</p></div></article>)}
      </section>
      <div className="admin-grid">
        <section className="panel motion-enter">
          <div className="panel-heading"><div><p className="eyebrow">우선 처리</p><h2>검수 대기 사건</h2></div><Link href="/admin/cases">전체 보기</Link></div>
          <Table className="admin-table">
            <TableHeader><TableRow><TableHead>사건 ID</TableHead><TableHead>단계</TableHead><TableHead>상태</TableHead><TableHead>대기</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              <TableRow><TableCell>EC-2026-0012</TableCell><TableCell>비식별 변수</TableCell><TableCell><StatusBadge tone="warning">검수 대기</StatusBadge></TableCell><TableCell>2시간</TableCell><TableCell><Link href="/admin/review">검수</Link></TableCell></TableRow>
              <TableRow><TableCell>EC-2026-0009</TableCell><TableCell>파싱·마스킹</TableCell><TableCell><StatusBadge tone="negative">오류</StatusBadge></TableCell><TableCell>5시간</TableCell><TableCell><Link href="/admin/review">확인</Link></TableCell></TableRow>
              <TableRow><TableCell>EC-2026-0007</TableCell><TableCell>결과 라벨</TableCell><TableCell><StatusBadge tone="info">확인 필요</StatusBadge></TableCell><TableCell>1일</TableCell><TableCell><Link href="/admin/labels">라벨</Link></TableCell></TableRow>
            </TableBody>
          </Table>
        </section>
        <aside className="panel motion-enter"><div className="panel-heading"><h2>보안 운영 상태</h2><StatusBadge tone="positive">정상</StatusBadge></div><ul className="security-checks"><li><FontAwesomeIcon icon={faShieldHalved} /><span><strong>공개 테이블 RLS</strong><small>5/5 적용</small></span></li><li><FontAwesomeIcon icon={faFileShield} /><span><strong>원문 폐기 확인</strong><small>대기 1건</small></span></li><li><FontAwesomeIcon icon={faUserShield} /><span><strong>권한 변경</strong><small>최근 변경 없음</small></span></li></ul><Link className="text-link" href="/admin/audit-logs">감사 로그 확인 <FontAwesomeIcon icon={faArrowRight} /></Link></aside>
      </div>
      <Notice tone="warning" title="관리자 권한 분리 필요">프로토타입 화면입니다. 운영 배포 전 `profiles.role`의 `app_metadata` 기반 서버 검증과 관리자 라우트 가드를 연결해야 합니다.</Notice>
    </main>
  )
}

export function AdminCasesScreen() {
  return (
    <main id="main-content" className="content-width page-main admin-main">
      <PageHeader eyebrow="사건 관리" title="비식별 사건 검수" description="직접식별정보 없이 처리 상태, 분석 변수, 검수 이력을 확인합니다." />
      <div className="toolbar motion-enter"><label className="search-field"><FontAwesomeIcon icon={faMagnifyingGlass} /><input placeholder="사건 ID 검색" /></label><select aria-label="처리 상태"><option>모든 처리 상태</option><option>검수 대기</option><option>분석 가능</option><option>지원 제외</option></select><select aria-label="결과 상태"><option>모든 결과 상태</option><option>진행 중</option><option>확정 결과</option><option>미확정</option></select><button className="button button-outline"><FontAwesomeIcon icon={faSliders} /> 필터</button></div>
      <section className="panel motion-enter">
        <Table className="admin-table">
          <TableHeader><TableRow><TableHead>사건 ID</TableHead><TableHead>유형·금액</TableHead><TableHead>처리 상태</TableHead><TableHead>결과 상태</TableHead><TableHead>출처</TableHead><TableHead>등록일</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {[['EC-2026-0012','대여금 · 300~500만','검수 대기','진행 중','사용자','08.29'],['EC-2026-0009','매매대금 · 100~300만','파싱 오류','미확정','문서','08.29'],['EC-2026-0007','대여금 · 100만 미만','분석 가능','일부 회수','사용자','08.28'],['EC-2026-0004','공사대금 · 300~500만','지원 제외','중단','사용자','08.26']].map((row) => <TableRow key={row[0]}>{row.map((cell,index) => <TableCell key={`${row[0]}-${index}`}>{index===2?<StatusBadge tone={cell==='분석 가능'?'positive':cell==='파싱 오류'?'negative':cell==='검수 대기'?'warning':'neutral'}>{cell}</StatusBadge>:cell}</TableCell>)}<TableCell><Link href="/admin/review">열기</Link></TableCell></TableRow>)}
          </TableBody>
        </Table>
      </section>
    </main>
  )
}

export function AdminReviewScreen() {
  return (
    <main id="main-content" className="content-width page-main admin-main">
      <PageHeader eyebrow="문서 처리 검수" title="EC-2026-0012" description="마스킹 상태와 비식별 변수를 확인합니다. 원문 접근은 최소 인원·단기 보관 원칙을 적용합니다." />
      <div className="review-workspace motion-enter">
        <section className="document-placeholder"><div><FontAwesomeIcon icon={faFileCircleQuestion} /><h2>원문 미리보기 제한</h2><p>검수 권한과 보유기간 확인 후에만 일시적으로 표시됩니다.</p><StatusBadge tone="positive">직접식별정보 마스킹 100%</StatusBadge></div></section>
        <section className="panel form-stack"><div className="panel-heading"><h2>추출 변수</h2><StatusBadge tone="warning">확인 2건</StatusBadge></div><label className="field"><span>사건 유형</span><select defaultValue="loan"><option value="loan">대여금</option><option value="other">기타</option></select></label><label className="field"><span>금액 구간</span><select defaultValue="300"><option value="300">300만~500만 원</option></select></label><label className="field"><span>지역</span><select defaultValue="capital"><option value="capital">수도권</option></select></label><label className="field"><span>오류·제외 사유</span><textarea placeholder="필요한 경우에만 기록" /></label><label className="checkbox-row"><input type="checkbox" /><span>검수 완료 후 원문 폐기 상태를 확인했습니다.</span></label><div className="inline-actions"><button className="button button-outline" onClick={()=>toast.info('수정 요청으로 저장했습니다.')}>수정 요청</button><button className="button button-primary" onClick={()=>toast.success('검수가 완료되었습니다.')}>검수 완료</button></div></section>
      </div>
    </main>
  )
}

export function AdminLabelsScreen() {
  return (
    <main id="main-content" className="content-width page-main admin-main">
      <PageHeader eyebrow="결과·라벨 관리" title="확정 결과와 미확정 상태를 분리합니다" description="사용자 직접 입력과 추정 출처를 구분하고, 장기 미응답은 실패가 아닌 unresolved로 유지합니다." />
      <section className="label-summary motion-enter"><article><small>확정 결과</small><strong>18</strong><StatusBadge tone="positive">학습 우선</StatusBadge></article><article><small>진행 중</small><strong>24</strong><StatusBadge tone="info">추적 중</StatusBadge></article><article><small>미확정</small><strong>9</strong><StatusBadge tone="neutral">학습 제외</StatusBadge></article></section>
      <section className="panel motion-enter"><Table className="admin-table"><TableHeader><TableRow><TableHead>사건 ID</TableHead><TableHead>결과</TableHead><TableHead>결과 출처</TableHead><TableHead>신뢰 가중치</TableHead><TableHead>확정일</TableHead><TableHead>학습 사용</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>EC-2026-0007</TableCell><TableCell><StatusBadge tone="positive">success_partial</StatusBadge></TableCell><TableCell>user</TableCell><TableCell>1.0</TableCell><TableCell>08.28</TableCell><TableCell>포함</TableCell></TableRow><TableRow><TableCell>EC-2026-0003</TableCell><TableCell><StatusBadge>unresolved</StatusBadge></TableCell><TableCell>inferred</TableCell><TableCell>—</TableCell><TableCell>—</TableCell><TableCell>제외</TableCell></TableRow></TableBody></Table></section>
    </main>
  )
}

const adminCopy: Record<string, [string,string,string]> = {
  scoring: ["점수 규칙 관리", "룰 버전 MVP-0.1", "변수 설명, 배포·중단 상태와 변경 이력을 관리하는 P1 화면입니다."],
  users: ["사용자·동의 관리", "회원과 동의 이력", "역할·계정 상태는 서버 관리 값으로 분리하며 사용자 입력값으로 인가하지 않습니다."],
  reminders: ["알림 운영", "30일·60일 결과 추적", "진행 중 사건의 상태 확인 알림과 미응답 상태를 관리합니다."],
  requests: ["문의·권리 요청", "열람·정정·삭제·철회", "본인 확인과 처리 기한을 기준으로 개인정보 권리 요청을 관리합니다."],
  "audit-logs": ["감사 로그", "권한과 데이터 변경 이력", "관리자 접근, 정책 변경, 검수·삭제 처리를 시간순으로 기록합니다."],
}

export function AdminGenericScreen({ type }: { type: keyof typeof adminCopy }) {
  const [eyebrow,title,description] = adminCopy[type]
  const icon = type === 'reminders' ? faBell : type === 'requests' ? faUserShield : type === 'scoring' ? faSliders : faShieldHalved
  return <main id="main-content" className="content-width page-main admin-main"><PageHeader eyebrow={eyebrow} title={title} description={description} /><section className="empty-state panel motion-enter"><span><FontAwesomeIcon icon={icon} /></span><h2>P1 운영 화면 골격</h2><p>사이트맵·IA에 정의된 권한과 상태를 기준으로 화면 구조를 준비했습니다. 실제 목록 데이터와 서버 액션은 다음 구현 단계에서 연결합니다.</p><Link className="button button-outline" href="/admin">운영 대시보드로</Link></section></main>
}
