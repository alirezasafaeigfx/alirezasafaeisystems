'use client'

import { useEffect, useState } from 'react'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { Button } from '@/components/ui/button'

type Post = { id: string; title: string; slug: string; excerpt: string; content: string; tags: string; category: string; published: boolean }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]); const [title, setTitle] = useState(''); const [slug, setSlug] = useState(''); const [excerpt, setExcerpt] = useState(''); const [content, setContent] = useState(''); const [error, setError] = useState('')
  const load = async () => { const response = await fetch('/api/admin/blog?published=all', { cache: 'no-store' }); if (response.ok) setPosts((await response.json()).posts as Post[]) }
  useEffect(() => { const timer = window.setTimeout(() => { void load() }, 0); return () => window.clearTimeout(timer) }, [])
  const create = async () => { setError(''); const response = await fetch('/api/admin/blog', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, slug, excerpt, content, tags: [], category: 'engineering', published: false, featured: false }) }); if (!response.ok) { setError('Unable to save post'); return }; setTitle(''); setSlug(''); setExcerpt(''); setContent(''); await load() }
  const remove = async (id: string) => { if (!window.confirm('Delete this post?')) return; await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); await load() }
  return <div className="space-y-8"><AdminPageHeader title="Blog" description="Draft, review and publish engineering insights." /><section className="space-y-4 rounded-xl border p-6"><h2 className="text-lg font-semibold">New draft</h2><input aria-label="Title" className="h-11 w-full rounded border px-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" /><input aria-label="Slug" className="h-11 w-full rounded border px-3" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" /><textarea aria-label="Excerpt" className="min-h-20 w-full rounded border p-3" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Excerpt" /><textarea aria-label="Content" className="min-h-40 w-full rounded border p-3" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Markdown content" /><Button onClick={create}>Save draft</Button>{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}</section><section className="space-y-3"><h2 className="text-lg font-semibold">Library</h2>{posts.map((post) => <article key={post.id} className="flex items-center justify-between rounded border p-4"><div><h3 className="font-medium">{post.title}</h3><p className="text-sm text-muted-foreground">{post.published ? 'Published' : 'Draft'} · {post.slug}</p></div><Button variant="destructive" size="sm" onClick={() => remove(post.id)}>Delete</Button></article>)}</section></div>
}
