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

  test('Projects create, edit, publish, and delete parity', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Username').fill('playwright-admin')
    await page.getByLabel('Password').fill('playwright-only-password-not-for-production')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/admin$/)

    let savedTitle = 'Playwright Audit Project'
    await page.route('**/api/admin/projects**', async (route) => {
      const request = route.request()
      if (request.method() === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
        return
      }
      const body = request.postDataJSON()
      savedTitle = body.title
      await route.fulfill({
        status: request.method() === 'POST' ? 201 : 200,
        contentType: 'application/json',
        body: JSON.stringify({ project: { id: 'project_playwright_123', ...body } }),
      })
    })

    await page.goto('/admin/projects')
    await page.getByLabel('Title', { exact: true }).fill(savedTitle)
    await page.getByLabel('Description', { exact: true }).fill('Evidence-backed project used only for browser regression testing.')
    await page.getByLabel('Tags', { exact: true }).fill('audit,testing')
    await page.getByLabel('Published', { exact: true }).check()
    await page.getByRole('button', { name: 'Save project' }).click()
    await expect(page.getByRole('heading', { name: savedTitle })).toBeVisible()
    await expect(page.getByRole('article').getByText('Published', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: `Edit ${savedTitle}` }).click()
    savedTitle = 'Updated Playwright Audit Project'
    await page.getByLabel('Title', { exact: true }).fill(savedTitle)
    await page.getByRole('button', { name: 'Save project' }).click()
    await expect(page.getByRole('heading', { name: savedTitle })).toBeVisible()

    await page.getByRole('button', { name: `Delete ${savedTitle}` }).click()
    await expect(page.getByRole('dialog')).toContainText(savedTitle)
    await page.getByRole('button', { name: 'Delete permanently' }).click()
    await expect(page.getByRole('heading', { name: savedTitle })).toHaveCount(0)
  })
})
