export type TeamStatus = 'healthy' | 'watch' | 'at-risk'

export interface TeamMetrics {
  id: string
  name: string
  repos: number
  deploysPerWeek: number
  leadTimeHours: number
  /** Share of deployments that caused an incident, 0 to 1. */
  changeFailureRate: number
  mttrHours: number
  status: TeamStatus
}

export interface WeeklyPoint {
  week: string
  deploys: number
  incidents: number
}

export interface TeamDetail extends TeamMetrics {
  weekly: WeeklyPoint[]
}

export interface OverviewKpis {
  teams: number
  deploysPerWeek: number
  medianLeadTimeHours: number
  changeFailureRate: number
}

export type SortDir = 'asc' | 'desc'

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}
