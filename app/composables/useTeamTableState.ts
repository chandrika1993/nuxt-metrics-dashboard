import type { SortDir } from '../../shared/types/metrics'
import { isTeamSortKey, type TeamSortKey } from '../../shared/utils/table'

export interface TeamTableState {
  q: string
  sort: TeamSortKey
  dir: SortDir
  page: number
}

/**
 * The URL is the single source of truth for table state, so filtered and
 * sorted views can be bookmarked, shared and restored with the back button.
 */
export function useTeamTableState() {
  const route = useRoute()
  const router = useRouter()

  const state = computed<TeamTableState>(() => {
    const { q, sort, dir, page } = route.query
    const pageNumber = Number(page)
    return {
      q: typeof q === 'string' ? q : '',
      sort: isTeamSortKey(sort) ? sort : 'name',
      dir: dir === 'desc' ? 'desc' : 'asc',
      page: Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    }
  })

  function update(patch: Partial<TeamTableState>) {
    const next = { ...state.value, ...patch }
    return router.replace({
      query: {
        ...(next.q ? { q: next.q } : {}),
        sort: next.sort,
        dir: next.dir,
        page: String(next.page),
      },
    })
  }

  function setSearch(q: string) {
    return update({ q, page: 1 })
  }

  function toggleSort(key: TeamSortKey) {
    const dir: SortDir = state.value.sort === key && state.value.dir === 'asc' ? 'desc' : 'asc'
    return update({ sort: key, dir, page: 1 })
  }

  return { state, update, setSearch, toggleSort }
}
