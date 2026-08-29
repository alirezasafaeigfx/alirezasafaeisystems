import { test, expect } from '@playwright/test'

const viewportMatrix = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 960 },
  { width: 1728, height: 1000 },
]

const publicRoutes = ['/', '/discover', '/blog']

test.describe('V3.1 public visual contract', () => {
  for (const viewport of viewportMatrix) {
    for (const path of publicRoutes) {
      test(`${path} has no horizontal document overflow at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(path)
        await page.waitForLoadState('networkidle')

        const dimensions = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))

        expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
      })
    }
  }

  test('keyboard navigation exposes a visible focus indicator', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const focused = page.locator(':focus-visible')
    await expect(focused).toBeVisible()
    await expect(focused).not.toHaveCSS('outline-style', 'none')
  })

  test('project media gets restrained hover authorship in normal motion', async ({ page }) => {
    await page.goto('/')
    const media = page.locator('.public-project-media').first()
    await expect(media).toBeVisible()

    const before = await media.evaluate((element) => getComputedStyle(element).transform)
    await media.hover()
    await expect.poll(async () => media.evaluate((element) => getComputedStyle(element).transform)).not.toBe(before)
  })

  test('reduced motion disables project-media transforms while keeping essential content visible', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()

    const media = page.locator('.public-project-media').first()
    await expect(media).toBeVisible()
    await media.hover()
    await expect(media).toHaveCSS('transform', 'none')
    await expect(media).toHaveCSS('transition-duration', '0s')

    await context.close()
  })
})
