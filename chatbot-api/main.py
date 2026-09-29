"""집행나침반 고객센터 챗봇 API.

실행:
  cd chatbot-api
  python -m venv .venv
  .venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn main:api --reload --port 8000
"""

import os
from typing import Literal, TypedDict

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from pydantic import BaseModel, Field

load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise RuntimeError("OPENAI_API_KEY가 없습니다. chatbot-api/.env 파일을 확인하세요.")

llm = ChatOpenAI(
    model=os.getenv("OPENAI_MODEL", "gpt-5.6-luna"),
    api_key=os.getenv("OPENAI_API_KEY"),
)

PERSONA_PROMPT = """
당신은 '다정다감한 소크라테스식 민사 법률 안내자'입니다.
사건을 대신 판단하거나 정답을 강요하지 않습니다.

사용자의 이야기를 차분히 듣고, 사용자가 자신의 상황을 정리하고
가능한 해결 방법을 이해하도록 돕습니다. 따뜻하지만 과장하지 않고,
권위적으로 말하지 않으며, 어려운 법률용어는 쉬운 말로 먼저 설명합니다.

사용자가 분노·억울함·불안·답답함·허탈함을 명확하게 표현했을 때만
짧고 자연스럽게 인정합니다. 사용자가 말하지 않은 감정을 추측하지 않습니다.

이미 정보가 충분하면 현재 가장 궁금한 부분부터 일반적인 법률 정보를 설명합니다.
추가 질문이 꼭 필요한 경우에만 답변 마지막에 가장 중요한 질문 하나만 하세요.
사용자가 이미 말한 내용을 다시 묻지 말고, 사실이나 법률 결과를 추측·확정하지 마세요.

상담 후 사용자가 'AI가 내 사건을 대신 판단했다'가 아니라
'내 상황이 정리됐고 다음에 무엇을 확인할지 알겠다'고 느끼도록 도와주세요.
"""

class ConversationAnalysis(BaseModel):
    category: Literal["civil", "criminal", "ambiguous", "general"] = Field(
        description="사용자가 현재 원하는 도움의 영역"
    )
    intent: str = Field(description="사용자가 가장 알고 싶거나 해결하려는 내용")
    emotion: str = Field(default="불명확", description="사용자가 명확하게 드러낸 감정")
    known_facts: list[str] = Field(default_factory=list, description="사용자가 직접 말한 확인된 사실")
    missing_information: list[str] = Field(default_factory=list, description="안내에 도움이 되는 추가 정보")
    needs_clarification: bool = Field(description="답변 전에 꼭 확인할 정보가 있는지")
    clarification_question: str | None = Field(default=None, description="필요 시 가장 중요한 질문 하나")

analysis_llm = llm.with_structured_output(ConversationAnalysis)

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=8000)

class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    history: list[Message] = Field(default_factory=list, max_length=40)

class ChatResponse(BaseModel):
    answer: str

class SummaryRequest(BaseModel):
    history: list[Message] = Field(min_length=1, max_length=40)

class SummaryResponse(BaseModel):
    summary: str

class ChatState(TypedDict, total=False):
    question: str
    conversation_context: str
    category: str
    intent: str
    emotion: str
    known_facts: list[str]
    missing_information: list[str]
    needs_clarification: bool
    clarification_question: str
    answer: str

def conversation_to_text(messages: list[Message]) -> str:
    labels = {"user": "사용자", "assistant": "민사 챗봇"}
    return "\n\n".join(
        f"[{labels[message.role]}]\n{message.content}"
        for message in messages[-30:]
    )

def analyzer_node(state: ChatState) -> dict:
    result = analysis_llm.invoke(f"""
{PERSONA_PROMPT}

지금은 답변이 아니라 사용자 상황을 분석하는 단계입니다.
특정 단어 하나나 사건명만으로 민사·형사를 분류하지 말고,
사용자가 지금 원하는 도움을 중심으로 판단하세요.

- civil: 금전 회수, 손해배상, 계약, 채권·채무, 민사소송·집행
- criminal: 신고, 고소, 수사, 처벌
- ambiguous: 현재 목적을 판단하기 어려움
- general: 법률 안내 범위와 관계없는 질문

추가 질문은 유용한 설명을 하기 위해 정말 필요한 경우에만 하며 한 번에 하나만 작성하세요.
확인된 사실은 사용자가 직접 말한 내용만 기록하세요.

[이전 상담]
{state.get("conversation_context", "")}

[현재 사용자 메시지]
{state.get("question", "")}
""")
    return {
        "category": result.category,
        "intent": result.intent,
        "emotion": result.emotion,
        "known_facts": result.known_facts,
        "missing_information": result.missing_information,
        "needs_clarification": result.needs_clarification,
        "clarification_question": result.clarification_question or "",
    }

def decide_next_node(state: ChatState) -> str:
    if state.get("needs_clarification"):
        return "clarification"
    if state.get("category") == "general":
        return "general_response"
    return "response"

def response_node(state: ChatState) -> dict:
    category = state.get("category", "ambiguous")
    scope = (
        "현재 질문은 신고·고소·수사·처벌과 관계된 부분이 있습니다. "
        "현재 서비스는 민사 안내 중심임을 부드럽게 설명하고, 피해 회복·손해배상처럼 "
        "민사적으로 살펴볼 수 있는 부분은 원하면 계속 정리할 수 있다고 안내하세요."
        if category == "criminal"
        else "민사상 권리관계, 피해 회복, 채권·채무, 소송·집행 관점에서 안내하세요."
    )
    response = llm.invoke(f"""
{PERSONA_PROMPT}

{scope}

[현재 목적]
{state.get("intent", "")}

[명확하게 표현한 감정]
{state.get("emotion", "불명확")}

[확인된 사실]
{state.get("known_facts", [])}

[추가 확인이 도움이 될 정보]
{state.get("missing_information", [])}

[이전 상담]
{state.get("conversation_context", "")}

[현재 사용자 메시지]
{state.get("question", "")}
""")
    return {"answer": str(response.content).strip()}

def clarification_node(state: ChatState) -> dict:
    question = state.get("clarification_question", "").strip()
    return {
        "answer": question or (
            "말씀해주신 상황을 조금 더 이해하고 싶어요. "
            "지금 가장 먼저 해결하고 싶은 부분이 무엇인지 말씀해 주실래요?"
        )
    }

def general_response_node(_: ChatState) -> dict:
    return {
        "answer": (
            "지금 말씀해주신 내용은 제가 안내하는 민사 절차와는 조금 거리가 있어 보여요. "
            "현재 겪고 계신 분쟁이나 법적인 문제와 연결되어 있다면, "
            "어떤 상황인지 조금만 더 말씀해 주세요."
        )
    }

workflow = StateGraph(ChatState)
workflow.add_node("analyzer", analyzer_node)
workflow.add_node("response", response_node)
workflow.add_node("clarification", clarification_node)
workflow.add_node("general_response", general_response_node)
workflow.set_entry_point("analyzer")
workflow.add_conditional_edges(
    "analyzer",
    decide_next_node,
    {
        "response": "response",
        "clarification": "clarification",
        "general_response": "general_response",
    },
)
workflow.add_edge("response", END)
workflow.add_edge("clarification", END)
workflow.add_edge("general_response", END)
chatbot = workflow.compile()

api = FastAPI(title="집행나침반 고객센터 챗봇 API", version="0.1.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CHATBOT_ALLOWED_ORIGINS",
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
