<script setup lang="ts">
import { onBeforeUnmount, ref, useId, watch } from 'vue'
import { debounce } from '../../utils/debounce'

const props = withDefaults(defineProps<{
  label: string
  modelValue: string
  placeholder?: string
  debounceMs?: number
}>(), {
  placeholder: '',
  debounceMs: 300,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()
const local = ref(props.modelValue)

// Keep the field in sync when the value changes from outside (back button, shared URL).
watch(() => props.modelValue, (value) => {
  if (value !== local.value) local.value = value
})

const emitDebounced = debounce((value: string) => emit('update:modelValue', value), props.debounceMs)

function onInput(event: Event) {
  local.value = (event.target as HTMLInputElement).value
  emitDebounced(local.value)
}

onBeforeUnmount(() => emitDebounced.cancel())
</script>

<template>
  <div class="search">
    <label
      :for="id"
      class="label"
    >{{ label }}</label>
    <input
      :id="id"
      type="search"
      class="input"
      :value="local"
      :placeholder="placeholder"
      autocomplete="off"
      @input="onInput"
    >
  </div>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
}

.input {
  min-width: 16rem;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font: inherit;
}
</style>
