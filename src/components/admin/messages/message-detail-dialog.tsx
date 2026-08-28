'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export type AdminMessage = { id: string; name: string; email: string; subject: string | null; message: string; createdAt: string }

export function MessageDetailDialog({ message, open, onOpenChange }: { message: AdminMessage | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!message) return null
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{message.subject || 'Contact message'}</DialogTitle><DialogDescription>From {message.name} · {message.email}</DialogDescription></DialogHeader><p className="whitespace-pre-wrap text-sm leading-6">{message.message}</p><p className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</p></DialogContent></Dialog>
}
