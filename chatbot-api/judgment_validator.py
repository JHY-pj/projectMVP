"""Text-based first-pass classification of civil judgment PDFs.

This is a document-format heuristic, not authentication or proof of finality.
"""
import re
import fitz

MAX_PDF_BYTES = 10 * 1024 * 1024

def classify_judgment_pdf(data: bytes) -> dict:
    if len(data) > MAX_PDF_BYTES:
        return {"result": "unknown", "is_judgment": False, "reason": "파일 크기는 10MB 이하여야 합니다."}
    if not data.startswith(b"%PDF-"):
        return {"result": "false", "is_judgment": False, "reason": "유효한 PDF 형식이 아닙니다."}
    try:
        with fitz.open(stream=data, filetype="pdf") as doc:
            if doc.is_encrypted or doc.needs_pass:
                return {"result": "unknown", "is_judgment": False, "reason": "암호화된 PDF는 판독할 수 없습니다."}
            if not 1 <= len(doc) <= 200:
                return {"result": "unknown", "is_judgment": False, "reason": "페이지 수를 확인해 주세요."}
            text = "\n".join(page.get_text(sort=True) for page in doc)
    except Exception:
        return {"result": "unknown", "is_judgment": False, "reason": "PDF 텍스트를 읽지 못했습니다."}

    normalized = re.sub(r"\s+", " ", text)
    if len(normalized.strip()) < 80:
        return {"result": "unknown", "is_judgment": False, "reason": "텍스트가 부족합니다. 스캔 문서는 직접 입력을 이용해 주세요."}

    # Civil judgment structure: title, court, case number, parties and disposition.
    checks = {
        "court": bool(re.search(r"(?:대법원|고등법원|지방법원|가정법원|법원\s*지원)", normalized)),
        "case_number": bool(re.search(r"\d{4}\s*(?:가소|가단|가합|나|다)\s*\d+", normalized)),
        "parties": "원고" in normalized and "피고" in normalized,
        "judgment": bool(re.search(r"판\s*결", normalized)),
        "order": bool(re.search(r"주\s*문", normalized)),
    }
    if all(checks.values()):
        return {"result": "true", "is_judgment": True, "reason": "민사 판결문 형식이 확인되었습니다. 진위·확정 여부는 별도 확인이 필요합니다."}
    if sum(checks.values()) >= 3:
        return {"result": "unknown", "is_judgment": False, "reason": "판결문 형식을 확정하기 어렵습니다. 직접 입력하거나 다른 파일을 선택해 주세요."}
    return {"result": "false", "is_judgment": False, "reason": "민사 판결문 필수 형식이 확인되지 않았습니다."}
