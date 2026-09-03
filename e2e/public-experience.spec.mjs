import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

const candidateSha = process.env.PUBLIC_EXPERIENCE_CANDIDATE_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const evidenceDir = resolve(process.cwd(), 'test-results/public-experience', candidateSha)
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]

test.beforeAll(() => mkdirSync(evidenceDir, { recursive: true }))

async function loadImagesForCapture(page) {
  const images = page.locator('img')
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index)
    await image.scrollIntoViewIfNeeded()
    await expect.poll(
      () => image.evaluate((element) => element.complete ? 'complete' : 'pending'),
      { timeout: 15_000 },
    ).toBe('complete')
  }
  const broken = await images.evaluateAll((elements) => elements.filter((image) => image.naturalWidth === 0).map((image) => image.currentSrc || image.src))
  expect(broken).toEqual([])
}

test('captures the authored FA and EN route composition at required widths', async ({ page }) => {
  test.setTimeout(90_000)
  const captures = []
  for (const locale of ['fa', 'en']) {
    for (const theme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: theme })
      for (const viewport of viewports) {
        await page.goto('about:blank')
        await page.setViewportSize(viewport)
        await page.goto(locale === 'fa' ? '/' : '/en', { waitUntil: 'domcontentloaded' })
        await loadImagesForCapture(page)
        await page.evaluate(() => {
          document.documentElement.style.scrollBehavior = 'auto'
          window.scrollTo(0, 0)
        })
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
      const hero = page.getByLabel(locale === 'fa' ? 'معرفی علیرضا صفایی' : 'Alireza Safaei introduction')
      const proof = page.getByLabel(locale === 'fa' ? 'شواهد واقعی' : 'Real evidence')
      const flagship = page.getByLabel(locale === 'fa' ? 'مطالعه موردی اصلی' : 'Flagship case study')
      const projects = page.getByLabel(locale === 'fa' ? 'پروژه‌های منتخب' : 'Selected projects')
      const services = page.getByLabel(locale === 'fa' ? 'خدمات اصلی' : 'Core services')
      const founder = page.getByLabel(locale === 'fa' ? 'درباره علیرضا صفایی' : 'About Alireza Safaei')
      await expect(hero).toBeVisible()
      await expect(hero.getByTestId('operational-scene')).toBeVisible()
      await expect(hero.getByTestId('owner-portrait-frame')).toHaveCount(0)
      await expect(founder.getByTestId('owner-portrait-frame')).toBeVisible()
      const order = await page.locator('main section').evaluateAll((sections) => sections.map((section) => section.getAttribute('aria-label')).filter(Boolean))
      const labels = locale === 'fa'
        ? ['معرفی علیرضا صفایی', 'شواهد واقعی', 'مطالعه موردی اصلی', 'خدمات اصلی', 'پروژه‌های منتخب', 'درباره علیرضا صفایی', 'درخواست نهایی ارزیابی']
        : ['Alireza Safaei introduction', 'Real evidence', 'Flagship case study', 'Core services', 'Selected projects', 'About Alireza Safaei', 'Final assessment request']
      expect(labels.every((label) => order.includes(label))).toBe(true)
      for (let index = 1; index < labels.length; index += 1) expect(order.indexOf(labels[index])).toBeGreaterThan(order.indexOf(labels[index - 1]))
      await expect(proof.getByRole('status')).toContainText(locale === 'fa' ? 'تأیید مستقل نشده' : 'independent approval')
      await expect(flagship.getByTestId('flagship-project')).toBeVisible()
      await expect(projects.getByTestId('discover-preview')).toBeVisible()
      await expect(services.getByRole('article')).toHaveCount(3)
        const file = `${locale}-${theme}-${viewport.name}-${viewport.width}.png`
        await page.screenshot({ path: resolve(evidenceDir, file), fullPage: true, animations: 'disabled' })
        captures.push({ locale, theme, viewport: `${viewport.width}x${viewport.height}`, file })
      }
    }
  }
  writeFileSync(resolve(evidenceDir, 'visual-matrix.json'), `${JSON.stringify(captures, null, 2)}\n`)
})

test('records all five scene states and finite reduced-motion behavior on the actual Home route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const scene = page.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const states = []
  const buttons = scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button')
  await expect(buttons).toHaveCount(5)
  for (let index = 0; index < 5; index += 1) {
    await buttons.nth(index).click()
    const state = await scene.getAttribute('data-state')
    const path = await scene.getByTestId('operational-scene-path').getAttribute('d')
    const activeNodes = await scene.locator('[data-active="true"]').count()
    states.push({ index, state, path, activeNodes })
    await scene.screenshot({ path: resolve(evidenceDir, `scene-${index + 1}-${state}.png`), animations: 'disabled' })
  }
  expect(states.map((item) => item.state)).toEqual(['pressure', 'diagnosis', 'intervention', 'stable', 'evidence'])
  expect(new Set(states.map((item) => `${item.path}:${item.activeNodes}`)).size).toBe(5)
  const runningAnimations = await scene.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length)
  expect(runningAnimations).toBe(0)
  writeFileSync(resolve(evidenceDir, 'scene-states.json'), `${JSON.stringify(states, null, 2)}\n`)
})

test('records an actual five-state interaction video', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    recordVideo: { dir: evidenceDir, size: { width: 390, height: 844 } },
  })
  const motionPage = await context.newPage()
  await motionPage.goto('/', { waitUntil: 'domcontentloaded' })
  const scene = motionPage.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const buttons = scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button')
  for (let index = 0; index < 5; index += 1) {
    await buttons.nth(index).click()
    await motionPage.waitForTimeout(520)
  }
  for (let index = 3; index >= 0; index -= 1) {
    await buttons.nth(index).click()
    await motionPage.waitForTimeout(520)
  }
  await expect(scene).toHaveAttribute('data-state', 'pressure')
  const video = motionPage.video()
  await motionPage.close()
  await video?.saveAs(resolve(evidenceDir, 'five-state-interaction.webm'))
  await context.close()
})

test('defers the real Three.js prototype, records its finite states, and releases it', async ({ page }) => {
  test.setTimeout(60_000)
  const scripts = []
  let loadingPhase = 'initial'
  page.on('response', async (response) => {
    if (response.request().resourceType() !== 'script') return
    try {
      const body = await response.body()
      scripts.push({ url: response.url(), bytes: body.byteLength, gzipBytes: gzipSync(body).byteLength, phase: loadingPhase })
    } catch {
      scripts.push({ url: response.url(), bytes: null, gzipBytes: null, phase: loadingPhase })
    }
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-gpu-status]').waitFor()
  await page.waitForTimeout(500)
  const scene = page.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const launcher = scene.locator('[data-gpu-status]')
  await expect(launcher).toHaveAttribute('data-gpu-status', 'idle')
  await expect(launcher.locator('canvas')).toHaveCount(0)
  const beforeUrls = new Set(scripts.map((item) => item.url))

  loadingPhase = 'activation'
  await launcher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  await expect(launcher).toHaveAttribute('data-gpu-status', 'active')
  const canvas = launcher.locator('canvas')
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('data-render-active', 'false', { timeout: 2_000 })

  const stateButtons = scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button')
  const stateNames = ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence']
  for (const index of [1, 4, 2, 0, 3]) {
    await stateButtons.nth(index).click()
    const selectedState = stateNames[index]
    await expect(canvas).toHaveAttribute('data-scene-state', selectedState, { timeout: 2_000 })
    await launcher.screenshot({ path: resolve(evidenceDir, `three-state-${selectedState}-mobile.png`), animations: 'disabled' })
  }
  await expect(scene).toHaveAttribute('data-state', 'stable')
  await expect(canvas).toHaveAttribute('data-render-active', 'false', { timeout: 2_000 })
  await scene.screenshot({ path: resolve(evidenceDir, 'three-prototype-mobile.png'), animations: 'disabled' })
  await page.setViewportSize({ width: 844, height: 390 })
  await expect(canvas).toBeVisible()
  await scene.evaluate((element) => element.scrollIntoView({ block: 'start' }))
  const headerBox = await page.getByRole('banner').boundingBox()
  const titleBox = await scene.getByRole('heading', { name: 'مشکل را می‌بینیم، مسیر درست را پیدا می‌کنیم' }).boundingBox()
  expect(headerBox && titleBox && headerBox.y + headerBox.height <= titleBox.y).toBe(true)
  await scene.screenshot({ path: resolve(evidenceDir, 'three-prototype-landscape.png'), animations: 'disabled' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(canvas).toBeVisible()
  await scene.screenshot({ path: resolve(evidenceDir, 'three-prototype-desktop.png'), animations: 'disabled' })

  const deferredScripts = scripts.filter((item) => !beforeUrls.has(item.url))
  const deferredUrls = new Set(deferredScripts.map((item) => item.url))
  const metrics = {
    deferredScripts,
    gzipBytes: deferredScripts.reduce((sum, item) => sum + (item.gzipBytes ?? 0), 0),
    initialGpuBytes: scripts.filter((item) => item.phase === 'initial' && deferredUrls.has(item.url)).reduce((sum, item) => sum + (item.bytes ?? 0), 0),
    finalState: await scene.getAttribute('data-state'),
    idleRenderLoop: await canvas.getAttribute('data-render-active'),
  }
  writeFileSync(resolve(evidenceDir, 'three-prototype-budgets.json'), `${JSON.stringify(metrics, null, 2)}\n`)
  expect(metrics.gzipBytes).toBeLessThanOrEqual(250 * 1024)
  expect(deferredScripts.length).toBeGreaterThan(0)

  await launcher.getByRole('button', { name: 'بستن نمونه سه‌بعدی' }).click()
  await expect(launcher).toHaveAttribute('data-gpu-status', 'idle')
  await expect(launcher.locator('canvas')).toHaveCount(0)

  await launcher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  const restoredCanvas = launcher.locator('canvas')
  await expect(restoredCanvas).toBeVisible()
  await restoredCanvas.dispatchEvent('webglcontextlost')
  await expect(launcher).toHaveAttribute('data-gpu-status', 'failed')
  await expect(launcher.getByRole('status')).toContainText('متوقف شد')
})

test('records the real GPU topology moving through all five states and back', async ({ browser, baseURL }) => {
  test.setTimeout(60_000)
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 1200 },
    recordVideo: { dir: evidenceDir, size: { width: 390, height: 1200 } },
  })
  const gpuPage = await context.newPage()
  await gpuPage.goto('/', { waitUntil: 'domcontentloaded' })
  const scene = gpuPage.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const launcher = scene.locator('[data-gpu-status]')
  await launcher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  const canvas = launcher.locator('canvas')
  await expect(canvas).toBeVisible()
  await canvas.evaluate((element) => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 120)
  })
  await gpuPage.waitForTimeout(100)
  const canvasBox = await canvas.boundingBox()
  const viewportHeight = await gpuPage.evaluate(() => window.innerHeight)
  expect(canvasBox && canvasBox.y >= 0 && canvasBox.y + canvasBox.height <= viewportHeight).toBe(true)
  const buttons = scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button')
  for (const index of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    await buttons.nth(index).evaluate((button) => button.click())
    await expect(canvas).toHaveAttribute('data-scene-state', ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence'][index], { timeout: 2_000 })
    await gpuPage.waitForTimeout(160)
  }
  await expect(canvas).toHaveAttribute('data-scene-state', 'pressure')
  const video = gpuPage.video()
  await gpuPage.close()
  await video?.saveAs(resolve(evidenceDir, 'three-state-interaction.webm'))
  await context.close()
})

test('keeps the complete native scene when the deferred GPU module is blocked', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const scene = page.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const launcher = scene.locator('[data-gpu-status]')
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'script') await route.abort()
    else await route.continue()
  })
  await launcher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  await expect(launcher).toHaveAttribute('data-gpu-status', 'failed')
  await expect(launcher.getByRole('status')).toContainText('نسخه دوبعدی بالا همچنان قابل استفاده است')
  await expect(scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button')).toHaveCount(5)
  await scene.screenshot({ path: resolve(evidenceDir, 'three-blocked-module-fallback.png'), animations: 'disabled' })
})

test('does not request the 3D island when reduced motion blocks activation', async ({ page }) => {
  const scriptUrls = []
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script') scriptUrls.push(response.url())
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const launcher = page.locator('[data-gpu-status]')
  await launcher.waitFor()
  await page.waitForTimeout(500)
  const before = [...scriptUrls]
  await launcher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  await expect(launcher).toHaveAttribute('data-gpu-status', 'reduced-motion')
  await expect(launcher.getByRole('status')).toContainText('حرکت کمتر')
  await page.waitForTimeout(500)
  expect(scriptUrls).toEqual(before)
})

test('measures the mobile route budgets without substituting an aggregate score', async ({ page }) => {
  const transfers = []
  page.on('response', async (response) => {
    try {
      const body = await response.body()
      transfers.push({ url: response.url(), type: response.request().resourceType(), bytes: body.byteLength })
    } catch {
      transfers.push({ url: response.url(), type: response.request().resourceType(), bytes: null })
    }
  })
  await page.addInitScript(() => {
    window.__publicExperienceMetrics = { cls: 0, lcp: 0, longTasks: [] }
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__publicExperienceMetrics.cls += entry.value
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      window.__publicExperienceMetrics.lcp = entries.at(-1)?.startTime ?? window.__publicExperienceMetrics.lcp
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((list) => {
      window.__publicExperienceMetrics.longTasks.push(...list.getEntries().map((entry) => ({
        startTime: entry.startTime,
        duration: entry.duration,
        attribution: entry.attribution?.map((item) => ({ containerType: item.containerType, containerName: item.containerName, containerSrc: item.containerSrc })) ?? [],
      })))
    }).observe({ type: 'longtask', buffered: true })
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const scene = page.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const startedAt = await page.evaluate(() => performance.now())
  await scene.getByRole('button', { name: /مشکل رو پیدا می‌کنیم/ }).click()
  await expect(scene).toHaveAttribute('data-state', 'diagnosis')
  const endedAt = await page.evaluate(() => performance.now())
  await page.waitForTimeout(750)
  const performanceMetrics = await page.evaluate(() => ({
    ...window.__publicExperienceMetrics,
    runningAnimations: document.getAnimations().filter((animation) => animation.playState === 'running').length,
  }))
  const metrics = {
    ...performanceMetrics,
    interactionMs: endedAt - startedAt,
    scriptBytes: transfers.filter((item) => item.type === 'script').reduce((sum, item) => sum + (item.bytes ?? 0), 0),
    imageBytes: transfers.filter((item) => item.type === 'image').reduce((sum, item) => sum + (item.bytes ?? 0), 0),
    gpuModuleBytesBeforeActivation: transfers.filter((item) => /three|webgl|gpu-island/i.test(item.url)).reduce((sum, item) => sum + (item.bytes ?? 0), 0),
    transferEntries: transfers,
    limitations: ['scriptBytes is an absolute local-build transfer size, not the required delta against the immutable baseline'],
  }
  writeFileSync(resolve(evidenceDir, 'mobile-budgets.json'), `${JSON.stringify(metrics, null, 2)}\n`)
  expect(metrics.lcp).toBeLessThanOrEqual(2500)
  expect(metrics.cls).toBeLessThanOrEqual(0.1)
  expect(metrics.interactionMs).toBeLessThanOrEqual(200)
  expect(metrics.gpuModuleBytesBeforeActivation).toBe(0)
  expect(metrics.runningAnimations).toBe(0)
})

test('keeps the five-state explanation available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const noScriptPage = await context.newPage()
  await noScriptPage.goto('/')
  const scene = noScriptPage.getByTestId('operational-scene')
  await expect(noScriptPage.getByLabel('معرفی علیرضا صفایی')).toBeVisible()
  await expect(scene).toBeVisible()
  await expect(scene.getByTestId('operational-scene-fallback')).toBeVisible()
  await expect(scene.getByTestId('operational-scene-fallback')).toContainText('این نمونهٔ آموزشی بدون تعامل هم کامل است')
  await expect(scene.getByTestId('operational-scene-fallback').locator('li')).toHaveCount(5)
  await noScriptPage.screenshot({ path: resolve(evidenceDir, 'fa-mobile-no-js.png'), fullPage: true })
  await context.close()
})

test('captures the truthful flagship route in both languages and print-safe reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const locale of ['fa', 'en']) {
    const path = `${locale === 'en' ? '/en' : ''}/case-studies/infrastructure-localization-rescue`
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toContainText(locale === 'fa' ? 'نجات بومی‌سازی زیرساخت' : 'Infrastructure Localization Rescue')
    await expect(page.getByTestId('flagship-topology').getByRole('listitem')).toHaveCount(5)
    await expect(page.getByRole('status')).toContainText(locale === 'fa' ? 'تا پایان بازبینی مستقل' : 'independent review')
    await page.screenshot({ path: resolve(evidenceDir, `flagship-${locale}-mobile.png`), fullPage: true, animations: 'disabled' })
  }
  await page.context().clearCookies()
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' })
  await page.goto('/case-studies/infrastructure-localization-rescue', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.locator('#main-content')).toBeVisible()
  await page.screenshot({ path: resolve(evidenceDir, 'flagship-fa-print-reduced-motion.png'), fullPage: true, animations: 'disabled' })
})

test('keeps Discover query and SEO truth under a controlled slow connection', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 100_000, connectionType: 'cellular3g' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/discover?q=playwright', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ابزار را پیدا کن')
  await expect(page.getByRole('searchbox', { name: 'جستجوی منابع' })).toHaveValue('playwright')
  await expect(page.getByRole('heading', { name: 'Playwright Fixture 01' })).toBeVisible()
  await expect(page.getByLabel('منبع: Playwright Fixture 01').getByText('test-fixture', { exact: true })).toBeVisible()
  await expect(page.getByText('منبع آزمایشی Playwright')).toHaveCount(0)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/discover$/)
  await page.screenshot({ path: resolve(evidenceDir, 'discover-fa-query-slow-network.png'), fullPage: true, animations: 'disabled' })
})