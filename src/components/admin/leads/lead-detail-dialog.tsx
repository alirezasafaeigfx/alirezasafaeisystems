'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { AdminLead } from '@/components/admin/leads/leads-table'

export function LeadDetailDialog({ lead, open, onOpenChange }: { lead: AdminLead | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!lead) return null
  const fields = [['Contact', lead.contactName], ['Email', lead.email], ['Phone', lead.phone], ['Organization', lead.organizationName], ['Type', lead.organizationType], ['Team size', lead.teamSize], ['Current stack', lead.currentStack], ['Critical risk', lead.criticalRisk], ['Timeline', lead.timeline], ['Budget', lead.budgetRange], ['Preferred contact', lead.preferredContact], ['Source', lead.source], ['UTM source', lead.utmSource], ['UTM medium', lead.utmMedium], ['UTM campaign', lead.utmCampaign], ['UTM content', lead.utmContent], ['Notes', lead.notes]] as const
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[85dvh] overflow-y-auto"><DialogHeader><DialogTitle>{lead.organizationName}</DialogTitle><DialogDescription>Lead details and attribution context</DialogDescription></DialogHeader><dl className="grid gap-4 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label}><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-sm">{value || '—'}</dd></div>)}</dl></DialogContent></Dialog>
}
