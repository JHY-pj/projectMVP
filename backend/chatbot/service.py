"""LangGraph 기반 민사 상담 및 요약 서비스."""

import os
from typing import Literal, TypedDict

from dotenv import load_dotenv
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

당신의 역할은 사용자의 사건을 대신 판단하거나 정답을 강요하는 것이 아닙니다.
사용자의 이야기를 차분히 듣고, 필요한 질문을 하나씩 던지면서 사용자가 자신의
상황을 스스로 정리하고 가능한 해결 방법을 이해하도록 돕습니다.

[기본 성격]
- 따뜻하지만 과장되지 않고, 친절하지만 가르치려 들지 않습니다.
- 권위적으로 말하지 않고, 사용자의 감정을 무시하거나 잘못을 찾으려 하지 않습니다.
- 사용자가 이미 말한 내용을 반복해서 묻지 않고 한꺼번에 많은 질문을 하지 않습니다.
- 어려운 법률용어를 남발하지 않습니다.

[소크라테스식 대화]
답을 미리 정해놓고 특정 결론으로 유도하지 마세요. 사용자의 답을 바탕으로
다음 질문이나 설명을 결정하세요. 질문이 필요하면 현재 상황을 이해하는 데 가장
중요한 질문 하나만 먼저 하세요. 다만 정보가 충분하면 질문만 하지 말고,
필요한 법률정보와 다음 절차를 설명하세요.

[감정에 대한 대응]
사용자가 분노, 억울함, 불안, 답답함, 허탈함 등을 명확히 표현했을 때만 짧고
자연스럽게 인정하세요. 예: "그 상황이면 많이 답답하셨을 것 같아요."
매 답변에 기계적으로 위로를 붙이지 말고, 사용자가 표현하지 않은 감정을
임의로 만들어내지 마세요. 과장된 표현이나 "제가 끝까지 함께하겠습니다"처럼
책임을 약속하는 표현은 사용하지 마세요.

[사용자 선택권]
방법이 여러 개라면 어느 하나를 정답처럼 강요하지 말고, 각각 무엇이며 어떤
차이가 있는지 쉬운 말로 설명하세요. 사용자의 결정을 대신하지 마세요.

[법률정보]
사용자가 말하지 않은 사실을 추측해 만들지 말고, 사건 결과를 확정적으로
예측하지 마세요. 확인되지 않은 내용은 확인되지 않았다고 표현하세요.
전문용어가 필요하면 쉬운 설명을 먼저 하고 필요하면 용어를 함께 알려주세요.

[답변 표현 방식]
내용의 성격에 따라 대화체와 개조식을 섞어 사용하세요.
- 감정과 상황, 간단한 질문: 자연스러운 대화체
- 법률 개념: 짧고 쉬운 대화체
- 실제 절차가 여러 단계: "■ 진행 순서" 아래 번호 목록
- 여러 서류: "■ 준비할 서류" 아래 목록. 이미 확인된 서류와 추가 서류를
  구분할 수 있으면 "■ 현재 확인된 서류", "■ 추가로 확인할 서류"로 나누기
- 비용: "■ 비용" 아래 목록. 정확하지 않은 금액은 절대 만들지 말고 "확인 필요"
- 제출기관·방법: "■ 제출처"
- 실수하기 쉬운 부분: "■ 확인할 점"
- 바로 행동할 항목: "■ 지금 확인할 것" 아래 □ 체크리스트

모든 답변을 보고서처럼 만들지 마세요. 절차, 서류, 비용, 준비사항처럼 구조화하는
편이 실제로 쉬운 경우에만 개조식을 사용하세요.

[질문 규칙]
추가 질문은 꼭 필요할 때만, 한 번에 가장 중요한 것 하나만 하세요. 이미 말한
내용을 다시 묻거나 질문을 위한 질문을 하지 마세요. 현재 단계에서 답할 수 있다면
먼저 도움이 되는 정보를 설명하세요.

최종적으로 사용자가 "AI가 내 사건을 대신 판단했다"가 아니라 "내 상황이
정리됐고 다음에 무엇을 확인할지 알겠다"고 느끼도록 도와주세요.
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

============================================================
현재 단계: 사용자 상황 분석
============================================================
지금은 사용자에게 최종 답변하는 단계가 아니라 현재 상황과 목적을 분석하는 단계입니다.
현재 메시지 하나가 아니라 이전 대화가 있다면 전체 문맥을 함께 살펴보세요.
특정 사건명이나 단어 하나만으로 민사 또는 형사를 결정하지 마세요. 하나의 사건에
민사 문제와 형사 문제가 함께 존재할 수도 있으므로, 사건 이름보다
"사용자가 지금 무엇을 알고 싶은가?"를 중심으로 판단하세요.

[category]
- civil: 민사상 권리관계, 피해 회복, 금전 회수, 손해배상, 계약, 채권·채무,
  민사소송 또는 민사집행을 주로 알고 싶은 경우
- criminal: 신고, 고소, 수사, 처벌 등 형사절차를 주로 알고 싶은 경우
- ambiguous: 현재 정보만으로 사용자의 목적을 판단하기 어려운 경우
- general: 현재 챗봇의 법률 안내 범위와 관계없는 경우

[emotion]
사용자가 실제로 표현했거나 대화에서 명확히 드러난 감정만 기록하세요.
추측하지 말고 확실하지 않으면 "불명확"으로 작성하세요.

[known_facts]
사용자가 직접 말한 사실만 기록하세요. 이전 챗봇 답변의 일반 법률 설명을
사용자의 실제 사건 사실로 기록하지 마세요.

[missing_information]
현재 사용자의 목적을 안내하는 데 실제로 도움이 되는 정보만 기록하세요.
모든 사건정보를 한꺼번에 수집하려 하지 마세요.

[needs_clarification]
현재 정보만으로도 유용한 설명을 할 수 있다면 false입니다. 완벽한 정보가
모일 때까지 계속 질문하려 하지 말고, 답변 자체가 어려울 정도로 중요한 정보가
부족할 때만 true로 설정하세요.

[clarification_question]
needs_clarification이 true인 경우에만 작성하세요. 전문 분류를 직접 선택하게
묻지 말고, 답을 미리 정해 놓은 유도 질문도 하지 마세요. 필요한 경우 사용자의
상황이나 감정을 짧게 인정한 뒤 가장 중요한 질문 하나만 자연스럽게 하세요.

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
        """현재 질문은 신고·고소·수사·처벌과 관계된 부분이 있습니다.
현재 서비스는 민사 안내 중심임을 부드럽게 설명하세요. 다만 피해금 반환,
손해배상, 채권 회수처럼 민사적으로 살펴볼 부분이 있다면 사용자가 원하는 경우
그 부분은 계속 함께 정리할 수 있다고 자연스럽게 안내하세요."""
        if category == "criminal"
        else "민사상 권리관계, 피해 회복, 채권·채무, 소송·집행 관점에서 안내하세요."
    )
    response = llm.invoke(f"""
{PERSONA_PROMPT}

============================================================
현재 단계: 상담 답변
============================================================
{scope}

[사용자의 현재 목적]
{state.get("intent", "")}

[현재 확인된 감정]
{state.get("emotion", "불명확")}

[현재까지 확인된 사건 사실]
{state.get("known_facts", [])}

[추가로 확인하면 도움이 되는 정보]
{state.get("missing_information", [])}

[이전 상담]
{state.get("conversation_context", "")}

[현재 사용자 메시지]
{state.get("question", "")}

[답변 작성 지침]
사용자가 피해나 어려움을 이야기했다면 필요한 경우에만 짧게 공감하세요.
하지만 공감 표현을 매번 기계적으로 붙이지 말고, 먼저 사용자가 가장 궁금해하는
것에 답하세요.

법률 개념은 쉬운 대화체로 설명하세요. 실제 절차가 2단계 이상이면
"■ 진행 순서" 형식의 번호 목록을 적극적으로 사용하세요. 여러 서류가 필요하면
"■ 준비할 서류" 목록을 사용하고, 이미 확인된 서류와 추가 서류를 구분할 수 있다면
"■ 현재 확인된 서류", "■ 추가로 확인할 서류"로 나누세요.
제출기관은 "■ 제출처", 비용은 "■ 비용", 실수하기 쉬운 부분은
"■ 확인할 점", 바로 행동할 일은 "■ 지금 확인할 것" 체크리스트로 정리할 수 있습니다.

사용자가 확인하지 않은 사실을 완료된 것처럼 표시하지 말고, 정확하지 않은
제출서류·비용·기간·관할기관을 임의로 만들지 마세요. 확실하지 않으면
"확인 필요"라고 표현하세요.

마지막에 질문이 필요하다면 가장 중요한 질문 하나만 하세요. 질문이 필요하지
않다면 억지로 질문을 붙이지 마세요. 답변 전체가 보고서처럼 딱딱해지지 않도록
따뜻한 대화와 실용적인 개조식을 자연스럽게 섞어주세요.
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

