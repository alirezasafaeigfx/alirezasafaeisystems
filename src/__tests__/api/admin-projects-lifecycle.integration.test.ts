import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const projectMock = vi.hoisted(() => ({
  update: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: { project: projectMock },
}))

describe('admin project lifecycle API', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    process.env.API_RATE_LIMIT_MAX_REQUESTS = '20'
    process.env.API_RATE_LIMIT_WINDOW_MS = '60000'
  })

  it('updates publication and Discover metadata for an existing project', async () => {
    projectMock.update.mockResolvedValueOnce({ id: 'project_123', published: true, contentType: 'discover' })
    const { PATCH } = await import('@/app/api/admin/projects/route')
    const request = new NextRequest('http://localhost:3000/api/admin/projects', {
      method: 'PATCH',
      headers: {
        authorization: 'Bearer abcdefghijklmnopqrstuvwxyz',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id: 'project_123', published: true, contentType: 'discover', featured: true, order: 2 }),
    })

    const response = await PATCH(request)

    expect(response.status).toBe(200)
    expect(projectMock.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'project_123' },
      data: expect.objectContaining({ published: true, contentType: 'discover', featured: true, order: 2 }),
    }))
  })

  it('rejects a credential-bearing URL before touching the database', async () => {
    const { PATCH } = await import('@/app/api/admin/projects/route')
    const request = new NextRequest('http://localhost:3000/api/admin/projects', {
      method: 'PATCH',
      headers: {
        authorization: 'Bearer abcdefghijklmnopqrstuvwxyz',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id: 'project_123', liveUrl: 'https://user:password@example.com/tool' }),
    })

    const response = await PATCH(request)

    expect(response.status).toBe(400)
    expect(projectMock.update).not.toHaveBeenCalled()
  })

  it('deletes an authenticated project by id', async () => {
    projectMock.delete.mockResolvedValueOnce({ id: 'project_123' })
    const { DELETE } = await import('@/app/api/admin/projects/route')
    const request = new NextRequest('http://localhost:3000/api/admin/projects?id=project_123', {
      method: 'DELETE',
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
    })

    const response = await DELETE(request)
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(projectMock.delete).toHaveBeenCalledWith({ where: { id: 'project_123' } })
  })
})
