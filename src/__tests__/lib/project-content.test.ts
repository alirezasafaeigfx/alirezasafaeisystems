import { describe, expect, it } from 'vitest'
import {
  projectContentTypeSchema,
  projectPublicationSchema,
  projectTagsSchema,
} from '@/lib/project-content'

describe('project content contracts', () => {
  it('accepts only the two supported content surfaces', () => {
    expect(projectContentTypeSchema.parse('portfolio')).toBe('portfolio')
    expect(projectContentTypeSchema.parse('discover')).toBe('discover')
    expect(projectContentTypeSchema.safeParse('other').success).toBe(false)
  })

  it('normalizes publication input to a boolean', () => {
    expect(projectPublicationSchema.parse(true)).toBe(true)
    expect(projectPublicationSchema.parse(false)).toBe(false)
    expect(projectPublicationSchema.safeParse('true').success).toBe(false)
  })

  it('normalizes comma-separated and array tags without empty values', () => {
    expect(projectTagsSchema.parse(' AI, , tools ')).toEqual(['AI', 'tools'])
    expect(projectTagsSchema.parse(['AI', '', 'tools'])).toEqual(['AI', 'tools'])
  })
})
