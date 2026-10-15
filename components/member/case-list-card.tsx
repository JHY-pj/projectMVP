import Link from "next/link"
import { faChevronRight, faScaleBalanced } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@/lib/fontawesome"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/screen-kit"
import { CaseListItem, CaseListPrimary, CaseIcon, CaseListNext, CaseListMeta } from "./case-ui"

type CaseListEntry = {
  id: string; caseNo: string; type: string; amount: string; status: string
  next: string; updatedAt: string; tone: "info" | "positive" | "warning" | "negative" | "neutral"
}

export function CaseListCard({ item }: { item: CaseListEntry }) {
  return <CaseListItem>
    <CaseListPrimary>
      <CaseIcon aria-hidden="true"><FontAwesomeIcon icon={faScaleBalanced} /></CaseIcon>
      <div><small>{item.caseNo}</small><h2>{item.type} 청구 사건</h2><p>{item.amount}</p></div>
    </CaseListPrimary>
    <CaseListNext><small>다음 할 일</small><strong>{item.next}</strong></CaseListNext>
    <CaseListMeta><StatusBadge tone={item.tone}>{item.status}</StatusBadge><small>최근 업데이트 {item.updatedAt}</small></CaseListMeta>
    <Button asChild variant="outline" size="sm"><Link href={`/app/cases/${item.id}`}>사건 보기 <FontAwesomeIcon icon={faChevronRight} /></Link></Button>
  </CaseListItem>
}
