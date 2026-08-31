import { expect, test } from '@playwright/test'

test('renders a distinct causal topology for every GPU narrative state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const scene = page.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const launcher = scene.locator('[data-gpu-status]')
  await launcher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  const canvas = launcher.locator('canvas')

  const expectedTopologies = [
    'input-diagnosis|diagnosis-release',
    'input-diagnosis|diagnosis-evidence',
    'input-diagnosis|diagnosis-evidence|evidence-release',
    'input-diagnosis|diagnosis-release|release-evidence',
    'input-diagnosis|diagnosis-release|release-evidence|evidence-diagnosis',
  ]

  for (const [index, topology] of expectedTopologies.entries()) {
    await scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button').nth(index).click()
    await expect(canvas).toHaveAttribute('data-scene-topology', topology)
  }
})

test('reconciles the deferred Three.js scene after offscreen and document-visibility pauses', async ({ page }) => {
  test.setTimeout(45_000)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const scene = page.getByTestId('operational-scene')
  await scene.scrollIntoViewIfNeeded()
  const launcher = scene.locator('[data-gpu-status]')
  await launcher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  const canvas = launcher.locator('canvas')
  await expect(canvas).toBeVisible()

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(canvas).toHaveAttribute('data-render-paused', 'offscreen')

  await scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button').nth(4).evaluate((button) => button.click())
  await expect(scene).toHaveAttribute('data-state', 'evidence')
  await canvas.scrollIntoViewIfNeeded()
  await expect(canvas).toHaveAttribute('data-scene-state', 'evidence')
  await expect(canvas).toHaveAttribute('data-render-active', 'false', { timeout: 2_000 })

  await page.evaluate(() => {
    let visibilityState = 'hidden'
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibilityState,
    })
    window.__setSystemCoreVisibility = (next) => {
      visibilityState = next
      document.dispatchEvent(new Event('visibilitychange'))
    }
    window.__setSystemCoreVisibility('hidden')
  })
  await expect(canvas).toHaveAttribute('data-render-paused', 'hidden')

  await scene.getByRole('group', { name: 'انتخاب مرحلهٔ مسیر' }).getByRole('button').nth(1).click()
  await expect(scene).toHaveAttribute('data-state', 'diagnosis')
  await page.evaluate(() => window.__setSystemCoreVisibility('visible'))
  await expect(canvas).toHaveAttribute('data-scene-state', 'diagnosis')
  await expect(canvas).toHaveAttribute('data-render-active', 'false', { timeout: 2_000 })
})

test('releases the GPU route and can activate a clean scene after browser return', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const firstLauncher = page.getByTestId('operational-scene').locator('[data-gpu-status]')
  await firstLauncher.scrollIntoViewIfNeeded()
  await firstLauncher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  await expect(firstLauncher.locator('canvas')).toBeVisible()

  await page.goto('/case-studies/infrastructure-localization-rescue', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toContainText('نجات بومی‌سازی زیرساخت')
  await page.goBack({ waitUntil: 'domcontentloaded' })

  const returnedScene = page.getByTestId('operational-scene')
  const returnedLauncher = returnedScene.locator('[data-gpu-status]')
  await returnedLauncher.scrollIntoViewIfNeeded()
  await expect(returnedLauncher).toHaveAttribute('data-gpu-status', 'idle')
  await returnedLauncher.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }).click()
  await expect(returnedLauncher.locator('canvas')).toBeVisible()
  await expect(returnedLauncher.locator('canvas')).toHaveAttribute('data-render-active', 'false', { timeout: 2_000 })
})
