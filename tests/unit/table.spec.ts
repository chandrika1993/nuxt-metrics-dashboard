import { describe, expect, it } from 'vitest'
import { filterByName, isTeamSortKey, median, paginate, sortBy, statusFor } from '../../shared/utils/table'

const rows = [
  { name: 'Payments', deploys: 12 },
  { name: 'Billing', deploys: 4 },
  { name: 'Platform', deploys: 12 },
  { name: 'Identity', deploys: 30 },
]

describe('filterByName', () => {
  it('matches case-insensitively and ignores surrounding whitespace', () => {
    expect(filterByName(rows, '  PAY ').map(r => r.name)).toEqual(['Payments'])
  })

  it('returns a copy of all rows for an empty query', () => {
    const result = filterByName(rows, '')
    expect(result).toEqual(rows)
    expect(result).not.toBe(rows)
  })
})

describe('sortBy', () => {
  it('sorts numbers numerically, not lexically', () => {
    expect(sortBy(rows, 'deploys', 'asc').map(r => r.deploys)).toEqual([4, 12, 12, 30])
  })

  it('keeps the original order for equal values (stable)', () => {
    expect(sortBy(rows, 'deploys', 'desc').map(r => r.name)).toEqual(['Identity', 'Payments', 'Platform', 'Billing'])
  })

  it('sorts strings by locale', () => {
    expect(sortBy(rows, 'name', 'asc').map(r => r.name)).toEqual(['Billing', 'Identity', 'Payments', 'Platform'])
  })

  it('does not mutate the input', () => {
    const copy = [...rows]
    sortBy(rows, 'name', 'desc')
    expect(rows).toEqual(copy)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 23 }, (_, i) => i)

  it('returns the requested page and metadata', () => {
    expect(paginate(items, 2, 10)).toEqual({
      items: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      total: 23,
      page: 2,
      pageSize: 10,
      pageCount: 3,
    })
  })

  it('clamps an out-of-range page to the last page', () => {
    expect(paginate(items, 99, 10).page).toBe(3)
    expect(paginate(items, 99, 10).items).toEqual([20, 21, 22])
  })

  it('reports one page for an empty list', () => {
    expect(paginate([], 1, 10)).toMatchObject({ items: [], total: 0, page: 1, pageCount: 1 })
  })
})

describe('helpers', () => {
  it('computes the median for odd and even lengths', () => {
    expect(median([5, 1, 3])).toBe(3)
    expect(median([4, 1, 3, 2])).toBe(2.5)
    expect(median([])).toBe(0)
  })

  it('derives status from change failure rate', () => {
    expect(statusFor(0.05)).toBe('healthy')
    expect(statusFor(0.15)).toBe('watch')
    expect(statusFor(0.25)).toBe('at-risk')
  })

  it('validates sort keys from untrusted input', () => {
    expect(isTeamSortKey('leadTimeHours')).toBe(true)
    expect(isTeamSortKey('id')).toBe(false)
    expect(isTeamSortKey(undefined)).toBe(false)
  })
})
