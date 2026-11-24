import { getTeam } from '../../utils/seed'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const team = getTeam(id)
  if (!team) {
    throw createError({ statusCode: 404, statusMessage: `Team "${id}" not found` })
  }
  return team
})
