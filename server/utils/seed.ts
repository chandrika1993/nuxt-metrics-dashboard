import type { OverviewKpis, TeamDetail, TeamMetrics } from '../../shared/types/metrics'
import { median, statusFor } from '../../shared/utils/table'

/**
 * Deterministic demo data. A seeded PRNG keeps numbers stable between
 * requests and test runs, so E2E assertions do not flake.
 */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TEAM_NAMES = [
  'Platform',
  'Payments',
  'Billing',
  'Identity',
  'Mobile',
  'Data',
  'Search',
  'Growth',
  'Notifications',
  'Infrastructure',
  'Analytics',
  'Partner API',
]

const round = (value: number, digits = 1) => Number(value.toFixed(digits))
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

function buildTeams(): TeamDetail[] {
  const random = mulberry32(42)
  return TEAM_NAMES.map((name) => {
    const weekly = Array.from({ length: 8 }, (_, i) => {
      const deploys = 4 + Math.floor(random() * 22)
      return {
        week: `W${i + 1}`,
        deploys,
        incidents: Math.floor(random() * Math.max(1, deploys * 0.3)),
      }
    })
    const totalDeploys = weekly.reduce((sum, w) => sum + w.deploys, 0)
    const totalIncidents = weekly.reduce((sum, w) => sum + w.incidents, 0)
    const changeFailureRate = round(totalIncidents / totalDeploys, 3)
    return {
      id: slug(name),
      name,
      repos: 2 + Math.floor(random() * 14),
      deploysPerWeek: round(totalDeploys / weekly.length),
      leadTimeHours: round(4 + random() * 70),
      changeFailureRate,
      mttrHours: round(0.5 + random() * 12),
      status: statusFor(changeFailureRate),
      weekly,
    }
  })
}

const teams = buildTeams()

export function getTeams(): TeamMetrics[] {
  return teams.map(({ weekly: _weekly, ...metrics }) => metrics)
}

export function getTeam(id: string): TeamDetail | undefined {
  return teams.find(team => team.id === id)
}

export function getOverview(): OverviewKpis {
  const deploys = teams.reduce((sum, t) => sum + t.deploysPerWeek, 0)
  const weightedFailures = teams.reduce((sum, t) => sum + t.changeFailureRate * t.deploysPerWeek, 0)
  return {
    teams: teams.length,
    deploysPerWeek: round(deploys),
    medianLeadTimeHours: round(median(teams.map(t => t.leadTimeHours))),
    changeFailureRate: round(weightedFailures / deploys, 3),
  }
}
