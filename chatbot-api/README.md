# 고객센터 챗봇 API

첨부한 LangGraph 기반 민사 안내 챗봇을 웹 화면에서 호출하기 위한 FastAPI 서버입니다.

## 실행

```powershell
cd chatbot-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:api --reload --port 8000
```

`.env`에 `OPENAI_API_KEY`를 입력합니다. 키는 Git에 커밋하지 않습니다.

## 화면 연결

프로젝트 루트의 `.env.local`:

```env
VITE_CHATBOT_API_URL=http://127.0.0.1:8000/chat
```

- 상태 확인: `http://127.0.0.1:8000/health`
- 채팅: `POST /chat`
- 개조식 요약: `POST /summary`
