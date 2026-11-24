<script setup lang="ts" generic="T extends object, K extends Extract<keyof T, string>">
import type { SortDir } from '../../../shared/types/metrics'
import type { Column } from '../../types/ui'

const props = defineProps<{
  caption: string
  columns: readonly Column<K>[]
  rows: readonly T[]
  rowKey: K
  sortKey?: K
  sortDir?: SortDir
  loading?: boolean
}>()

const emit = defineEmits<{ sort: [key: K] }>()

function ariaSort(key: K): 'ascending' | 'descending' | undefined {
  if (props.sortKey !== key) return undefined
  return props.sortDir === 'desc' ? 'descending' : 'ascending'
}

function sortIcon(key: K): string {
  if (props.sortKey !== key) return '↕'
  return props.sortDir === 'desc' ? '↓' : '↑'
}
</script>

<template>
  <div
    class="wrapper"
    :aria-busy="loading ? 'true' : undefined"
  >
    <table class="table">
      <caption class="caption">
        {{ caption }}
      </caption>
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            :aria-sort="col.sortable ? ariaSort(col.key) : undefined"
            :class="{ numeric: col.numeric }"
          >
            <button
              v-if="col.sortable"
              type="button"
              class="sort"
              @click="emit('sort', col.key)"
            >
              {{ col.label }}
              <span aria-hidden="true">{{ sortIcon(col.key) }}</span>
            </button>
            <template v-else>
              {{ col.label }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="String(row[rowKey])"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            :class="{ numeric: col.numeric }"
          >
            <slot
              :name="`cell-${col.key}`"
              :row="row"
              :value="row[col.key]"
            >
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="!loading && rows.length === 0">
          <td
            :colspan="columns.length"
            class="empty"
          >
            <slot name="empty">
              No results.
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.wrapper {
  overflow-x: auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.wrapper[aria-busy='true'] {
  opacity: 0.6;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.caption {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-weight: 600;
}

th,
td {
  padding: var(--space-2) var(--space-4);
  border-top: 1px solid var(--color-border);
  text-align: left;
  white-space: nowrap;
}

th {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.sort {
  all: unset;
  cursor: pointer;
  font-weight: 600;
}

.sort:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-6);
}
</style>
