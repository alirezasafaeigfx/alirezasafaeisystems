import { describe, expect, it } from 'vitest'
import { isBenignNextRscAbort } from '../../scripts/deploy/live-verify-classification.mjs'

type RequestLike = {
  method: () => string
  url: () => string
  resourceType: () => string
  isNavigationRequest: () => boolean
  failure: () => { errorText?: string } | null
}

function request(overrides: Partial<{
  method: string
  url: string
  resourceType: string
  navigation: boolean
  errorText: string
}> = {}): RequestLike {
  const values = {
    method: 'GET',
    url: 'https://example.test/discover?_rsc=abc',
    resourceType: 'fetch',
    navigation: false,
    errorText: 'net::ERR_ABORTED',
    ...overrides,
  }
  return {
    method: () => values.method,
    url: () => values.url,
    resourceType: () => values.resourceType,
    isNavigationRequest: () => values.navigation,
    failure: () => ({ errorText: values.errorText }),
  }
}

describe('live verifier Next.js RSC abort classification', () => {
  const origin = 'https://example.test'

  it('classifies same-origin GET Discover RSC ERR_ABORTED fetches as benign', () => {
    expect(isBenignNextRscAbort(request(), origin)).toBe(true)
  })

  it('classifies same-origin GET English RSC ERR_ABORTED fetches as benign', () => {
    expect(isBenignNextRscAbort(request({ url: 'https://example.test/en?_rsc=abc' }), origin)).toBe(true)
  })

  it('classifies a non-navigation RSC abort regardless of Playwright resource classification', () => {
    expect(isBenignNextRscAbort(request({ resourceType: 'other' }), origin)).toBe(true)
  })

  it('keeps a document navigation ERR_ABORTED fatal', () => {
    expect(isBenignNextRscAbort(request({ resourceType: 'document', navigation: true }), origin)).toBe(false)
  })

  it('keeps a non-abort RSC failure fatal', () => {
    expect(isBenignNextRscAbort(request({ errorText: 'net::ERR_CONNECTION_RESET' }), origin)).toBe(false)
  })

  it('does not classify successful RSC requests as failures or warnings', () => {
    expect(isBenignNextRscAbort(request({ errorText: '' }), origin)).toBe(false)
  })
})
