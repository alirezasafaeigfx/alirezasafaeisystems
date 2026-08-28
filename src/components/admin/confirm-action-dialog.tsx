'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type ConfirmActionDialogProps = {
  open: boolean
  title: string
  description: string
  pending?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmActionDialog({ open, title, description, pending, onCancel, onConfirm }: ConfirmActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={pending}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={pending}>{pending ? 'Deleting…' : 'Delete permanently'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
