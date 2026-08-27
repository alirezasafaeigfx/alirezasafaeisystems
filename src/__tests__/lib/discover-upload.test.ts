import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { afterEach, describe, expect, it } from 'vitest'
import {
  DISCOVER_UPLOAD_MAX_BYTES,
  isSafeDiscoverMediaFilename,
  processDiscoverUpload,
  resolveDiscoverUploadDir,
  validateDiscoverUpload,
} from '@/lib/discover-upload'

const tempRoot = path.join(process.cwd(), 'tmp', 'discover-upload-test')

afterEach(async () => {
  delete process.env.DISCOVER_UPLOAD_DIR
  delete process.env.DATABASE_URL
  await rm(tempRoot, { recursive: true, force: true })
})

describe('discover upload helpers', () => {
  it('uses the explicit upload directory when configured', () => {
    process.env.DISCOVER_UPLOAD_DIR = path.join(tempRoot, 'configured')
    expect(resolveDiscoverUploadDir()).toBe(path.resolve(tempRoot, 'configured'))
  })

  it('derives SQLite uploads beside the database when no directory is configured', () => {
    process.env.DATABASE_URL = 'file:/var/lib/my-portfolio/custom.db'
    expect(resolveDiscoverUploadDir()).toBe(path.join(path.dirname('/var/lib/my-portfolio/custom.db'), 'uploads', 'discover'))
  })

  it('rejects relative persistence paths that could resolve inside a release directory', () => {
    process.env.DISCOVER_UPLOAD_DIR = './uploads'
    expect(() => resolveDiscoverUploadDir()).toThrow('absolute')

    delete process.env.DISCOVER_UPLOAD_DIR
    process.env.DATABASE_URL = 'file:./custom.db'
    expect(() => resolveDiscoverUploadDir()).toThrow('absolute')
  })

  it('rejects PostgreSQL storage without an explicit upload directory', () => {
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/app'
    expect(() => resolveDiscoverUploadDir()).toThrow('DISCOVER_UPLOAD_DIR')
  })

  it('accepts only the allowed image types and the 8 MiB limit', () => {
    expect(validateDiscoverUpload(new File(['image'], 'photo.jpg', { type: 'image/jpeg' }))).toEqual({ valid: true })
    expect(validateDiscoverUpload(new File(['svg'], 'photo.svg', { type: 'image/svg+xml' }))).toMatchObject({ valid: false })
    expect(validateDiscoverUpload(new File([new Uint8Array(DISCOVER_UPLOAD_MAX_BYTES + 1)], 'large.png', { type: 'image/png' }))).toMatchObject({ valid: false })
  })

  it('writes a rotated, bounded WebP with a generated safe filename', async () => {
    process.env.DISCOVER_UPLOAD_DIR = path.join(tempRoot, 'uploads')
    const input = await sharp({
      create: { width: 2000, height: 1000, channels: 3, background: { r: 255, g: 0, b: 0 } },
    }).jpeg().toBuffer()
    const file = new File([new Uint8Array(input)], '../../unsafe.jpg', { type: 'image/jpeg' })

    const result = await processDiscoverUpload(file)
    expect(isSafeDiscoverMediaFilename(result.filename)).toBe(true)
    expect(result.url).toBe(`/media/discover/${result.filename}`)
    const metadata = await sharp(await writeFileAndRead(result.path, result.bytes)).metadata()
    expect(metadata.format).toBe('webp')
    expect(metadata.width).toBe(1600)
    expect(result.filename).not.toContain('unsafe')
  })
})

async function writeFileAndRead(filePath: string, bytes: Buffer): Promise<Buffer> {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, bytes)
  return bytes
}
