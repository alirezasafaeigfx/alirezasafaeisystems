import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const [events, conversions] = await Promise.all([
    db.analyticsEvent.count(),
    db.funnelConversion.count({ where: { converted: true } }),
  ])
  return <div className="space-y-8"><AdminPageHeader title="Analytics" description="Bounded first-party acquisition signals." /><div className="grid gap-4 sm:grid-cols-2"><AdminStatCard label="Tracked events" value={events} /><AdminStatCard label="Conversions" value={conversions} /></div></div>
}
