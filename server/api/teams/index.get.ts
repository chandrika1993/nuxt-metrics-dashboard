import { z } from 'zod'
import { filterByName, paginate, sortBy, TEAM_SORT_KEYS } from '../../../shared/utils/table'
import { getTeams } from '../../utils/seed'

const querySchema = z.object({
  q: z.string().trim().max(100).default(''),
  sort: z.enum(TEAM_SORT_KEYS).default('name'),
  dir: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(50).default(10),
})

/**
 * Filtering, sorting and pagination run on the server, so the client
 * only ever receives the rows it renders.
 */
export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)
  const filtered = filterByName(getTeams(), query.q)
  return paginate(sortBy(filtered, query.sort, query.dir), query.page, query.pageSize)
})
