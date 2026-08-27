import { randomUUID } from 'node:crypto'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest } from 'next/server'
import sharp from 'sharp'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

const storageDir = path.join(process.cwd(), 'tmp', `discover-upload-api-${randomUUID()}`)
type NextRequestInit = NonNullable<ConstructorParameters<typeof NextRequest>[1]>

function request(url: string, init: NextRequestInit = {}) {
  return new NextRequest(url, init)
}

async function imageFile(type = 'image/jpeg') {
  const bytes = await sharp({
    create: { width: 24, height: 24, channels: 3, background: { r: 0, g: 120, b: 255 } },
  }).jpeg().toBuffer()
  return new File([new Uint8Array(bytes)], 'photo.jpg', { type })
}

describe('Discover image upload API', () => {
  beforeEach(() => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    process.env.API_RATE_LIMIT_MAX_REQUESTS = '50'
    process.env.API_RATE_LIMIT_WINDOW_MS = '60000'
    process.env.DISCOVER_UPLOAD_DIR = storageDir
  })

  it('rejects upload without an admin session', async () => {
    const { POST } = await import('@/app/api/admin/discover/upload/route')
    const form = new FormData()
    form.set('file', await imageFile())
    const response = await POST(request('http://localhost:3000/api/admin/discover/upload', { method: 'POST', body: form }))
    expect(response.status).toBe(401)
  })

  it('rejects unsupported file types and oversized files', async () => {
    const { POST } = await import('@/app/api/admin/discover/upload/route')
    const unsupported = new FormData()
    unsupported.set('file', new File(['<svg/>'], 'image.svg', { type: 'image/svg+xml' }))
    const unsupportedResponse = await POST(request('http://localhost:3000/api/admin/discover/upload', {
      method: 'POST',
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
      body: unsupported,
    }))
    expect(unsupportedResponse.status).toBe(400)

    const oversized = new FormData()
    oversized.set('file', new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' }))
    const oversizedResponse = await POST(request('http://localhost:3000/api/admin/discover/upload', {
      method: 'POST',
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
      body: oversized,
    }))
    expect(oversizedResponse.status).toBe(400)

    const spoofed = new FormData()
    spoofed.set('file', new File(['not an image'], 'spoofed.jpg', { type: 'image/jpeg' }))
    const spoofedResponse = await POST(request('http://localhost:3000/api/admin/discover/upload', {
      method: 'POST',
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
      body: spoofed,
    }))
    expect(spoofedResponse.status).toBe(400)
  })

  it('stores a valid image as WebP and serves it from the public media route', async () => {
    const { POST } = await import('@/app/api/admin/discover/upload/route')
    const form = new FormData()
    form.set('file', await imageFile())
    const uploadResponse = await POST(request('http://localhost:3000/api/admin/discover/upload', {
      method: 'POST',
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
      body: form,
    }))

    expect(uploadResponse.status).toBe(201)
    const body = await uploadResponse.json() as { url: string }
    expect(body.url).toMatch(/^\/media\/discover\/[0-9a-f-]+\.webp$/)

    const { GET } = await import('@/app/media/discover/[filename]/route')
    const filename = body.url.split('/').pop() as string
    const mediaResponse = await GET(request(`http://localhost:3000${body.url}`), { params: Promise.resolve({ filename }) })
    expect(mediaResponse.status).toBe(200)
    expect(mediaResponse.headers.get('content-type')).toBe('image/webp')
    expect(mediaResponse.headers.get('cache-control')).toContain('immutable')
    expect(Buffer.from(await mediaResponse.arrayBuffer()).subarray(0, 4).toString('hex')).toBe('52494646')
  })

  it('returns 404 for unsafe or missing media filenames', async () => {
    const { GET } = await import('@/app/media/discover/[filename]/route')
    const unsafe = await GET(request('http://localhost:3000/media/discover/..%2Fsecret'), { params: Promise.resolve({ filename: '../secret' }) })
    expect(unsafe.status).toBe(404)
    const missing = await GET(request('http://localhost:3000/media/discover/00000000-0000-4000-8000-000000000000.webp'), {
      params: Promise.resolve({ filename: '00000000-0000-4000-8000-000000000000.webp' }),
    })
    expect(missing.status).toBe(404)
  })

  afterAll(async () => {
    await rm(storageDir, { recursive: true, force: true })
    delete process.env.DISCOVER_UPLOAD_DIR
  })
})
