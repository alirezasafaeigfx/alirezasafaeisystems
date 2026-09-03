import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { validateRemoteArtifacts, type PublicExperienceEvidenceManifest } from '@/../scripts/ci/validate-public-experience-evidence.mjs'

const candidateSha = 'b'.repeat(40)
const validHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'

function manifest(): PublicExperienceEvidenceManifest {
  return {
    schemaVersion: 1,
    taskIds: ['S5-01'],
    repository: 'alirezasafaeigfx/alirezasafaeisystems',
    baseSha: 'a'.repeat(40),
    candidateSha,
    environment: 'REVIEW_WORKSPACE',
    capturedAt: '2026-09-02T20:00:00Z',
    sourceDirty: false,
    commands: [],
    criteria: [],
    artifacts: [{
      id: 'remote-proof',
      relativePath: 'remote-proof.bin',
      durableUrl: 'https://evidence.example/proof.bin',
      sha256: validHash,
      locale: 'en',
      viewport: '390x844',
      theme: 'light',
      state: 'evidence',
      captureConditions: 'review fixture',
    }],
    reviews: [],
    release: null,
    limitations: [],
  }
}

describe('remote public-experience artifact retrieval', () => {
  it('rejects an oversized declared response before buffering its body and supplies a deadline signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('hello', {
      status: 200,
      headers: { 'content-length': String(64 * 1024 * 1024) },
    }))
    vi.stubGlobal('fetch', fetchMock)
    try {
      await expect(validateRemoteArtifacts(manifest())).resolves.toEqual([
        expect.stringContaining('exceeds remote artifact byte limit'),
      ])
      expect(fetchMock).toHaveBeenCalledWith(
        'https://evidence.example/proof.bin',
        expect.objectContaining({ redirect: 'follow', signal: expect.any(AbortSignal) }),
      )
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('streams bounded response bytes instead of reading the entire response with arrayBuffer', () => {
    const source = readFileSync('scripts/ci/validate-public-experience-evidence.mjs', 'utf8')
    expect(source).toContain('response.body.getReader()')
    expect(source).toContain('REMOTE_ARTIFACT_MAX_BYTES')
    expect(source).toContain('AbortSignal.timeout')
    expect(source).not.toContain('response.arrayBuffer()')
  })
})
