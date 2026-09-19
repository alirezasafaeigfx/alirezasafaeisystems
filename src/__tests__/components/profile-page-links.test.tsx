import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  headers: async () => ({ get: () => null }),
}))

vi.mock('@/lib/i18n/server', () => ({
  getRequestLanguage: async () => 'en',
}))

describe('public profile links', () => {
  it('sends profile visitors to the maintained public GitHub repository', async () => {
    const { default: ProfilePage } = await import('@/app/profile/page')
    render(await ProfilePage())

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/alirezasafaeigfx/alirezasafaeisystems',
    )
  })
})
