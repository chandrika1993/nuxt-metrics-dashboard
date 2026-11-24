import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import UiPagination from '../../app/components/ui/UiPagination.vue'

describe('UiPagination', () => {
  it('is a labelled navigation landmark', () => {
    const wrapper = mount(UiPagination, { props: { page: 1, pageCount: 3 } })
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Pagination')
    expect(wrapper.text()).toContain('Page 1 of 3')
  })

  it('disables Previous on the first page and Next on the last page', async () => {
    const wrapper = mount(UiPagination, { props: { page: 1, pageCount: 2 } })
    const [prev, next] = wrapper.findAll('button')
    expect(prev!.attributes('disabled')).toBeDefined()
    expect(next!.attributes('disabled')).toBeUndefined()

    await wrapper.setProps({ page: 2 })
    expect(wrapper.findAll('button')[1]!.attributes('disabled')).toBeDefined()
  })

  it('emits the next page number', async () => {
    const wrapper = mount(UiPagination, { props: { page: 1, pageCount: 2 } })
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:page')).toEqual([[2]])
  })
})
