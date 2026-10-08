# 집행나침반 Backend

FastAPI 서버: 민사 상담 챗봇과 판결문 PDF 형식 검증을 제공합니다.

## 실행 (PowerShell)

프로젝트 루트에서:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item ..\.env.example .env
# .env의 OPENAI_API_KEY 값을 설정
uvicorn main:api --reload --port 8000
```

- 상태: `GET /health`
- 상담: `POST /chat`
- 상담 요약: `POST /summary`
- 판결문 형식 검사: `POST /documents/validate-judgment` (multipart `file`, PDF 최대 10MB)

판결문 검사는 PDF 텍스트 구조 기반의 1차 분류입니다. 진위·확정 여부는 보증하지 않으며 스캔본은 별도 확인이 필요합니다. 파일은 검사 시 메모리에서 처리하며 별도 저장하지 않습니다.

웹 클라이언트의 `VITE_CHATBOT_API_URL=http://127.0.0.1:8000/chat` 설정은 그대로 사용합니다. 판결문 검증 화면은 현재 `http://localhost:8000`을 호출합니다.

## 데이터

- `data/dummy_cases.csv`: 120건의 합성 시뮬레이션 사건 데이터입니다. 실제 판결문이나 사용자 사건 정보가 아니며 분석 정확도를 증명하지 않습니다.
- 경로는 백엔드 기준 `backend/data/dummy_cases.csv`입니다.
