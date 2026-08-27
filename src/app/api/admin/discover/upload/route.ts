import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import {
  DiscoverUploadValidationError,
  processDiscoverUpload,
  validateDiscoverUpload,
} from '@/lib/discover-upload'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

function uploadError(requestId: string, headers: Record<string, string>, message: string, status = 400) {
  return withCommonApiHeaders(NextResponse.json({ error: message }, { status }), requestId, headers)
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) return unauthorized

  const limit = await checkRateLimit(request, 'admin:discover:upload')
  if (!limit.allowed) {
    return uploadError(requestId, limit.headers, 'Too many requests', 429)
  }

  try {
    if (!request.headers.get('content-type')?.toLowerCase().includes('multipart/form-data')) {
      return uploadError(requestId, limit.headers, 'Multipart upload is required', 415)
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return uploadError(requestId, limit.headers, 'Image file is required')

    const validation = validateDiscoverUpload(file)
    if (!validation.valid) {
      const message = validation.reason === 'size'
        ? 'Image must be 8MB or smaller'
        : validation.reason === 'type'
          ? 'Only JPG, PNG, and WEBP images are allowed'
          : 'Image file is empty'
      return uploadError(requestId, limit.headers, message)
    }

    const result = await processDiscoverUpload(file)
    return withCommonApiHeaders(NextResponse.json({ url: result.url }, { status: 201 }), requestId, limit.headers)
  } catch (error) {
    if (error instanceof DiscoverUploadValidationError) {
      return uploadError(requestId, limit.headers, 'Only valid image files are allowed')
    }
    logger.error('Discover image upload failed', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return uploadError(requestId, limit.headers, 'Image upload failed', 500)
  }
}
