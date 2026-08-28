import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { Button } from '@/components/ui/button'
import { getAdminOverview } from '@/lib/admin/overview'

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview()

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Overview"
        description="Actionable status across the ASDEV content and acquisition pipeline."
      />

      <section aria-labelledby="lead-summary-heading">
        <h2 id="lead-summary-heading" className="mb-4 text-lg font-semibold">Leads and messages</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Total leads" value={overview.leads.total} />
          <AdminStatCard label="New leads" value={overview.leads.new} />
          <AdminStatCard label="Qualified leads" value={overview.leads.qualified} />
          <AdminStatCard label="Messages" value={overview.messages.total} />
        </div>
      </section>

      <section aria-labelledby="content-summary-heading">
        <h2 id="content-summary-heading" className="mb-4 text-lg font-semibold">Content status</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminStatCard
            label="Discover"
            value={overview.discover.published}
            detail={`${overview.discover.draft} drafts · ${overview.discover.published} published`}
          />
          <AdminStatCard
            label="Blog"
            value={overview.blog.published}
            detail={`${overview.blog.draft} drafts · ${overview.blog.published} published`}
          />
        </div>
      </section>

      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="mb-4 text-lg font-semibold">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link href="/admin/discover">New Discover item</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/blog">New Blog post</Link></Button>
          <Button asChild variant="ghost"><Link href="/">View site</Link></Button>
        </div>
      </section>
    </div>
  )
}
