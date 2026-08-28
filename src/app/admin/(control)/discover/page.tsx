import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { DiscoverManager } from '@/components/admin/discover-manager'

export default function AdminDiscoverPage() {
  return <div className="space-y-8"><AdminPageHeader title="Discover" description="Manage published and draft resource-hub entries." /><DiscoverManager /></div>
}
