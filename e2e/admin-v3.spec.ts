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
