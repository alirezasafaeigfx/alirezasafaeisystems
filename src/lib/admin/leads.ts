import type { LeadStatus } from '@prisma/client'
import { db } from '@/lib/db'

export const adminLeadStatuses = ['new', 'qualified', 'disqualified', 'archived'] as const
export type AdminLeadStatus = (typeof adminLeadStatuses)[number]
export type AdminLeadFilters = { q: string; status: AdminLeadStatus | 'all' }

export function parseLeadFilters(params: URLSearchParams): AdminLeadFilters {
  const status = params.get('status')
  return {
    q: params.get('q')?.trim() ?? '',
    status: adminLeadStatuses.includes(status as AdminLeadStatus) ? status as AdminLeadStatus : 'all',
  }
}

export async function getAdminLeads(filters: AdminLeadFilters) {
  const q = filters.q.trim()
  return db.lead.findMany({
    where: {
      ...(filters.status !== 'all' ? { status: filters.status as LeadStatus } : {}),
      ...(q ? {
        OR: [
          { contactName: { contains: q } },
          { organizationName: { contains: q } },
          { email: { contains: q } },
          { organizationType: { contains: q } },
          { currentStack: { contains: q } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
}
