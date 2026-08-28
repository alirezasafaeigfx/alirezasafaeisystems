'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open admin navigation">
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="left-0 top-0 h-dvh max-w-xs translate-x-0 translate-y-0 rounded-none sm:rounded-none">
        <DialogHeader><DialogTitle>ASDEV Control Center</DialogTitle></DialogHeader>
        <AdminSidebar onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
