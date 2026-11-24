<script setup lang="ts">
import { computed } from 'vue'
import type { TeamStatus } from '../../../shared/types/metrics'

const props = defineProps<{ status: TeamStatus }>()

// Status is always written out as text, so meaning never depends on colour alone (WCAG 1.4.1).
const labels: Record<TeamStatus, string> = {
  'healthy': 'Healthy',
  'watch': 'Watch',
  'at-risk': 'At risk',
}

const label = computed(() => labels[props.status])
</script>

<template>
  <span
    class="badge"
    :class="`badge--${status}`"
  >{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0 var(--space-2);
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.6;
}

.badge--healthy {
  background: var(--color-healthy-bg);
  color: var(--color-healthy-text);
}

.badge--watch {
  background: var(--color-watch-bg);
  color: var(--color-watch-text);
}

.badge--at-risk {
  background: var(--color-risk-bg);
  color: var(--color-risk-text);
}
</style>
