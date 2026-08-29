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
const evidenceRoot = 'test-results/v31-evidence'
const visualBlogSlug = 'v31-visual-evidence-article'

async function signInAsAdmin(page) {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  expect(username, 'ADMIN_USERNAME must be provided by the Playwright runtime').toBeTruthy()
  expect(password, 'ADMIN_PASSWORD must be provided by the Playwright runtime').toBeTruthy()

  const response = await page.request.post('/api/admin/auth/login', {
    data: { username, password },
  })
  expect(response.ok()).toBe(true)
}

async function ensureVisualBlogFixture(page) {
  await signInAsAdmin(page)

  const listing = await page.request.get('/api/admin/blog')
  expect(listing.ok()).toBe(true)
  const payload = await listing.json()
  const existing = payload.posts?.find((post) => post.slug === visualBlogSlug)
  if (existing) return existing

  const created = await page.request.post('/api/admin/blog', {
    data: {
      title: 'معماری انتشار قابل اتکا برای محصولات واقعی',
      slug: visualBlogSlug,
      excerpt: 'یک fixture پایدار برای بررسی کیفیت ارائه مقاله در ماتریس بصری V3.1.',
      content: '# مسئله\n\nیک انتشار حرفه‌ای باید قابل مشاهده، قابل بازگشت و قابل اثبات باشد.\n\n## اصل اجرایی\n\n- شواهد قبل از ادعا\n- rollback قبل از ریسک\n- کیفیت بصری به‌عنوان gate واقعی',
      tags: ['delivery', 'reliability'],
      category: 'delivery',
      featured: true,
      published: true,
      titleEn: 'Reliable release architecture for real products',
      excerptEn: 'A stable fixture for verifying V3.1 publication-grade article presentation.',
      contentEn: '# The problem\n\nA professional release must be observable, reversible, and provable.\n\n## Operating rule\n\n- Evidence before claims\n- Rollback before risk\n- Visual quality as a real gate',
    },
  })
  expect(created.status()).toBe(201)
  return (await created.json()).post
}

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

  test('captures immutable review evidence for public and admin surfaces', async ({ page }) => {
    await ensureVisualBlogFixture(page)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/v31-evidence/home-fa-mobile-390.png', fullPage: true })

    await page.setViewportSize({ width: 1440, height: 960 })
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/v31-evidence/home-en-desktop-1440.png', fullPage: true })

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/discover')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/v31-evidence/discover-mobile-390.png', fullPage: true })

    await page.setViewportSize({ width: 1440, height: 960 })
    await page.goto('/discover')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/v31-evidence/discover-desktop-1440.png', fullPage: true })

    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()
    await page.screenshot({ path: 'test-results/v31-evidence/blog-landing-desktop.png', fullPage: true })

    await page.goto(`/blog/${visualBlogSlug}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('article h1')).toHaveCount(1)
    await page.screenshot({ path: 'test-results/v31-evidence/blog-article-desktop.png', fullPage: true })

    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin(?:\/|$)/)
    await page.screenshot({ path: 'test-results/v31-evidence/admin-dashboard-desktop.png', fullPage: true })
  })
})
