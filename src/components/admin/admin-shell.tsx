'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, LogOut } from 'lucide-react'
import { AdminMobileNav } from '@/components/admin/admin-mobile-nav'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter()

  async function logout() {
    const response = await fetch('/api/admin/auth/logout', { method: 'POST' })
    if (!response.ok) {
      toast({ title: 'Logout failed', description: 'Try again.', variant: 'destructive' })
      return
    }
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-dvh bg-muted/20">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring">
        Skip to admin content
      </a>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <AdminMobileNav />
            <Link href="/admin" className="font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring">ASDEV Control Center</Link>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/" target="_blank" rel="noopener noreferrer">View site <ExternalLink aria-hidden="true" className="ms-2 size-4" /></Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] border-e bg-background p-4 lg:flex lg:flex-col">
          <AdminSidebar />
          <Button variant="ghost" className="mt-auto justify-start text-muted-foreground" onClick={logout}>
            <LogOut aria-hidden="true" className="me-3 size-4" /> Log out
          </Button>
        </aside>
        <main id="admin-main" tabIndex={-1} className="min-w-0 p-4 outline-none sm:p-6 lg:p-8">
          {children}
          <Button variant="ghost" className="mt-8 w-full justify-start text-muted-foreground lg:hidden" onClick={logout}>
            <LogOut aria-hidden="true" className="me-3 size-4" /> Log out
          </Button>
        </main>
      </div>
    </div>
  )
}
