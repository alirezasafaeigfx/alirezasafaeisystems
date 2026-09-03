import { fireEvent, render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { OperationalScene } from '@/components/public/operational-scene'

describe('Gate A operational scene', () => {
  it('keeps the delivery narrative available as semantic SVG content', () => {
    render(<OperationalScene isFa={false} />)

    expect(screen.getByTestId('operational-scene')).toBeInTheDocument()
    expect(screen.getByTestId('operational-scene')).toHaveAttribute('data-motion-engine', 'animejs')
    expect(screen.getByRole('img', { name: /See the problem, then follow the repair/ })).toBeInTheDocument()
    expect(screen.getAllByText('The system is under pressure')).not.toHaveLength(0)
    expect(screen.queryByText('WebGL')).not.toBeInTheDocument()
  })

  it('ships the complete no-JS explanation in SSR markup without a hydration snapshot flip', () => {
    const html = renderToStaticMarkup(<OperationalScene isFa />)

    expect(html).toContain('<noscript>')
    expect(html).toContain('data-testid="operational-scene-fallback"')
    expect(html).toContain('این نمونهٔ آموزشی بدون تعامل هم کامل است')
  })

  it('keeps rapid state selection deterministic while the finite morph is active', () => {
    render(<OperationalScene isFa={false} />)
    const scene = screen.getByTestId('operational-scene')
    fireEvent.click(within(scene).getByRole('button', { name: /Inspect the evidence/ }))
    fireEvent.click(within(scene).getByRole('button', { name: /We isolate the cause/ }))
    fireEvent.click(within(scene).getByRole('button', { name: /The path is stable again/ }))
    expect(scene).toHaveAttribute('data-state', 'stable')
    expect(within(scene).getByTestId('operational-scene-path')).toHaveAttribute('d', 'M48 56 H592')
  })

  it('changes geometry, active-node emphasis, and explanatory meaning across five selectable states', () => {
    render(<OperationalScene isFa={false} />)
    const scene = screen.getByTestId('operational-scene')
    const svg = within(scene).getByRole('img')
    const path = within(svg).getByTestId('operational-scene-path')

    expect(scene).toHaveAttribute('data-state', 'pressure')
    const pressurePath = path.getAttribute('d')
    fireEvent.click(within(scene).getByRole('button', { name: /We isolate the cause/ }))
    expect(scene).toHaveAttribute('data-state', 'diagnosis')
    expect(path.getAttribute('d')).not.toBe(pressurePath)
    expect(within(scene).getAllByText(/We isolate the part causing the failure/)).not.toHaveLength(0)
    const diagnosisNodes = [...scene.querySelectorAll<SVGGElement>('[data-scene-node]')]
    expect(diagnosisNodes[0]).toHaveAttribute('data-active', 'false')
    expect(diagnosisNodes[0]?.querySelector('circle')).toHaveAttribute('r', '18')
    expect(diagnosisNodes[1]).toHaveAttribute('data-active', 'true')
    expect(diagnosisNodes[1]?.querySelector('circle')).toHaveAttribute('r', '22')
    expect(diagnosisNodes[2]).toHaveAttribute('data-active', 'true')
    expect(diagnosisNodes[2]?.querySelector('circle')).toHaveAttribute('r', '22')

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
