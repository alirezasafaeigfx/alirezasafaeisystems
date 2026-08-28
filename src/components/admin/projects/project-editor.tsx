'use client'

import { FormEvent } from 'react'
import { Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { AdminProject } from './projects-manager'

export type ProjectForm = Omit<AdminProject, 'id' | 'longDescription' | 'githubUrl' | 'liveUrl' | 'tags'> & { id?: string; longDescription: string; githubUrl: string; liveUrl: string; tags: string }
export const emptyProjectForm: ProjectForm = { title: '', description: '', longDescription: '', githubUrl: '', liveUrl: '', tags: '', contentType: 'portfolio', featured: false, published: false, order: 0 }
export const projectToForm = (project: AdminProject): ProjectForm => ({ ...project, longDescription: project.longDescription ?? '', githubUrl: project.githubUrl ?? '', liveUrl: project.liveUrl ?? '' })

export function ProjectEditor({ form, saving, onChange, onSubmit, onCancel }: { form: ProjectForm; saving: boolean; onChange: <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return <Card><CardHeader><CardTitle>{form.id ? 'Edit portfolio project' : 'New portfolio project'}</CardTitle><CardDescription>Keep project metadata precise so portfolio proof can route visitors toward ASDEV Audit.</CardDescription></CardHeader><CardContent><form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
    <label className="space-y-1 text-sm font-medium" htmlFor="project-title">Title<Input id="project-title" required maxLength={140} value={form.title} onChange={(e) => onChange('title', e.target.value)} /></label>
    <label className="space-y-1 text-sm font-medium md:col-span-2" htmlFor="project-description">Description<Textarea id="project-description" required maxLength={400} value={form.description} onChange={(e) => onChange('description', e.target.value)} /></label>
    <label className="space-y-1 text-sm font-medium md:col-span-2" htmlFor="project-long-description">Long description<Textarea id="project-long-description" maxLength={2000} value={form.longDescription} onChange={(e) => onChange('longDescription', e.target.value)} /></label>
    <label className="space-y-1 text-sm font-medium" htmlFor="project-live-url">Live HTTPS URL<Input id="project-live-url" type="url" placeholder="https://" value={form.liveUrl} onChange={(e) => onChange('liveUrl', e.target.value)} /></label>
    <label className="space-y-1 text-sm font-medium" htmlFor="project-github-url">GitHub HTTPS URL<Input id="project-github-url" type="url" placeholder="https://github.com/" value={form.githubUrl} onChange={(e) => onChange('githubUrl', e.target.value)} /></label>
    <label className="space-y-1 text-sm font-medium" htmlFor="project-tags">Tags<Input id="project-tags" placeholder="web, automation" value={form.tags} onChange={(e) => onChange('tags', e.target.value)} /></label>
    <label className="space-y-1 text-sm font-medium" htmlFor="project-order">Sort order<Input id="project-order" type="number" min={0} value={form.order} onChange={(e) => onChange('order', Number(e.target.value))} /></label>
    <div className="flex flex-wrap items-center gap-4 md:col-span-2"><label className="inline-flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => onChange('published', e.target.checked)} /> Published</label><label className="inline-flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => onChange('featured', e.target.checked)} /> Featured</label></div>
    <div className="flex flex-wrap gap-2 md:col-span-2"><Button type="submit" disabled={saving}><Save aria-hidden="true" className="me-2 h-4 w-4" />{saving ? 'Saving…' : 'Save project'}</Button>{form.id ? <Button type="button" variant="outline" onClick={onCancel}><X aria-hidden="true" className="me-2 h-4 w-4" />Cancel</Button> : null}</div>
  </form></CardContent></Card>
}
