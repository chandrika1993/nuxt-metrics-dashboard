<script setup lang="ts">
defineProps<{
  page: number
  pageCount: number
}>()

const emit = defineEmits<{ 'update:page': [page: number] }>()
</script>

<template>
  <nav
    class="pagination"
    aria-label="Pagination"
  >
    <button
      type="button"
      class="button"
      :disabled="page <= 1"
      @click="emit('update:page', page - 1)"
    >
      Previous
    </button>
    <span
      class="status"
      aria-current="page"
    >Page {{ page }} of {{ pageCount }}</span>
    <button
      type="button"
      class="button"
      :disabled="page >= pageCount"
      @click="emit('update:page', page + 1)"
    >
      Next
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.button {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font: inherit;
  cursor: pointer;
}

.button:disabled {
  cursor: not-allowed;
  color: var(--color-text-muted);
  background: var(--color-bg);
}

.status {
  font-size: 0.875rem;
}
</style>
