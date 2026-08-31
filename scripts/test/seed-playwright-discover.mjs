import { resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL
const expectedPath = resolve(process.cwd(), 'test-results/playwright.db')

if (!databaseUrl?.startsWith('file:')) {
  throw new Error('Playwright Discover seed requires a SQLite DATABASE_URL')
}

const rawPath = databaseUrl.slice('file:'.length).split('?', 1)[0]
const actualPath = resolve(rawPath)

if (actualPath !== expectedPath) {
  throw new Error(`Refusing to seed non-disposable database: ${actualPath}`)
}

const db = new PrismaClient({ datasourceUrl: databaseUrl })

try {
  await db.discoverItem.upsert({
    where: { slug: 'playwright-discover-resource' },
    create: {
      slug: 'playwright-discover-resource',
      title: 'منبع آزمایشی Playwright',
      description: 'منبع ثابت برای بررسی مسیر Discover در آزمون مرورگر.',
      content: 'این راهنما فقط در پایگاه داده موقت آزمون ساخته می‌شود.',
      externalUrl: 'https://example.com/tool',
      category: 'آزمایش',
      tags: 'playwright,آزمایش',
      telegramGuideUrl: 'https://t.me/asdev_test/123',
      featured: false,
      published: true,
      order: 9999,
      publishedAt: new Date('2026-08-19T00:00:00.000Z'),
    },
    update: {
      title: 'منبع آزمایشی Playwright',
      description: 'منبع ثابت برای بررسی مسیر Discover در آزمون مرورگر.',
      content: 'این راهنما فقط در پایگاه داده موقت آزمون ساخته می‌شود.',
      externalUrl: 'https://example.com/tool',
      category: 'آزمایش',
      tags: 'playwright,آزمایش',
      imageUrl: null,
      instagramUrl: null,
      telegramGuideUrl: 'https://t.me/asdev_test/123',
      featured: false,
      published: true,
      order: 9999,
      publishedAt: new Date('2026-08-19T00:00:00.000Z'),
    },
  })
} finally {
  await db.$disconnect()
}
