import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const projectMock = vi.hoisted(() => ({ findMany: vi.fn() }))

vi.mock('@/lib/db', () => ({ db: { project: projectMock } }))

describe('Admin Projects V3', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('loads portfolio projects server-first with the existing admin ordering', async () => {
    const projects = [{
      id: 'project_123456', title: 'Audit platform', description: 'A trusted audit surface',
      longDescription: null, githubUrl: null, liveUrl: 'https://example.com', tags: 'audit,trust',
      contentType: 'portfolio', featured: true, published: true, order: 1,
    }]
    projectMock.findMany.mockResolvedValueOnce(projects)
    const { default: AdminProjectsPage } = await import('@/app/admin/(control)/projects/page')

    const page = await AdminProjectsPage()
    const manager = page.props.children[1]

    expect(projectMock.findMany).toHaveBeenCalledWith({
      where: { contentType: 'portfolio' },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    })
    expect(manager.props.initialProjects).toEqual(projects)
  })

  it('sends the complete project metadata on save and uses confirmation before delete', async () => {
    const project = {
      id: 'project_123456', title: 'Audit platform', description: 'A trusted audit surface',
      longDescription: null, githubUrl: null, liveUrl: null, tags: 'audit,trust',
      contentType: 'portfolio' as const, featured: true, published: false, order: 2,
    }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ project }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)
    const { ProjectsManager } = await import('@/components/admin/projects/projects-manager')

    render(<ProjectsManager initialProjects={[project]} />)
    fireEvent.click(screen.getByRole('button', { name: /edit audit platform/i }))
    fireEvent.click(screen.getByRole('button', { name: /save project/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/admin/projects', expect.objectContaining({ method: 'PATCH' })))
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      id: project.id, contentType: 'portfolio', featured: true, published: false, order: 2,
    })

    fireEvent.click(screen.getByRole('button', { name: /delete audit platform/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: /delete permanently/i }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(`/api/admin/projects?id=${project.id}`, { method: 'DELETE' }))
  })
})
