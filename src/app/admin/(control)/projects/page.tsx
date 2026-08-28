import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ProjectsManager, type AdminProject } from '@/components/admin/projects/projects-manager'
import { db } from '@/lib/db'

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    where: { contentType: 'portfolio' },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  })
  const initialProjects: AdminProject[] = projects.map(({ id, title, description, longDescription, githubUrl, liveUrl, tags, contentType, featured, published, order }) => ({
    id, title, description, longDescription, githubUrl, liveUrl, tags,
    contentType: contentType === 'discover' ? 'discover' : 'portfolio',
    featured, published, order,
  }))

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Projects" description="Manage portfolio projects that support the ASDEV Audit brand and acquisition journey." />
      <ProjectsManager initialProjects={initialProjects} />
    </div>
  )
}
