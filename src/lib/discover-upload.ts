import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

export const DISCOVER_UPLOAD_MAX_BYTES = 8 * 1024 * 1024
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export class DiscoverUploadValidationError extends Error {}

type UploadValidation =
  | { valid: true }
  | { valid: false; reason: 'empty' | 'size' | 'type' }

export function validateDiscoverUpload(file: File): UploadValidation {
  if (file.size === 0) return { valid: false, reason: 'empty' }
  if (file.size > DISCOVER_UPLOAD_MAX_BYTES) return { valid: false, reason: 'size' }
  if (!allowedMimeTypes.has(file.type.toLowerCase())) return { valid: false, reason: 'type' }
  return { valid: true }
}

export function resolveDiscoverUploadDir(): string {
  const configuredDir = process.env.DISCOVER_UPLOAD_DIR?.trim()
  if (configuredDir) {
    if (!path.isAbsolute(configuredDir)) throw new Error('DISCOVER_UPLOAD_DIR must be absolute')
    return path.normalize(configuredDir)
  }

  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl?.startsWith('file:')) {
    throw new Error('DISCOVER_UPLOAD_DIR must be configured for non-SQLite storage')
  }

  const databasePath = decodeURIComponent(databaseUrl.slice('file:'.length))
  if (!databasePath) throw new Error('DATABASE_URL does not contain a SQLite path')
  if (!path.isAbsolute(databasePath)) throw new Error('SQLite DATABASE_URL path must be absolute')
  return path.join(path.dirname(databasePath), 'uploads', 'discover')
}

export function isSafeDiscoverMediaFilename(filename: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/i.test(filename)
}

export async function processDiscoverUpload(file: File): Promise<{
  bytes: Buffer
  filename: string
  path: string
  url: string
}> {
  const validation = validateDiscoverUpload(file)
  if (!validation.valid) throw new Error(`Discover upload rejected: ${validation.reason}`)

  let bytes: Buffer
  try {
    bytes = await sharp(Buffer.from(await file.arrayBuffer()))
      .autoOrient()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
  } catch {
    throw new DiscoverUploadValidationError('Discover upload is not a valid image')
  }
  const filename = `${randomUUID()}.webp`
  const uploadDir = resolveDiscoverUploadDir()
  const targetPath = path.join(uploadDir, filename)

  await mkdir(uploadDir, { recursive: true })
  await writeFile(targetPath, bytes, { flag: 'wx' })

  return { bytes, filename, path: targetPath, url: `/media/discover/${filename}` }
}
