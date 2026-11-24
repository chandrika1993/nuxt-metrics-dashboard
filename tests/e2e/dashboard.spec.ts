import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('overview', () => {
  test('shows KPIs and the first page of teams', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Delivery health' })).toBeVisible()
    await expect(page.getByText('Median lead time')).toBeVisible()
    await expect(page.getByRole('status')).toHaveText('12 teams found')
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(10)
  })

  test('search filters the table and is kept in the URL', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Search teams').fill('pay')
    await expect(page).toHaveURL(/q=pay/)
    await expect(page.getByRole('status')).toHaveText('1 team found')
    await expect(page.getByRole('link', { name: 'Payments' })).toBeVisible()

    // A shared or reloaded URL restores the same view.
    await page.reload()
    await expect(page.getByLabel('Search teams')).toHaveValue('pay')
    await expect(page.getByRole('status')).toHaveText('1 team found')
  })

  test('shows an empty state when nothing matches', async ({ page }) => {
    await page.goto('/?q=zzz')
    await expect(page.getByText('No teams match "zzz".')).toBeVisible()
  })

  test('sorting works from the keyboard and updates aria-sort', async ({ page }) => {
    await page.goto('/')
    const header = page.getByRole('columnheader', { name: /Deploys \/ week/ })
    await header.getByRole('button').focus()
    await page.keyboard.press('Enter')
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
    await expect(page).toHaveURL(/sort=deploysPerWeek&dir=asc/)

    await page.keyboard.press('Enter')
    await expect(header).toHaveAttribute('aria-sort', 'descending')
  })

  test('paginates to the second page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveURL(/page=2/)
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(2)
  })

  test('has no detectable WCAG A/AA violations', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations).toEqual([])
  })
})

test.describe('team detail', () => {
  test('drills down from the table', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Payments' }).click()
    await expect(page).toHaveURL('/teams/payments')
    await expect(page.getByRole('heading', { level: 1, name: 'Payments' })).toBeVisible()
    await expect(page.getByRole('figure', { name: 'Deployments per week (last 8 weeks)' })).toBeVisible()
    // The chart data is also exposed as a table for screen reader users.
    await expect(page.getByRole('table', { name: 'Deployments per week (last 8 weeks)' })).toBeAttached()
  })

  test('shows a not-found state for unknown teams', async ({ page }) => {
    await page.goto('/teams/does-not-exist')
    await expect(page.getByRole('heading', { name: 'Team not found' })).toBeVisible()
  })

  test('has no detectable WCAG A/AA violations', async ({ page }) => {
    await page.goto('/teams/payments')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations).toEqual([])
  })
})
