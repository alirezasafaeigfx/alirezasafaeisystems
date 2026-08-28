import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AdminStatCardProps = {
  label: string
  value: number | string
  detail?: ReactNode
}

export function AdminStatCard({ label, value, detail }: AdminStatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">{value}</p>
        {detail ? <div className="mt-2 text-sm text-muted-foreground">{detail}</div> : null}
      </CardContent>
    </Card>
  )
}
