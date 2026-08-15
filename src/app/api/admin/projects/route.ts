import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { isValidUrl, sanitizeInput } from '@/lib/validators'
import { projectContentTypeSchema, projectTagsSchema } from '@/lib/project-content'

const projectFieldsSchema = z.object({
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(400),
  longDescription: z.string().max(2000).optional(),
  githubUrl: z.string().max(2000).optional(),
  liveUrl: z.string().max(2000).optional(),
  tags: projectTagsSchema,
  contentType: projectContentTypeSchema.default('portfolio'),
  featured: z.boolean().optional().default(false),
  order: z.number().int().nonnegative().optional().default(0),
  published: z.boolean().optional().default(true),
})

const projectCreateSchema = projectFieldsSchema
const projectUpdateSchema = projectFieldsSchema.partial().extend({ id: z.string().min(10) })

function requiresJson(request: NextRequest): boolean {
  return (request.headers.get('content-type') || '').split(';', 1)[0].trim().toLowerCase() === 'application/json'
}

function hasSafeProjectUrl(value: string | undefined): boolean {
  if (!value) return true
  if (!isValidUrl(value)) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password
  } catch {
    return false
  }
}

function invalidUrlResponse(requestId: string, limitHeaders: Record<string, string>) {
  return withCommonApiHeaders(
    NextResponse.json({ error: 'Invalid URL format: HTTPS URLs without credentials are required' }, { status: 400 }),
    requestId,
    limitHeaders,
  )
}

// GET all projects
export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }
  const limit = await checkRateLimit(request, 'admin:projects:get')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const contentType = searchParams.get('contentType')
    const published = searchParams.get('published')
    if (contentType && contentType !== 'all' && !projectContentTypeSchema.safeParse(contentType).success) {
      return withCommonApiHeaders(NextResponse.json({ error: 'Invalid contentType' }, { status: 400 }), requestId, limit.headers)
    }
    if (published && !['all', 'true', 'false'].includes(published)) {
      return withCommonApiHeaders(NextResponse.json({ error: 'Invalid published filter' }, { status: 400 }), requestId, limit.headers)
    }

    const where = {
      ...(contentType && contentType !== 'all' ? { contentType } : {}),
      ...(published && published !== 'all' ? { published: published === 'true' } : {}),
    }
    const projects = await db.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    })

    return withCommonApiHeaders(NextResponse.json({ projects }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error fetching admin projects', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
      ),
      requestId,
      limit.headers
    )
  }
}

// POST create project
export async function POST(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }
  const limit = await checkRateLimit(request, 'admin:projects:post')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    if (!requiresJson(request)) {
      return withCommonApiHeaders(NextResponse.json({ error: 'Content-Type application/json is required' }, { status: 415 }), requestId, limit.headers)
    }
    const body: unknown = await request.json()
    const parsed = projectCreateSchema.safeParse(body)
    if (!parsed.success) {
      return withCommonApiHeaders(
        NextResponse.json(
          {
            error: 'Validation failed',
            details: parsed.error.issues.map((issue) => issue.message),
          },
          { status: 400 }
        ),
        requestId,
        limit.headers
      )
    }
    const data = parsed.data
    if (!hasSafeProjectUrl(data.githubUrl) || !hasSafeProjectUrl(data.liveUrl)) return invalidUrlResponse(requestId, limit.headers)

    const project = await db.project.create({
      data: {
        title: sanitizeInput(data.title, 140),
        description: sanitizeInput(data.description, 400),
        longDescription: data.longDescription ? sanitizeInput(data.longDescription, 2000) : undefined,
        githubUrl: data.githubUrl?.trim(),
        liveUrl: data.liveUrl?.trim(),
        tags: data.tags.join(','),
        featured: data.featured,
        order: data.order,
        contentType: data.contentType,
        published: data.published,
      },
    })

    return withCommonApiHeaders(NextResponse.json({ project }, { status: 201 }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error creating admin project', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
      ),
      requestId,
      limit.headers
    )
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) return unauthorized
  const limit = await checkRateLimit(request, 'admin:projects:patch')
  if (!limit.allowed) {
    return withCommonApiHeaders(NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }), requestId, limit.headers)
  }

  try {
    if (!requiresJson(request)) {
      return withCommonApiHeaders(NextResponse.json({ error: 'Content-Type application/json is required' }, { status: 415 }), requestId, limit.headers)
    }
    const parsed = projectUpdateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return withCommonApiHeaders(NextResponse.json({ error: 'Validation failed', details: parsed.error.issues.map((issue) => issue.message) }, { status: 400 }), requestId, limit.headers)
    }

    const { id, ...input } = parsed.data
    if (!hasSafeProjectUrl(input.githubUrl) || !hasSafeProjectUrl(input.liveUrl)) return invalidUrlResponse(requestId, limit.headers)

    const data = {
      ...(input.title !== undefined ? { title: sanitizeInput(input.title, 140) } : {}),
      ...(input.description !== undefined ? { description: sanitizeInput(input.description, 400) } : {}),
      ...(input.longDescription !== undefined ? { longDescription: sanitizeInput(input.longDescription, 2000) } : {}),
      ...(input.githubUrl !== undefined ? { githubUrl: input.githubUrl.trim() || null } : {}),
      ...(input.liveUrl !== undefined ? { liveUrl: input.liveUrl.trim() || null } : {}),
      ...(input.tags !== undefined ? { tags: input.tags.join(',') } : {}),
      ...(input.contentType !== undefined ? { contentType: input.contentType } : {}),
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
      ...(input.published !== undefined ? { published: input.published } : {}),
    }
    const project = await db.project.update({ where: { id }, data })
    return withCommonApiHeaders(NextResponse.json({ project }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error updating admin project', { requestId, error: error instanceof Error ? error.message : 'unknown' })
    return withCommonApiHeaders(NextResponse.json({ error: 'Failed to update project' }, { status: 500 }), requestId, limit.headers)
  }
}

export async function DELETE(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) return unauthorized
  const limit = await checkRateLimit(request, 'admin:projects:delete')
  if (!limit.allowed) {
    return withCommonApiHeaders(NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }), requestId, limit.headers)
  }

  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id || id.length < 10) {
      return withCommonApiHeaders(NextResponse.json({ error: 'Project ID is required' }, { status: 400 }), requestId, limit.headers)
    }
    await db.project.delete({ where: { id } })
    return withCommonApiHeaders(NextResponse.json({ success: true }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error deleting admin project', { requestId, error: error instanceof Error ? error.message : 'unknown' })
    return withCommonApiHeaders(NextResponse.json({ error: 'Failed to delete project' }, { status: 500 }), requestId, limit.headers)
  }
}
