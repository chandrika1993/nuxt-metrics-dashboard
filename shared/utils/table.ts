import type { Page, SortDir, TeamStatus } from '../types/metrics'

export const TEAM_SORT_KEYS = [
  'name',
  'repos',
  'deploysPerWeek',
  'leadTimeHours',
  'changeFailureRate',
  'mttrHours',
  'status',
] as const

export type TeamSortKey = (typeof TEAM_SORT_KEYS)[number]

export function isTeamSortKey(value: unknown): value is TeamSortKey {
  return typeof value === 'string' && (TEAM_SORT_KEYS as readonly string[]).includes(value)
}

export function filterByName<T extends { name: string }>(rows: readonly T[], query: string): T[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return [...rows]
  return rows.filter(row => row.name.toLowerCase().includes(needle))
}

/** Stable sort that compares numbers numerically and everything else as text. */
export function sortBy<T, K extends keyof T>(rows: readonly T[], key: K, dir: SortDir): T[] {
  const factor = dir === 'asc' ? 1 : -1
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const av = a.row[key]
      const bv = b.row[key]
      const result = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return result === 0 ? a.index - b.index : result * factor
    })
    .map(entry => entry.row)
}

/** Clamps the requested page into range so a stale URL never shows an empty page. */
export function paginate<T>(rows: readonly T[], page: number, pageSize: number): Page<T> {
  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, Math.floor(page)), pageCount)
  const start = (current - 1) * pageSize
  return { items: rows.slice(start, start + pageSize), total, page: current, pageSize, pageCount }
}

export function median(values: readonly number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!
}

export function statusFor(changeFailureRate: number): TeamStatus {
  if (changeFailureRate < 0.1) return 'healthy'
  if (changeFailureRate < 0.2) return 'watch'
  return 'at-risk'
}
