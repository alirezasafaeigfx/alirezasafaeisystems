import { beforeEach, describe, expect, it, vi } from 'vitest'

const dbMock = vi.hoisted(() => ({
  lead: { count: vi.fn() },
  contactMessage: { count: vi.fn() },
  discoverItem: { count: vi.fn() },
  blogPost: { count: vi.fn() },
}))

vi.mock('@/lib/db', () => ({ db: dbMock }))

import { getAdminOverview } from '@/lib/admin/overview'

describe('getAdminOverview', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns bounded operational counts using direct database aggregations', async () => {
    dbMock.lead.count
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(4)
    dbMock.contactMessage.count.mockResolvedValueOnce(7)
    dbMock.discoverItem.count
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
    dbMock.blogPost.count
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(1)

    await expect(getAdminOverview()).resolves.toEqual({
      leads: { total: 12, new: 3, qualified: 4 },
      messages: { total: 7 },
      discover: { published: 5, draft: 2 },
      blog: { published: 6, draft: 1 },
    })

    expect(dbMock.lead.count).toHaveBeenNthCalledWith(1)
    expect(dbMock.lead.count).toHaveBeenNthCalledWith(2, { where: { status: 'new' } })
    expect(dbMock.lead.count).toHaveBeenNthCalledWith(3, { where: { status: 'qualified' } })
    expect(dbMock.contactMessage.count).toHaveBeenCalledWith()
    expect(dbMock.discoverItem.count).toHaveBeenNthCalledWith(1, { where: { published: true } })
    expect(dbMock.discoverItem.count).toHaveBeenNthCalledWith(2, { where: { published: false } })
    expect(dbMock.blogPost.count).toHaveBeenNthCalledWith(1, { where: { published: true } })
    expect(dbMock.blogPost.count).toHaveBeenNthCalledWith(2, { where: { published: false } })
  })
})
