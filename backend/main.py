"""집행나침반 통합 FastAPI 진입점."""
import os
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from chatbot.service import ChatRequest, ChatResponse, SummaryRequest, SummaryResponse, chatbot, conversation_to_text, llm
from documents.validator import classify_judgment_pdf, MAX_PDF_BYTES

api = FastAPI(title="집행나침반 Backend API", version="0.1.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "BACKEND_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
api.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@api.post("/documents/validate-judgment")
async def validate_judgment(file: UploadFile = File(...)) -> dict:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="PDF 파일만 업로드할 수 있습니다.")
    data = await file.read(MAX_PDF_BYTES + 1)
    if len(data) > MAX_PDF_BYTES:
        raise HTTPException(status_code=413, detail="PDF 파일은 10MB 이하여야 합니다.")
    return classify_judgment_pdf(data)

@api.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model": os.getenv("OPENAI_MODEL", "gpt-5.6-luna")}

@api.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    try:
        result = chatbot.invoke(
            {
                "question": request.question.strip(),
                "conversation_context": conversation_to_text(request.history),
            }
        )
        answer = str(result.get("answer", "")).strip()
        if not answer:
            raise ValueError("빈 답변이 생성되었습니다.")
        return ChatResponse(answer=answer)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="상담 답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        ) from error

@api.post("/summary", response_model=SummaryResponse)
def summary(request: SummaryRequest) -> SummaryResponse:
    conversation = conversation_to_text(request.history)
    try:
        result = llm.invoke(f"""
당신은 민사 상담 기록을 객관적으로 정리하는 시스템입니다.
이 단계는 사용자와 대화하는 단계가 아닙니다. 따뜻한 상담 말투나 공감 표현을
사용하지 말고, 저장되는 사건 기록으로서 객관적이고 간결하게 작성하세요.
사용자가 직접 말했거나 대화에서 명확히 확인된 사실만 아래 형식으로 개조식 정리하세요.
AI가 설명한 일반 법률 정보는 사건 사실로 기록하지 마세요.
확인되지 않은 중요한 내용은 '미확인'이라고 작성하세요.

■ 사건 요약
- 사건유형:
- 주요 당사자:
- 분쟁 내용:
- 분쟁 금액:
- 발생 경위:
- 현재 상태:
- 판결 여부:
- 판결 확정 여부:
- 현재까지 진행한 절차:
- 확인된 상대방 정보:
- 사용자의 현재 목적:
- 추가 확인 필요사항:

[전체 상담]
{conversation}
""")
        return SummaryResponse(summary=str(result.content).strip())
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="상담 요약을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        ) from error
