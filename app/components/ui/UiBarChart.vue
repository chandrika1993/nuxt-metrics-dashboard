<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  points: readonly { label: string, value: number }[]
  unit?: string
  height?: number
}>(), {
  unit: '',
  height: 160,
})

const max = computed(() => Math.max(1, ...props.points.map(p => p.value)))
const barWidth = 28
const gap = 12
const width = computed(() => props.points.length * (barWidth + gap))
</script>

<template>
  <figure class="chart">
    <figcaption class="title">
      {{ title }}
    </figcaption>
    <!-- The SVG is decorative for screen readers; the table below carries the same data. -->
    <svg
      :viewBox="`0 0 ${width} ${height + 36}`"
      :width="width"
      :height="height + 36"
      aria-hidden="true"
      focusable="false"
    >
      <g
        v-for="(point, i) in points"
        :key="point.label"
      >
        <rect
          :x="i * (barWidth + gap)"
          :y="16 + height - (point.value / max) * height"
          :width="barWidth"
          :height="(point.value / max) * height"
          rx="3"
          class="bar"
        />
        <text
          :x="i * (barWidth + gap) + barWidth / 2"
          :y="12 + height - (point.value / max) * height"
          text-anchor="middle"
          class="value"
        >{{ point.value }}</text>
        <text
          :x="i * (barWidth + gap) + barWidth / 2"
          :y="height + 31"
          text-anchor="middle"
          class="axis"
        >{{ point.label }}</text>
      </g>
    </svg>
    <table class="visually-hidden">
      <caption>{{ title }}</caption>
      <tbody>
        <tr
          v-for="point in points"
          :key="point.label"
        >
          <th scope="row">
            {{ point.label }}
          </th>
          <td>{{ point.value }} {{ unit }}</td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>

<style scoped>
.chart {
  margin: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.title {
  font-weight: 600;
  margin-bottom: var(--space-3);
}

.bar {
  fill: var(--color-primary);
}

.value {
  font-size: 11px;
  font-weight: 600;
  fill: var(--color-text);
}

.axis {
  font-size: 11px;
  fill: var(--color-text-muted);
}
</style>
