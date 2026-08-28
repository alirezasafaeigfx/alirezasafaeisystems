import { db } from '@/lib/db'

export type AdminOverview = {
  leads: { total: number; new: number; qualified: number }
  messages: { total: number }
  discover: { published: number; draft: number }
  blog: { published: number; draft: number }
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [
    leadTotal,
    leadNew,
    leadQualified,
    messageTotal,
    discoverPublished,
    discoverDraft,
    blogPublished,
    blogDraft,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: 'new' } }),
    db.lead.count({ where: { status: 'qualified' } }),
    db.contactMessage.count(),
    db.discoverItem.count({ where: { published: true } }),
    db.discoverItem.count({ where: { published: false } }),
    db.blogPost.count({ where: { published: true } }),
    db.blogPost.count({ where: { published: false } }),
  ])

  return {
    leads: { total: leadTotal, new: leadNew, qualified: leadQualified },
    messages: { total: messageTotal },
    discover: { published: discoverPublished, draft: discoverDraft },
    blog: { published: blogPublished, draft: blogDraft },
  }
}
