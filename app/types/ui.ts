export interface Column<Key extends string> {
  key: Key
  label: string
  sortable?: boolean
  /** Right-aligns the column and uses tabular figures. */
  numeric?: boolean
}
