import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { MessagesList } from '@/components/admin/messages/messages-list'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAdminMessages } from '@/lib/admin/messages'

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams
  const query = typeof raw.q === 'string' ? raw.q.trim() : ''
  const messages = await getAdminMessages(query)
  const serializable = messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() }))
  return <div className="space-y-6"><AdminPageHeader title="Messages" description="Contact messages received through the public form." /><form className="max-w-md space-y-1.5"><Label htmlFor="message-search">Search messages</Label><Input id="message-search" name="q" defaultValue={query} placeholder="Name, email, or subject" /></form>{serializable.length ? <MessagesList messages={serializable} /> : <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">{query ? 'No messages match this search.' : 'No messages yet.'}</div>}</div>
}
