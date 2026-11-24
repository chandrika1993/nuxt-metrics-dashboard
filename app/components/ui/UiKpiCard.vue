<script setup lang="ts">
defineProps<{
  label: string
  value: string
  hint?: string
}>()
</script>

<template>
  <div class="kpi">
    <dt class="label">
      {{ label }}
    </dt>
    <dd class="value">
      {{ value }}
    </dd>
    <dd
      v-if="hint"
      class="hint"
    >
      {{ hint }}
    </dd>
  </div>
</template>

<style scoped>
.kpi {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.value {
  margin: var(--space-1) 0 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
</style>
