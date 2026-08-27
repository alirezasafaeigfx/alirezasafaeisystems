import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { resolveDiscoverUploadDir, isSafeDiscoverMediaFilename } from '@/lib/discover-upload'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

type MediaRouteContext = { params: Promise<{ filename: string }> }

export async function GET(_request: NextRequest, context: MediaRouteContext) {
  const { filename } = await context.params
  if (!isSafeDiscoverMediaFilename(filename)) return new NextResponse(null, { status: 404 })

  try {
    const uploadDir = path.resolve(resolveDiscoverUploadDir())
    const filePath = path.resolve(uploadDir, filename)
    if (!filePath.startsWith(`${uploadDir}${path.sep}`)) return new NextResponse(null, { status: 404 })

    const bytes = await readFile(filePath)
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'image/webp',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code !== 'ENOENT') {
      logger.error('Discover media read failed', { error: 'filesystem read failed' })
    }
    return new NextResponse(null, { status: 404 })
  }
}
