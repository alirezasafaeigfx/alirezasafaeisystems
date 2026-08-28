import { beforeEach, describe, expect, it, vi } from 'vitest'

const dbMock = vi.hoisted(() => ({ contactMessage: { findMany: vi.fn() } }))
vi.mock('@/lib/db', () => ({ db: dbMock }))

import { getAdminMessages, matchesMessageQuery } from '@/lib/admin/messages'

describe('admin message helpers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('matches name, email, and subject case-insensitively', () => {
    expect(matchesMessageQuery({ name: 'Ali', email: 'ali@example.com', subject: 'Audit' }, 'AUDIT')).toBe(true)
    expect(matchesMessageQuery({ name: 'Ali', email: 'ali@example.com', subject: null }, 'missing')).toBe(false)
  })

  it('queries only contact messages with a bounded search', async () => {
    dbMock.contactMessage.findMany.mockResolvedValueOnce([])

    await expect(getAdminMessages('ali')).resolves.toEqual([])
    expect(dbMock.contactMessage.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 200 }))
  })
})
