import type { ComponentProps } from "react"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@/lib/fontawesome"
import { Input } from "./primitives"
import styles from "./search-input.module.css"

export function SearchInput(props: ComponentProps<typeof Input>) {
  return <div className={styles.root}>
    <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
    <Input {...props} leadingIcon />
  </div>
}
