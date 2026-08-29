import { test, expect, type Page } from '@playwright/test'

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
const visualBlogSlug = 'v31-visual-evidence-article'
const adminSessionCookieName = 'asdev_admin_session'

const publicEvidenceCases = [
  { path: '/', file: 'home-fa-1440.png', width: 1440, height: 960 },
  { path: '/', file: 'home-fa-390.png', width: 390, height: 844 },
  { path: '/en', file: 'home-en-1440.png', width: 1440, height: 960 },
  { path: '/en', file: 'home-en-390.png', width: 390, height: 844 },
  { path: '/discover', file: 'discover-fa-1440.png', width: 1440, height: 960 },
  { path: '/discover', file: 'discover-fa-390.png', width: 390, height: 844 },
  {
    path: '/discover/playwright-discover-resource',
    file: 'discover-detail.png',
    width: 1440,
    height: 960,
  },
] as const

type VisualBlogPost = {
  slug: string
}

async function signInAsAdmin(page: Page) {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  expect(username, 'ADMIN_USERNAME must be provided by the Playwright runtime').toBeTruthy()
  expect(password, 'ADMIN_PASSWORD must be provided by the Playwright runtime').toBeTruthy()

  const response = await page.request.post('/api/admin/auth/login', {
    data: { username, password },
  })
  expect(response.ok()).toBe(true)

  // The production server correctly emits a Secure session cookie. Playwright's
  // local review server is HTTP, so copy the already-signed token into this
  // disposable browser context only; production cookie policy stays untouched.
  const setCookie = response.headers()['set-cookie']
  const match = setCookie?.match(new RegExp(`${adminSessionCookieName}=([^;]+)`))
  expect(match?.[1], 'admin login must return a signed session cookie').toBeTruthy()

  const origin = new URL(response.url()).origin
  await page.context().addCookies([
    {
      name: adminSessionCookieName,
      value: match?.[1] ?? '',
      url: `${origin}/`,
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    },
  ])
}

async function ensureVisualBlogFixture(page: Page): Promise<VisualBlogPost> {
  await signInAsAdmin(page)

  const listing = await page.request.get('/api/admin/blog')
  expect(listing.ok()).toBe(true)
  const payload = await listing.json() as { posts?: VisualBlogPost[] }
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
  const body = await created.json() as { post: VisualBlogPost }
  return body.post
}

async function capture(page: Page, path: string, file: string, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `test-results/v31-evidence/${file}`, fullPage: true })
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

  for (const evidence of publicEvidenceCases) {
    test(`captures ${evidence.file}`, async ({ page }) => {
      await capture(page, evidence.path, evidence.file, evidence.width, evidence.height)
    })
  }

  test('captures blog landing evidence', async ({ page }) => {
    await ensureVisualBlogFixture(page)
    await capture(page, '/blog', 'blog-landing.png', 1440, 960)
  })

  test('captures blog article evidence', async ({ page }) => {
    await ensureVisualBlogFixture(page)
    await capture(page, `/blog/${visualBlogSlug}`, 'blog-article.png', 1440, 960)
    await expect(page.locator('article h1')).toHaveCount(1)
  })

  test('captures visible keyboard focus evidence', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus-visible')).toBeVisible()
    await page.screenshot({ path: 'test-results/v31-evidence/focus-state.png', fullPage: true })
  })

  test('captures authenticated admin dashboard evidence', async ({ page }) => {
    await signInAsAdmin(page)
    await page.setViewportSize({ width: 1440, height: 960 })
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin(?:\/|$)/)
    await page.screenshot({ path: 'test-results/v31-evidence/admin-dashboard-desktop.png', fullPage: true })
  })
})
