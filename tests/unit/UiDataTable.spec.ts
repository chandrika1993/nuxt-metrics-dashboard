import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import UiDataTable from '../../app/components/ui/UiDataTable.vue'

interface Row { id: string, name: string, deploys: number }

const columns = [
  { key: 'name', label: 'Team', sortable: true },
  { key: 'deploys', label: 'Deploys', sortable: true, numeric: true },
] as const

const rows: Row[] = [
  { id: 'a', name: 'Payments', deploys: 12 },
  { id: 'b', name: 'Billing', deploys: 4 },
]

function mountTable(props: Record<string, unknown> = {}) {
  return mount(UiDataTable, {
    props: { caption: 'Teams', columns, rows, rowKey: 'name', ...props },
  })
}

describe('UiDataTable', () => {
  it('renders a captioned table with one row per item', () => {
    const wrapper = mountTable()
    expect(wrapper.find('caption').text()).toBe('Teams')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('exposes the active sort to assistive technology via aria-sort', () => {
    const wrapper = mountTable({ sortKey: 'deploys', sortDir: 'desc' })
    const headers = wrapper.findAll('th')
    expect(headers[0]!.attributes('aria-sort')).toBeUndefined()
    expect(headers[1]!.attributes('aria-sort')).toBe('descending')
  })

  it('uses real buttons for sortable headers and emits the column key', async () => {
    const wrapper = mountTable()
    const button = wrapper.find('th button')
    expect(button.attributes('type')).toBe('button')
    await button.trigger('click')
    expect(wrapper.emitted('sort')).toEqual([['name']])
  })

  it('renders custom cell slots', () => {
    const wrapper = mount(UiDataTable, {
      props: { caption: 'Teams', columns, rows, rowKey: 'name' },
      slots: { 'cell-name': '<template #cell-name="{ row }"><a :href="`/teams/${row.id}`">{{ row.name }}</a></template>' },
    })
    expect(wrapper.find('tbody a').attributes('href')).toBe('/teams/a')
  })

  it('shows the empty state when there are no rows', () => {
    const wrapper = mountTable({ rows: [] })
    expect(wrapper.find('.empty').text()).toBe('No results.')
  })

  it('hides the empty state while loading', () => {
    const wrapper = mountTable({ rows: [], loading: true })
    expect(wrapper.find('.empty').exists()).toBe(false)
    expect(wrapper.find('.wrapper').attributes('aria-busy')).toBe('true')
  })
})
