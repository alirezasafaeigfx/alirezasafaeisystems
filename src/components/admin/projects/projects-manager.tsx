'use client'

import { FormEvent, useState } from 'react'
import { Pencil, Save, Trash2, X } from 'lucide-react'
import { ConfirmActionDialog } from '@/components/admin/confirm-action-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export type AdminProject = {
  id: string
  title: string
  description: string
  longDescription: string | null
  githubUrl: string | null
  liveUrl: string | null
  tags: string
  contentType: 'portfolio' | 'discover'
  featured: boolean
  published: boolean
  order: number
}

type ProjectForm = Omit<AdminProject, 'id' | 'longDescription' | 'githubUrl' | 'liveUrl' | 'tags'> & {
  id?: string
  longDescription: string
  githubUrl: string
  liveUrl: string
  tags: string
}

const emptyForm: ProjectForm = {
  title: '', description: '', longDescription: '', githubUrl: '', liveUrl: '', tags: '',
  contentType: 'portfolio', featured: false, published: false, order: 0,
}

function toForm(project: AdminProject): ProjectForm {
  return { ...project, longDescription: project.longDescription ?? '', githubUrl: project.githubUrl ?? '', liveUrl: project.liveUrl ?? '' }
}

export function ProjectsManager({ initialProjects }: { initialProjects: AdminProject[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null)
  const [deleting, setDeleting] = useState(false)

  function updateForm<K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/admin/projects', {
        method: form.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json() as { project?: AdminProject; error?: string }
      if (!response.ok || !data.project) throw new Error(data.error || 'Failed to save project')
      const savedProject = data.project
      setProjects((current) => form.id ? current.map((project) => project.id === savedProject.id ? savedProject : project) : [savedProject, ...current])
      setForm(emptyForm)
      toast({ title: 'Project saved', description: 'The portfolio project was saved successfully.' })
    } catch (error) {
      toast({ title: 'Save failed', description: error instanceof Error ? error.message : 'The project was not saved.', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  async function deleteProject() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/projects?id=${encodeURIComponent(deleteTarget.id)}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('The project was not deleted.')
      setProjects((current) => current.filter((project) => project.id !== deleteTarget.id))
      if (form.id === deleteTarget.id) setForm(emptyForm)
      setDeleteTarget(null)
      toast({ title: 'Project deleted', description: 'The portfolio project was permanently deleted.' })
    } catch (error) {
      toast({ title: 'Delete failed', description: error instanceof Error ? error.message : 'The project was not deleted.', variant: 'destructive' })
    } finally { setDeleting(false) }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>{form.id ? 'Edit portfolio project' : 'New portfolio project'}</CardTitle><CardDescription>Keep project metadata precise so portfolio proof can route visitors toward ASDEV Audit.</CardDescription></CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={saveProject}>
            <label className="space-y-1 text-sm font-medium" htmlFor="project-title">Title<Input id="project-title" required maxLength={140} value={form.title} onChange={(event) => updateForm('title', event.target.value)} /></label>
            <label className="space-y-1 text-sm font-medium md:col-span-2" htmlFor="project-description">Description<Textarea id="project-description" required maxLength={400} value={form.description} onChange={(event) => updateForm('description', event.target.value)} /></label>
            <label className="space-y-1 text-sm font-medium md:col-span-2" htmlFor="project-long-description">Long description<Textarea id="project-long-description" maxLength={2000} value={form.longDescription} onChange={(event) => updateForm('longDescription', event.target.value)} /></label>
            <label className="space-y-1 text-sm font-medium" htmlFor="project-live-url">Live HTTPS URL<Input id="project-live-url" type="url" placeholder="https://" value={form.liveUrl} onChange={(event) => updateForm('liveUrl', event.target.value)} /></label>
            <label className="space-y-1 text-sm font-medium" htmlFor="project-github-url">GitHub HTTPS URL<Input id="project-github-url" type="url" placeholder="https://github.com/" value={form.githubUrl} onChange={(event) => updateForm('githubUrl', event.target.value)} /></label>
            <label className="space-y-1 text-sm font-medium" htmlFor="project-tags">Tags<Input id="project-tags" placeholder="web, automation" value={form.tags} onChange={(event) => updateForm('tags', event.target.value)} /></label>
            <label className="space-y-1 text-sm font-medium" htmlFor="project-order">Sort order<Input id="project-order" type="number" min={0} value={form.order} onChange={(event) => updateForm('order', Number(event.target.value))} /></label>
            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <label className="inline-flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(event) => updateForm('published', event.target.checked)} /> Published</label>
              <label className="inline-flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(event) => updateForm('featured', event.target.checked)} /> Featured</label>
            </div>
            <div className="flex flex-wrap gap-2 md:col-span-2"><Button type="submit" disabled={saving}><Save aria-hidden="true" className="me-2 h-4 w-4" />{saving ? 'Saving…' : 'Save project'}</Button>{form.id ? <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}><X aria-hidden="true" className="me-2 h-4 w-4" />Cancel</Button> : null}</div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Portfolio projects</CardTitle><CardDescription>{projects.length} project(s)</CardDescription></CardHeader>
        <CardContent>{projects.length === 0 ? <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">No portfolio projects yet.</div> : <div className="space-y-3">{projects.map((project) => <article key={project.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{project.title}</h2><Badge variant="outline">portfolio</Badge><Badge variant={project.published ? 'default' : 'secondary'}>{project.published ? 'Published' : 'Draft'}</Badge>{project.featured ? <Badge>Featured</Badge> : null}</div><p className="mt-1 truncate text-sm text-muted-foreground">#{project.order} · {project.description}</p></div><div className="flex shrink-0 gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setForm(toForm(project))} aria-label={`Edit ${project.title}`}><Pencil aria-hidden="true" className="me-2 h-4 w-4" />Edit</Button><Button type="button" variant="ghost" size="sm" onClick={() => setDeleteTarget(project)} aria-label={`Delete ${project.title}`}><Trash2 aria-hidden="true" className="h-4 w-4 text-destructive" /></Button></div></article>)}</div>}</CardContent>
      </Card>
      <ConfirmActionDialog open={Boolean(deleteTarget)} title={`Delete ${deleteTarget?.title ?? 'project'}?`} description="This permanently removes the project and cannot be undone." pending={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={() => void deleteProject()} />
    </div>
  )
}
