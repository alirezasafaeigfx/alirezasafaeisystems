import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'

export const metadata: Metadata = {
  title: { default: 'Control Center', template: '%s | ASDEV Control Center' },
  robots: { index: false, follow: false },
}

export default function AdminControlLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
