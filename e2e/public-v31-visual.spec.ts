import { test, expect, type Locator, type Page } from '@playwright/test'
import sharp from 'sharp'

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

async function hydrateLazyMedia(page: Page) {
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const step = Math.max(320, Math.floor(window.innerHeight * 0.75))

    for (let y = 0; y <= maxY; y += step) {
      window.scrollTo(0, y)
      await delay(70)
    }

    window.scrollTo(0, maxY)
    await delay(120)
    window.scrollTo(0, 0)
  })

  await page.waitForLoadState('networkidle')
  await page.locator('img').evaluateAll(async (nodes) => {
    await Promise.all(nodes.map(async (node) => {
      const image = node as HTMLImageElement
      if (image.complete && image.naturalWidth > 0) {
        try {
          await image.decode()
        } catch {
          // A decoded screenshot is best-effort; network/server failures stay visible in evidence.
        }
      }
    }))
  })
}

type RenderedImageStats = {
  naturalWidth: number
  naturalHeight: number
  nonNearWhiteRatio: number
  luminanceVariance: number
  tonalRange: number
  edgeDensity: number
  activeCellRatio: number
  quantizedColorCount: number
}

async function sampleRenderedImageStats(locator: Locator): Promise<RenderedImageStats> {
  await locator.scrollIntoViewIfNeeded()
  await expect(locator).toBeVisible()
  await locator.evaluate(async (node) => {
    const image = node as HTMLImageElement
    if (image.complete && image.naturalWidth > 0) {
      try {
        await image.decode()
      } catch {
        // Decoding is best-effort for evidence capture.
      }
    }
  })

  const screenshot = await locator.screenshot({ animations: 'disabled' })
  const { data, info } = await sharp(screenshot).resize(64, 64, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true })

  let nonNearWhite = 0
  let sumL = 0
  let sumL2 = 0
  let minL = 255
  let maxL = 0
  let edgeSum = 0
  const quantized = new Set<string>()
  const cellRows = 4
  const cellCols = 6
  const cellStats = Array.from({ length: cellRows * cellCols }, () => ({
    count: 0,
    sum: 0,
    sum2: 0,
    edge: 0,
  }))

  const luminanceAt = (index: number) => {
    const base = index * info.channels
    const r = data[base]
    const g = data[base + 1]
    const b = data[base + 2]
    return {
      r,
      g,
      b,
      luminance: 0.2126 * r + 0.7152 * g + 0.0722 * b,
    }
  }

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const index = y * info.width + x
      const { r, g, b, luminance } = luminanceAt(index)
      const q = `${r >> 4},${g >> 4},${b >> 4}`
      quantized.add(q)

      sumL += luminance
      sumL2 += luminance * luminance
      minL = Math.min(minL, luminance)
      maxL = Math.max(maxL, luminance)

      if (!(r > 245 && g > 245 && b > 245)) {
        nonNearWhite += 1
      }

      const cellX = Math.min(cellCols - 1, Math.floor((x / info.width) * cellCols))
      const cellY = Math.min(cellRows - 1, Math.floor((y / info.height) * cellRows))
      const cell = cellStats[cellY * cellCols + cellX]
      cell.count += 1
      cell.sum += luminance
      cell.sum2 += luminance * luminance

      if (x + 1 < info.width) {
        const next = luminanceAt(index + 1).luminance
        const diff = Math.abs(next - luminance)
        edgeSum += diff
        cell.edge += diff
      }

      if (y + 1 < info.height) {
        const next = luminanceAt(index + info.width).luminance
        const diff = Math.abs(next - luminance)
        edgeSum += diff
        cell.edge += diff
      }
    }
  }

  const samples = info.width * info.height
  const meanL = sumL / samples
  const luminanceVariance = sumL2 / samples - meanL * meanL
  const edgeDenominator = info.width * (info.height - 1) + info.height * (info.width - 1)
  const activeCellCount = cellStats.filter((cell) => {
    if (cell.count === 0) return false
    const meanCellL = cell.sum / cell.count
    const varianceCellL = cell.sum2 / cell.count - meanCellL * meanCellL
    const edgeDensity = cell.edge / Math.max(1, cell.count)
    return varianceCellL >= 18 || edgeDensity >= 4.8
  }).length

  return {
    naturalWidth: info.width,
    naturalHeight: info.height,
    nonNearWhiteRatio: nonNearWhite / samples,
    luminanceVariance,
    tonalRange: maxL - minL,
    edgeDensity: edgeSum / Math.max(1, edgeDenominator),
    activeCellRatio: activeCellCount / cellStats.length,
    quantizedColorCount: quantized.size,
  }
}

async function capture(page: Page, path: string, file: string, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await hydrateLazyMedia(page)
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

  test('real project imagery stays visibly non-empty in rendered evidence', async ({ page }) => {
    await page.goto('/')
    await hydrateLazyMedia(page)

    const persianToolbox = page.getByRole('img', { name: 'اسکرین‌شات صفحه اصلی PersianToolbox' })
    const auditSystems = page.getByRole('img', { name: 'اسکرین‌شات صفحه اصلی Audit Systems' })

    const persianStats = await sampleRenderedImageStats(persianToolbox)
    const auditStats = await sampleRenderedImageStats(auditSystems)

    const message = `Audit stats=${JSON.stringify(auditStats)} | PersianToolbox stats=${JSON.stringify(persianStats)}`

    expect(auditStats.naturalWidth, message).toBeGreaterThan(0)
    expect(auditStats.naturalHeight, message).toBeGreaterThan(0)
    expect(auditStats.nonNearWhiteRatio, message).toBeGreaterThanOrEqual(Math.min(0.12, persianStats.nonNearWhiteRatio * 0.4))
    expect(auditStats.luminanceVariance, message).toBeGreaterThanOrEqual(Math.min(35, persianStats.luminanceVariance * 0.3))
    expect(auditStats.tonalRange, message).toBeGreaterThanOrEqual(Math.min(60, persianStats.tonalRange * 0.6))
    expect(auditStats.edgeDensity, message).toBeGreaterThanOrEqual(Math.max(3.8, persianStats.edgeDensity * 0.9))
    expect(auditStats.activeCellRatio, message).toBeGreaterThanOrEqual(Math.max(0.24, persianStats.activeCellRatio * 0.8))
    expect(auditStats.quantizedColorCount, message).toBeGreaterThanOrEqual(Math.max(28, persianStats.quantizedColorCount + 8))
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
    await hydrateLazyMedia(page)
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus-visible')).toBeVisible()
    await page.screenshot({ path: 'test-results/v31-evidence/focus-state.png', fullPage: true })
  })

  test('admin control center is isolated from public chrome', async ({ page }) => {
    await signInAsAdmin(page)
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('link', { name: 'ASDEV Control Center' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /Primary navigation|ناوبری اصلی/ })).toHaveCount(0)
    await expect(page.locator('footer')).toHaveCount(0)
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
