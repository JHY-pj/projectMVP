import { faScaleBalanced, faBuildingColumns, faFileShield } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@/lib/fontawesome"
import styles from "./eligibility-bar.module.css"

const items = [
  { label: "대상", value: "민사 승소 채권자", icon: faScaleBalanced },
  { label: "초기 범위", value: "채권액 500만 원 미만", icon: faBuildingColumns },
  { label: "이용 방식", value: "MVP 핵심 기능 무료", icon: faFileShield },
]
export function EligibilityBar() {
  return <section className={styles.bar} aria-label="서비스 이용 대상과 범위"><div className={styles.grid}>{items.map(item => <div className={styles.item} key={item.label}><FontAwesomeIcon icon={item.icon} /><span><small>{item.label}</small><strong>{item.value}</strong></span></div>)}</div></section>
}
