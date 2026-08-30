import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OperationalScene } from '@/components/public/operational-scene'

describe('Gate A operational scene', () => {
  it('keeps the delivery narrative available as semantic SVG content', () => {
    render(<OperationalScene isFa={false} />)

    expect(screen.getByTestId('operational-scene')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /See the problem, then follow the repair/ })).toBeInTheDocument()
    expect(screen.getAllByText('The system is under pressure')).not.toHaveLength(0)
    expect(screen.queryByText('WebGL')).not.toBeInTheDocument()
  })

  it('changes geometry and explanatory meaning across five selectable states', () => {
    render(<OperationalScene isFa={false} />)
    const scene = screen.getByTestId('operational-scene')
    const svg = within(scene).getByRole('img')
    const path = within(svg).getByTestId('operational-scene-path')

    expect(scene).toHaveAttribute('data-state', 'pressure')
    const pressurePath = path.getAttribute('d')
    fireEvent.click(within(scene).getByRole('button', { name: /We isolate the cause/ }))
    expect(scene).toHaveAttribute('data-state', 'diagnosis')
    expect(path.getAttribute('d')).not.toBe(pressurePath)
    expect(within(scene).getByText(/We isolate the part causing the failure/)).toBeInTheDocument()

    fireEvent.click(within(scene).getByRole('button', { name: 'Next state' }))
    expect(scene).toHaveAttribute('data-state', 'intervention')
    fireEvent.click(within(scene).getByRole('button', { name: 'Previous state' }))
    expect(scene).toHaveAttribute('data-state', 'diagnosis')
  })

  it('clamps keyboard-equivalent next and previous actions at the state boundaries', () => {
    render(<OperationalScene isFa={true} />)
    const scene = screen.getByTestId('operational-scene')
    const next = within(scene).getByRole('button', { name: 'مرحله بعد' })
    const previous = within(scene).getByRole('button', { name: 'مرحله قبل' })
    fireEvent.click(previous)
    expect(scene).toHaveAttribute('data-state', 'pressure')
    ;['مرحله بعد', 'مرحله بعد', 'مرحله بعد', 'مرحله بعد', 'مرحله بعد'].forEach((name) => fireEvent.click(within(scene).getByRole('button', { name })))
    expect(scene).toHaveAttribute('data-state', 'evidence')
    fireEvent.click(next)
    expect(scene).toHaveAttribute('data-state', 'evidence')
  })
})
