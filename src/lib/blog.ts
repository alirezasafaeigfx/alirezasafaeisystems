import { z } from 'zod'

export const BLOG_CATEGORIES = ['engineering', 'architecture', 'reliability', 'seo', 'delivery'] as const
const slugSchema = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const text = (max: number) => z.string().trim().min(1).max(max)
const optionalText = (max: number) => z.union([z.literal(''), text(max), z.null()]).optional().transform((v) => v === '' ? null : v)
const tags = z.union([z.array(z.string().trim().min(1).max(40)), z.string()]).transform((v) => [...new Set((Array.isArray(v) ? v : v.split(',')).map((x) => x.trim()).filter(Boolean))]).refine((v) => v.length <= 20)

export const blogCreateSchema = z.object({
  title: text(180), slug: slugSchema, excerpt: text(500), content: text(50000), coverImage: optionalText(2000),
  tags, category: z.enum(BLOG_CATEGORIES).default('engineering'), featured: z.boolean().default(false), published: z.boolean().default(false),
  titleEn: optionalText(180), excerptEn: optionalText(500), contentEn: optionalText(50000), seoTitle: optionalText(160), seoDescription: optionalText(320), seoTitleEn: optionalText(160), seoDescriptionEn: optionalText(320), lastReviewedAt: z.string().datetime().nullable().optional().transform((v) => v ? new Date(v) : null),
})
export const blogUpdateSchema = blogCreateSchema.partial().extend({ id: z.string().trim().min(10).max(200) })

export function hasCompleteBlogTranslation(post: { titleEn?: string | null; excerptEn?: string | null; contentEn?: string | null }): boolean {
  return Boolean(post.titleEn?.trim() && post.excerptEn?.trim() && post.contentEn?.trim())
}

export function estimateReadTime(markdown: string, locale: 'fa' | 'en'): number {
  const words = markdown.replace(/[`*_>#\[\]()]/g, ' ').trim().split(/\s+/).filter(Boolean).length
  const perMinute = locale === 'fa' ? 180 : 220
  return Math.max(1, Math.ceil(words / perMinute))
}
