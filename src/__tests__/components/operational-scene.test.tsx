import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OperationalScene } from '@/components/public/operational-scene'

describe('Gate A operational scene', () => {
  it('keeps the delivery narrative available as semantic SVG content', () => {
    render(<OperationalScene isFa={false} />)

    expect(screen.getByTestId('operational-scene')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /From problem to reviewable evidence/ })).toBeInTheDocument()
    expect(screen.getByText('Stable path ready for verification')).toBeInTheDocument()
    expect(screen.queryByText('WebGL')).not.toBeInTheDocument()
  })
})
