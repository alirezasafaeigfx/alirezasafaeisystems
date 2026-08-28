import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { LeadFilters } from '@/components/admin/leads/lead-filters'
import { LeadsTable, type AdminLead } from '@/components/admin/leads/leads-table'
import { getAdminLeads, parseLeadFilters } from '@/lib/admin/leads'

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams
  const params = new URLSearchParams(Object.entries(raw).flatMap(([key, value]) => value === undefined ? [] : [[key, Array.isArray(value) ? value[0] : value]]))
  const filters = parseLeadFilters(params)
  const leads = await getAdminLeads(filters)
  const serializable = leads.map((lead): AdminLead => ({ ...lead, status: lead.status as AdminLead['status'], createdAt: lead.createdAt.toISOString(), updatedAt: lead.updatedAt.toISOString() }))
  const counts = { all: serializable.length, new: 0, qualified: 0, disqualified: 0, archived: 0 }
  serializable.forEach((lead) => { counts[lead.status] += 1 })
  return <div className="space-y-6"><AdminPageHeader title="Leads" description="Qualification submissions captured from high-intent funnels." /><LeadFilters counts={counts} />{serializable.length ? <LeadsTable leads={serializable} /> : <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">{filters.q || filters.status !== 'all' ? 'No leads match these filters.' : 'No leads yet.'}</div>}</div>
}
