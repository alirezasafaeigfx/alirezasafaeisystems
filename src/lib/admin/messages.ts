import { db } from '@/lib/db'

export type MessageSearchFields = { name: string; email: string; subject?: string | null }

export function matchesMessageQuery(message: MessageSearchFields, query: string) {
  const q = query.trim().toLocaleLowerCase()
  if (!q) return true
  return [message.name, message.email, message.subject ?? ''].some((value) => value.toLocaleLowerCase().includes(q))
}

export async function getAdminMessages(query = '') {
  const q = query.trim()
  return db.contactMessage.findMany({
    where: q ? {
      OR: [
        { name: { contains: q } },
        { email: { contains: q } },
        { subject: { contains: q } },
      ],
    } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
}
