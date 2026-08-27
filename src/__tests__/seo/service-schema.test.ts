import { describe, expect, it } from 'vitest'
import { generateServiceSchema } from '@/lib/seo'

describe('service structured data', () => {
  it('describes the audit service without publishing an unverified price', () => {
    const schema = generateServiceSchema('fa-IR')

    expect(schema['@type']).toBe('Service')
    expect(schema.name).toContain('ارزیابی')
    expect(schema.description).toContain('عملکرد')
    expect(schema).not.toHaveProperty('offers')
  })

  it('localizes the service for English pages', () => {
    const schema = generateServiceSchema('en-US')

    expect(schema.name).toContain('Website Assessment')
    expect(schema.inLanguage).toBe('en-US')
  })
})
