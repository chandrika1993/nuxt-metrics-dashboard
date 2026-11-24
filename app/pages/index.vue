<script setup lang="ts">
import type { Column } from '../types/ui'
import type { TeamMetrics } from '../../shared/types/metrics'
import type { TeamSortKey } from '../../shared/utils/table'
import { formatHours, formatNumber, formatPercent } from '../utils/format'

useHead({ title: 'Overview | Engineering Metrics' })

const { state, update, setSearch, toggleSort } = useTeamTableState()

const { data: overview } = await useFetch('/api/overview')

const { data: teams, status, error, refresh } = await useFetch('/api/teams', {
  query: state,
})

const columns: readonly Column<TeamSortKey>[] = [
  { key: 'name', label: 'Team', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'deploysPerWeek', label: 'Deploys / week', sortable: true, numeric: true },
  { key: 'leadTimeHours', label: 'Lead time', sortable: true, numeric: true },
  { key: 'changeFailureRate', label: 'Change failure rate', sortable: true, numeric: true },
  { key: 'mttrHours', label: 'MTTR', sortable: true, numeric: true },
  { key: 'repos', label: 'Repos', sortable: true, numeric: true },
]

const rows = computed<TeamMetrics[]>(() => teams.value?.items ?? [])

const resultSummary = computed(() => {
  if (status.value === 'pending') return 'Loading teams'
  const total = teams.value?.total ?? 0
  return `${total} ${total === 1 ? 'team' : 'teams'} found`
})
</script>

<template>
  <div class="page">
    <h1>Delivery health</h1>

    <section aria-labelledby="kpi-heading">
      <h2
        id="kpi-heading"
        class="visually-hidden"
      >
        Key metrics
      </h2>
      <dl
        v-if="overview"
        class="kpis"
      >
        <UiKpiCard
          label="Teams"
          :value="String(overview.teams)"
        />
        <UiKpiCard
          label="Deploys per week"
          :value="formatNumber(overview.deploysPerWeek)"
          hint="All teams combined"
        />
        <UiKpiCard
          label="Median lead time"
          :value="formatHours(overview.medianLeadTimeHours)"
        />
        <UiKpiCard
          label="Change failure rate"
          :value="formatPercent(overview.changeFailureRate)"
          hint="Weighted by deploy volume"
        />
      </dl>
    </section>

    <section
      aria-labelledby="teams-heading"
      class="teams"
    >
      <div class="toolbar">
        <h2 id="teams-heading">
          Teams
        </h2>
        <UiSearchInput
          label="Search teams"
          placeholder="e.g. Payments"
          :model-value="state.q"
          @update:model-value="setSearch"
        />
      </div>

      <p
        class="summary"
        role="status"
        aria-live="polite"
      >
        {{ resultSummary }}
      </p>

      <div
        v-if="error"
        class="error"
        role="alert"
      >
        <p>Teams could not be loaded.</p>
        <button
          type="button"
          @click="() => refresh()"
        >
          Try again
        </button>
      </div>

      <UiDataTable
        v-else
        caption="Delivery metrics by team"
        :columns="columns"
        :rows="rows"
        row-key="name"
        :sort-key="state.sort"
        :sort-dir="state.dir"
        :loading="status === 'pending'"
        @sort="toggleSort"
      >
        <template #cell-name="{ row }">
          <NuxtLink :to="`/teams/${row.id}`">
            {{ row.name }}
          </NuxtLink>
        </template>
        <template #cell-status="{ row }">
          <UiStatusBadge :status="row.status" />
        </template>
        <template #cell-deploysPerWeek="{ row }">
          {{ row.deploysPerWeek.toFixed(1) }}
        </template>
        <template #cell-leadTimeHours="{ row }">
          {{ formatHours(row.leadTimeHours) }}
        </template>
        <template #cell-changeFailureRate="{ row }">
          {{ formatPercent(row.changeFailureRate) }}
        </template>
        <template #cell-mttrHours="{ row }">
          {{ formatHours(row.mttrHours) }}
        </template>
        <template #empty>
          No teams match "{{ state.q }}".
        </template>
      </UiDataTable>

      <UiPagination
        v-if="teams && teams.pageCount > 1"
        :page="teams.page"
        :page-count="teams.pageCount"
        @update:page="(page) => update({ page })"
      />
    </section>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--space-4);
  margin: 0 0 var(--space-8);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-4);
}

.toolbar h2 {
  margin: 0;
}

.summary {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.error {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-risk-bg);
  color: var(--color-risk-text);
}
</style>
