'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeadDetailDialog } from './lead-detail-dialog'
import type { AdminLeadStatus } from '@/lib/admin/leads'
import { toast } from '@/hooks/use-toast'

export type AdminLead = { id: string; status: AdminLeadStatus; source: string; contactName: string; organizationName: string; organizationType: string; email: string; phone: string | null; teamSize: string; currentStack: string; criticalRisk: string; timeline: string; budgetRange: string; preferredContact: string; notes: string | null; attachmentPath: string | null; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; utmContent: string | null; createdAt: string; updatedAt: string }

export function LeadsTable({ leads }: { leads: AdminLead[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<AdminLead | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  async function updateStatus(lead: AdminLead, status: AdminLeadStatus) {
    setUpdating(lead.id)
    try {
      const response = await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: lead.id, status }) })
      if (!response.ok) throw new Error('update failed')
      toast({ title: 'Lead updated', description: `${lead.organizationName} is now ${status}.` })
      router.refresh()
    } catch {
      toast({ title: 'Lead update failed', description: 'No status change was applied.', variant: 'destructive' })
    } finally { setUpdating(null) }
  }
  return <>
    <div className="space-y-3 md:hidden">{leads.map((lead) => <article key={lead.id} className="rounded-lg border bg-background p-4"><button className="w-full text-start" onClick={() => setSelected(lead)}><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{lead.organizationName}</h2><p className="text-sm text-muted-foreground">{lead.contactName} · {lead.email}</p></div><Badge>{lead.status}</Badge></div><p className="mt-3 text-sm text-muted-foreground">{lead.budgetRange} · {new Date(lead.createdAt).toLocaleDateString()}</p></button><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" disabled={updating === lead.id} onClick={() => updateStatus(lead, 'qualified')}>Qualify</Button><Button size="sm" variant="ghost" disabled={updating === lead.id} onClick={() => updateStatus(lead, 'archived')}>Archive</Button></div></article>)}</div>
    <div className="hidden overflow-x-auto md:block"><table className="w-full caption-bottom text-sm"><caption className="sr-only">Leads</caption><thead><tr className="border-b text-start"><th className="p-3 text-start font-medium">Organization</th><th className="p-3 text-start font-medium">Contact</th><th className="p-3 text-start font-medium">Budget</th><th className="p-3 text-start font-medium">Status</th><th className="p-3 text-start font-medium">Date</th><th className="p-3 text-end font-medium">Actions</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className="border-b"><td className="p-3"><button className="font-medium underline-offset-4 hover:underline" onClick={() => setSelected(lead)}>{lead.organizationName}</button></td><td className="p-3">{lead.contactName}<div className="text-xs text-muted-foreground">{lead.email}</div></td><td className="p-3">{lead.budgetRange}</td><td className="p-3"><Badge>{lead.status}</Badge></td><td className="p-3 text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</td><td className="p-3 text-end"><Button size="sm" variant="outline" disabled={updating === lead.id} onClick={() => updateStatus(lead, 'qualified')}>Qualify</Button></td></tr>)}</tbody></table></div>
    <LeadDetailDialog lead={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
  </>
}
