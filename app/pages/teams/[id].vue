<script setup lang="ts">
import { formatHours, formatNumber, formatPercent } from '../../utils/format'

const route = useRoute()
const id = computed(() => String(route.params.id))

const { data: team, error } = await useFetch(() => `/api/teams/${id.value}`)

useHead(() => ({
  title: team.value ? `${team.value.name} | Engineering Metrics` : 'Team not found | Engineering Metrics',
}))

const deployPoints = computed(() =>
  (team.value?.weekly ?? []).map(w => ({ label: w.week, value: w.deploys })),
)
const incidentPoints = computed(() =>
  (team.value?.weekly ?? []).map(w => ({ label: w.week, value: w.incidents })),
)
</script>

<template>
  <div>
    <NuxtLink to="/">
      Back to all teams
    </NuxtLink>

    <div
      v-if="error"
      role="alert"
      class="not-found"
    >
      <h1>Team not found</h1>
      <p>There is no team with the id "{{ id }}".</p>
    </div>

    <template v-else-if="team">
      <header class="heading">
        <h1>{{ team.name }}</h1>
        <UiStatusBadge :status="team.status" />
      </header>

      <dl class="kpis">
        <UiKpiCard
          label="Deploys per week"
          :value="formatNumber(team.deploysPerWeek)"
        />
        <UiKpiCard
          label="Lead time"
          :value="formatHours(team.leadTimeHours)"
        />
        <UiKpiCard
          label="Change failure rate"
          :value="formatPercent(team.changeFailureRate)"
        />
        <UiKpiCard
          label="Mean time to restore"
          :value="formatHours(team.mttrHours)"
        />
      </dl>

      <div class="charts">
        <UiBarChart
          title="Deployments per week (last 8 weeks)"
          :points="deployPoints"
          unit="deploys"
        />
        <UiBarChart
          title="Incidents per week (last 8 weeks)"
          :points="incidentPoints"
          unit="incidents"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.heading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--space-4);
  margin: 0 0 var(--space-6);
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: var(--space-4);
}

.not-found {
  margin-top: var(--space-6);
}
</style>
