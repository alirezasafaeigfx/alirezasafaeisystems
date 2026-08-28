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
  async function signIn(page: import('@playwright/test').Page) {
    await page.goto('/admin/login')
    await page.getByLabel('Username').fill(process.env.ADMIN_USERNAME ?? '')
    await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD ?? '')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/admin$/)
  }

  test('Blog draft can be created and deleted', async ({ page }) => {
    await signIn(page)
    await page.goto('/admin/blog')
    await page.getByLabel('Title').fill('E2E Insight')
    await page.getByLabel('Slug').fill(`e2e-insight-${Date.now()}`)
    await page.getByLabel('Excerpt').fill('A concise engineering insight.')
    await page.getByLabel('Content').fill('# Reliable delivery')
    await page.getByRole('button', { name: 'Save draft' }).click()
    await expect(page.getByText('E2E Insight')).toBeVisible()
    const draft = page.getByRole('article').filter({ hasText: 'E2E Insight' })
    page.once('dialog', (dialog) => dialog.accept())
    await draft.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByText('E2E Insight', { exact: true })).toHaveCount(0)
  })

  test('keeps route state and exposes every module link', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Username').fill(process.env.ADMIN_USERNAME ?? '')
    await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD ?? '')
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
    await page.getByLabel('Username').fill(process.env.ADMIN_USERNAME ?? '')
    await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD ?? '')
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

  test('Discover item can be published, previewed, edited, and deleted', async ({ page }) => {
    const slug = `e2e-discover-${Date.now()}`
    const title = `E2E Discover Resource ${Date.now()}`
    await signIn(page)
    await page.goto('/admin/discover')
    await page.getByLabel('Title').fill(title)
    await page.getByLabel('Slug').fill(slug)
    await page.getByLabel('Category').fill('Engineering')
    await page.getByLabel('Short description').fill('A real browser lifecycle check for the Discover authoring flow.')
    await page.getByLabel('Short practical guide').fill('Open the official destination and follow the documented setup steps.')
    await page.getByLabel('Official HTTPS URL').fill('https://example.com/e2e-discover')
    await page.getByLabel('Published').check()
    await page.getByRole('button', { name: 'Save Discover item' }).click()
    const item = page.getByText(title, { exact: true }).locator('xpath=ancestor::div[contains(@class,"rounded-xl")][1]')
    await expect(item).toBeVisible()
    await expect(item.getByText('Published', { exact: true })).toBeVisible()
    const preview = page.locator(`a[href="/discover/${slug}"]`)
    await expect(preview).toHaveAttribute('href', `/discover/${slug}`)
    await page.goto(`/discover/${slug}`)
    await expect(page.locator('h1')).toHaveText(title)
    await page.goto('/admin/discover')
    await item.getByRole('button', { name: 'Edit' }).click()
    await page.getByLabel('Title').fill(`${title} Updated`)
    await page.getByRole('button', { name: 'Save Discover item' }).click()
    await expect(page.getByText(`${title} Updated`, { exact: true })).toBeVisible()
    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: `Delete ${title} Updated` }).click()
    await expect(page.getByText(`${title} Updated`, { exact: true })).toHaveCount(0)
  })

  test('Blog post can be published and read through its public route', async ({ page }) => {
    const slug = `e2e-blog-${Date.now()}`
    const title = `E2E Published Insight ${Date.now()}`
    await signIn(page)
    await page.goto('/admin/blog')
    await page.getByLabel('Title').fill(title)
    await page.getByLabel('Slug').fill(slug)
    await page.getByLabel('Excerpt').fill('A published article used only to verify the authoring and public route contract.')
    await page.getByLabel('Content').fill('# Evidence-backed release verification')
    await page.getByRole('button', { name: 'Publish', exact: true }).click()
    await expect(page.getByText(title, { exact: true })).toBeVisible()
    await expect(page.getByText(`Published · ${slug}`, { exact: true })).toBeVisible()
    await page.goto(`/blog/${slug}`)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  })
})
