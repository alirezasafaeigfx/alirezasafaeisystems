import { z } from 'zod'

export const projectContentTypeSchema = z.enum(['portfolio', 'discover'])
export const projectPublicationSchema = z.boolean()

const projectTagSchema = z.string().trim().max(40)

export const projectTagsSchema = z.union([
  z.array(projectTagSchema),
  z.string(),
]).transform((value) => {
  const values = Array.isArray(value) ? value : value.split(',')
  return [...new Set(values.map((tag) => tag.trim()).filter(Boolean))]
})

export type ProjectContentType = z.infer<typeof projectContentTypeSchema>
