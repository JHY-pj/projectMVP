# 집행나침반 MVP

민사 승소 소액 채권자가 강제집행에 추가 비용을 투입하기 전에 사건 조건과 공개 데이터를 바탕으로 집행 실익의 근거, 예상 부담, 다음 확인사항을 이해하도록 돕는 의사결정 지원 서비스입니다.

> 이 서비스는 법률 자문이나 채권 회수를 보장하지 않습니다. 현재 분석 결과는 검증 전 룰 기반 시범 점수입니다.

## 구현 범위

- 공개 홈, 서비스 소개, 승소 후 절차, FAQ, 법적 고지
- Supabase 이메일 회원가입·로그인·이메일 인증·비밀번호 재설정
- 필수·선택 동의를 분리한 온보딩
- 6단계 사건 등록과 비식별 변수 확인
- 회원 대시보드, 사건 상세, 실익 리포트, 체크리스트
- 진행 상태·최종 결과 입력, 알림함, 계정·동의 설정
- 관리자 운영 현황, 사건·문서·결과 라벨 검수 화면
- KRDS 기반 접근성·정보 구조, GSAP 전환, Font Awesome 아이콘

## 기술 구성

- Next.js 16 / React 19 / TypeScript
- Vinext / Cloudflare Sites 호환 빌드
- Supabase Auth + RLS 기반 회원 데이터
- GSAP
- Font Awesome
- Shadcn UI primitives

## 로컬 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.local`에 아래 공개 클라이언트 값을 설정합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

`service_role` 또는 secret key는 브라우저 코드와 `NEXT_PUBLIC_` 환경변수에 넣지 않습니다.

## 검증

```bash
npm run lint
npm run build
```

## 주요 경로

- `/` 공개 홈
- `/signup`, `/login`, `/onboarding` 인증·동의
- `/app` 회원 대시보드
- `/app/cases/new` 사건 등록
- `/app/cases/demo-2026/report` 실익 리포트 예시
- `/admin` 운영 대시보드

## 후속 연결

- Supabase Auth Site URL과 이메일 Redirect URL 확정
- 판결문 파싱 API와 단기 보관·폐기 작업 연결
- 사건·집행·결과 스키마와 RLS 연결
- 관리자 `profiles.role` 서버 검증
- 법률·개인정보 안내문 전문가 검토
