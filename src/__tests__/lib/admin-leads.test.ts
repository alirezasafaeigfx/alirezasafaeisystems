import { beforeEach, describe, expect, it, vi } from 'vitest'

const dbMock = vi.hoisted(() => ({ lead: { findMany: vi.fn() } }))
vi.mock('@/lib/db', () => ({ db: dbMock }))

import { getAdminLeads, parseLeadFilters } from '@/lib/admin/leads'

describe('admin lead helpers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('parses supported URL filters and ignores invalid status values', () => {
    expect(parseLeadFilters(new URLSearchParams('q=  ali  &status=qualified'))).toEqual({
      q: 'ali',
      status: 'qualified',
    })
    expect(parseLeadFilters(new URLSearchParams('status=unknown'))).toEqual({ q: '', status: 'all' })
  })

  it('queries only leads with a bounded search and status filter', async () => {
    dbMock.lead.findMany.mockResolvedValueOnce([])

    await expect(getAdminLeads({ q: 'ali', status: 'qualified' })).resolves.toEqual([])
    expect(dbMock.lead.findMany).toHaveBeenCalledWith(expect.objectContaining({
      take: 200,
      where: expect.objectContaining({ status: 'qualified' }),
    }))
  })
})
