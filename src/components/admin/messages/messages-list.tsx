'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmActionDialog } from '@/components/admin/confirm-action-dialog'
import { MessageDetailDialog, type AdminMessage } from './message-detail-dialog'
import { toast } from '@/hooks/use-toast'

export function MessagesList({ messages }: { messages: AdminMessage[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<AdminMessage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminMessage | null>(null)
  const [deleting, setDeleting] = useState(false)
  async function deleteMessage() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/messages?id=${encodeURIComponent(deleteTarget.id)}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete failed')
      toast({ title: 'Message deleted', description: `The message from ${deleteTarget.name} was permanently deleted.` })
      setDeleteTarget(null)
      router.refresh()
    } catch {
      toast({ title: 'Delete failed', description: 'The message was not deleted.', variant: 'destructive' })
    } finally { setDeleting(false) }
  }
  return <>
    <div className="space-y-3 md:hidden">{messages.map((message) => <article key={message.id} className="rounded-lg border bg-background p-4"><button className="w-full text-start" onClick={() => setSelected(message)}><h2 className="font-semibold">{message.subject || 'Contact message'}</h2><p className="text-sm text-muted-foreground">{message.name} · {message.email}</p><p className="mt-2 line-clamp-2 text-sm">{message.message}</p></button><Button className="mt-3" size="sm" variant="destructive" disabled={deleting} onClick={() => setDeleteTarget(message)}>Delete message</Button></article>)}</div>
    <div className="hidden overflow-x-auto md:block"><table className="w-full text-sm"><caption className="sr-only">Contact messages</caption><thead><tr className="border-b"><th className="p-3 text-start font-medium">Name</th><th className="p-3 text-start font-medium">Email</th><th className="p-3 text-start font-medium">Subject</th><th className="p-3 text-start font-medium">Date</th><th className="p-3 text-end font-medium">Actions</th></tr></thead><tbody>{messages.map((message) => <tr key={message.id} className="border-b"><td className="p-3"><button className="font-medium underline-offset-4 hover:underline" onClick={() => setSelected(message)}>{message.name}</button></td><td className="p-3">{message.email}</td><td className="p-3">{message.subject || '—'}</td><td className="p-3 text-muted-foreground">{new Date(message.createdAt).toLocaleDateString()}</td><td className="p-3 text-end"><Button size="sm" variant="destructive" disabled={deleting} onClick={() => setDeleteTarget(message)}>Delete</Button></td></tr>)}</tbody></table></div>
    <MessageDetailDialog message={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    <ConfirmActionDialog open={Boolean(deleteTarget)} title={`Delete message from ${deleteTarget?.name ?? ''}?`} description="This permanently removes the message and cannot be undone." pending={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={deleteMessage} />
  </>
}
