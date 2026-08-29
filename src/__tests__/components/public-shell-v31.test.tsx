import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionHeading } from '@/components/public/section-heading'
import { VisualFrame } from '@/components/public/visual-frame'

describe('V3.1 public visual primitives', () => {
  it('renders one labelled editorial section heading', () => {
    render(
      <SectionHeading
        eyebrow="Selected work"
        title="Systems I have shipped"
        description="Real product proof."
      />,
    )

    expect(screen.getByText('Selected work')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Systems I have shipped' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Real product proof.')).toBeInTheDocument()
  })

  it('reserves media dimensions and exposes semantic content', () => {
    render(
      <VisualFrame ariaLabel="PersianToolbox product preview">
        <span>preview</span>
      </VisualFrame>,
    )

    expect(screen.getByLabelText('PersianToolbox product preview')).toHaveClass(
      'public-visual-frame',
    )
    expect(screen.getByText('preview')).toBeInTheDocument()
  })
})
