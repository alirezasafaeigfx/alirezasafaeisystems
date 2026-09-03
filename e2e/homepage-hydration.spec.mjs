import { expect, test } from '@playwright/test'

test('keeps static Home copy out of the client hydration graph', async ({ page }) => {
  const staticCopy = 'Engineering built around real product problems'
  const scriptBodies = []

  page.on('response', (response) => {
    if (response.request().resourceType() !== 'script') return
    scriptBodies.push(response.body().then((body) => body.toString('utf8')))
  })

  await page.goto('/en', { waitUntil: 'networkidle' })

  await expect(page.getByRole('heading', { name: staticCopy })).toBeVisible()
  expect((await Promise.all(scriptBodies)).some((body) => body.includes(staticCopy))).toBe(false)
})
