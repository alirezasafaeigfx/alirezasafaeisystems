import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { blogCreateSchema, blogUpdateSchema, estimateReadTime } from '@/lib/blog'
import { sanitizeInput } from '@/lib/validators'

const json = (r: NextRequest) => (r.headers.get('content-type') ?? '').split(';')[0].trim() === 'application/json'
const response = (body: unknown, status: number, id: string, headers: Record<string,string>) => withCommonApiHeaders(NextResponse.json(body, { status }), id, headers)
const unique = (e: unknown) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'

export async function GET(request: NextRequest) {
  const id = createRequestId(request); const denied = await enforceAdminAccess(request, id); if (denied) return denied; const limit = await checkRateLimit(request, 'admin:blog:get'); if (!limit.allowed) return response({ error: 'Too many requests' }, 429, id, limit.headers)
  const published = request.nextUrl.searchParams.get('published'); const category = request.nextUrl.searchParams.get('category')
  const posts = await db.blogPost.findMany({ where: { ...(published === 'true' || published === 'false' ? { published: published === 'true' } : {}), ...(category ? { category } : {}) }, orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }] })
  return response({ posts }, 200, id, limit.headers)
}

export async function POST(request: NextRequest) {
  const id = createRequestId(request); const denied = await enforceAdminAccess(request, id); if (denied) return denied; const limit = await checkRateLimit(request, 'admin:blog:post'); if (!limit.allowed) return response({ error: 'Too many requests' }, 429, id, limit.headers); if (!json(request)) return response({ error: 'Content-Type application/json is required' }, 415, id, limit.headers)
  const parsed = blogCreateSchema.safeParse(await request.json()); if (!parsed.success) return response({ error: 'Validation failed', details: parsed.error.issues.map((i) => i.message) }, 400, id, limit.headers)
  const input = parsed.data
  try { const post = await db.blogPost.create({ data: { title: sanitizeInput(input.title, 180), slug: input.slug, excerpt: sanitizeInput(input.excerpt, 500), content: input.content, coverImage: input.coverImage, tags: input.tags.join(','), readTime: estimateReadTime(input.content, 'en'), category: input.category, featured: input.featured, published: input.published, publishedAt: input.published ? new Date() : null, titleEn: input.titleEn, excerptEn: input.excerptEn, contentEn: input.contentEn, seoTitle: input.seoTitle, seoDescription: input.seoDescription, seoTitleEn: input.seoTitleEn, seoDescriptionEn: input.seoDescriptionEn, lastReviewedAt: input.lastReviewedAt } }); return response({ post }, 201, id, limit.headers) } catch (e) { if (unique(e)) return response({ error: 'Slug already exists' }, 409, id, limit.headers); return response({ error: 'Failed to create blog post' }, 500, id, limit.headers) }
}

export async function PATCH(request: NextRequest) {
  const id = createRequestId(request); const denied = await enforceAdminAccess(request, id); if (denied) return denied; const limit = await checkRateLimit(request, 'admin:blog:patch'); if (!limit.allowed) return response({ error: 'Too many requests' }, 429, id, limit.headers); if (!json(request)) return response({ error: 'Content-Type application/json is required' }, 415, id, limit.headers)
  const parsed = blogUpdateSchema.safeParse(await request.json()); if (!parsed.success) return response({ error: 'Validation failed', details: parsed.error.issues.map((i) => i.message) }, 400, id, limit.headers); const { id: postId, ...input } = parsed.data
  const data = { ...(input.title !== undefined ? { title: sanitizeInput(input.title, 180) } : {}), ...(input.slug !== undefined ? { slug: input.slug } : {}), ...(input.excerpt !== undefined ? { excerpt: sanitizeInput(input.excerpt, 500) } : {}), ...(input.content !== undefined ? { content: input.content, readTime: estimateReadTime(input.content, 'en') } : {}), ...(input.tags !== undefined ? { tags: input.tags.join(',') } : {}), ...Object.fromEntries(Object.entries(input).filter(([k]) => ['coverImage','category','featured','published','titleEn','excerptEn','contentEn','seoTitle','seoDescription','seoTitleEn','seoDescriptionEn','lastReviewedAt'].includes(k))) }
  try { const post = await db.blogPost.update({ where: { id: postId }, data }); return response({ post }, 200, id, limit.headers) } catch (e) { if (unique(e)) return response({ error: 'Slug already exists' }, 409, id, limit.headers); return response({ error: 'Failed to update blog post' }, 500, id, limit.headers) }
}

export async function DELETE(request: NextRequest) { const id = createRequestId(request); const denied = await enforceAdminAccess(request, id); if (denied) return denied; const limit = await checkRateLimit(request, 'admin:blog:delete'); if (!limit.allowed) return response({ error: 'Too many requests' }, 429, id, limit.headers); const postId = request.nextUrl.searchParams.get('id'); if (!postId) return response({ error: 'Blog post ID is required' }, 400, id, limit.headers); await db.blogPost.delete({ where: { id: postId } }); return response({ success: true }, 200, id, limit.headers) }
