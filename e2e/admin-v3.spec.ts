import { expect, test } from '@playwright/test'

test.describe('Admin Control Center V3 authentication boundary', () => {
  for (const route of ['/admin', '/admin/leads', '/admin/messages', '/admin/projects', '/admin/discover', '/admin/blog', '/admin/analytics']) {
    test(`redirects unauthenticated ${route} to login`, async ({ page }) => {
      await page.goto(route)
      await expect(page).toHaveURL(/\/admin\/login(?:\?|$)/)
      await expect(page.getByText('Admin Login', { exact: true })).toBeVisible()
    })
  }
})

test.describe('Admin Control Center V3 authenticated shell', () => {
  test('keeps route state and exposes every module link', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Username').fill('playwright-admin')
    await page.getByLabel('Password').fill('playwright-only-password-not-for-production')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL(/\/admin$/)
    const navigation = page.getByRole('navigation', { name: 'Admin navigation' })
    for (const href of ['/admin', '/admin/leads', '/admin/messages', '/admin/projects', '/admin/discover', '/admin/blog', '/admin/analytics']) {
      await expect(navigation.locator(`a[href="${href}"]`)).toBeVisible()
    }

    await navigation.getByRole('link', { name: 'Leads' }).click()
    await expect(page).toHaveURL(/\/admin\/leads$/)
    await page.reload()
    await expect(page).toHaveURL(/\/admin\/leads$/)
  })
})
