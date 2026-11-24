import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import UiSearchInput from '../../app/components/ui/UiSearchInput.vue'

describe('UiSearchInput', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('associates the visible label with the input', () => {
    const wrapper = mount(UiSearchInput, { props: { label: 'Search teams', modelValue: '' } })
    const id = wrapper.find('input').attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.find('label').attributes('for')).toBe(id)
  })

  it('emits one update after typing settles', async () => {
    const wrapper = mount(UiSearchInput, { props: { label: 'Search', modelValue: '', debounceMs: 300 } })
    const input = wrapper.find('input')

    await input.setValue('p')
    await input.setValue('pa')
    await input.setValue('pay')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('update:modelValue')).toEqual([['pay']])
  })

  it('reflects external value changes', async () => {
    const wrapper = mount(UiSearchInput, { props: { label: 'Search', modelValue: '' } })
    await wrapper.setProps({ modelValue: 'billing' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('billing')
  })
})
