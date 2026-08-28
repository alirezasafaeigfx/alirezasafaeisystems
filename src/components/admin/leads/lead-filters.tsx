'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { adminLeadStatuses, type AdminLeadStatus } from '@/lib/admin/leads'

export function LeadFilters({ counts }: { counts: Record<'all' | AdminLeadStatus, number> }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const status = params.get('status') ?? 'all'
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    router.replace(`${pathname}${next.size ? `?${next.toString()}` : ''}`)
  }
  return <div className="space-y-3" aria-label="Lead filters">
    <div className="max-w-md space-y-1.5">
      <Label htmlFor="lead-search">Search leads</Label>
      <Input id="lead-search" defaultValue={q} placeholder="Name, organization, or email" onChange={(event) => update('q', event.target.value)} />
    </div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Lead status">
      {(['all', ...adminLeadStatuses] as const).map((value) => <Button key={value} type="button" size="sm" variant={status === value ? 'default' : 'outline'} aria-pressed={status === value} onClick={() => update('status', value)}>{value === 'all' ? 'All' : value} ({counts[value]})</Button>)}
    </div>
  </div>
}
