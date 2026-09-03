import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SystemCore3dLauncher } from '@/components/public/system-core-3d-launcher'

const prototype = vi.hoisted(() => ({ shouldThrow: false }))

vi.mock('next/dynamic', () => ({
  default: () => function MockSystemCore3d() {
    if (prototype.shouldThrow) throw new Error('dynamic island failed')
    return <canvas data-testid="system-core-3d" />
  },
}))

describe('deferred Three.js prototype launcher', () => {
  beforeEach(() => {
    prototype.shouldThrow = false
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ getExtension: () => ({ loseContext: vi.fn() }) } as unknown as WebGL2RenderingContext)
  })

  it('does not create the GPU surface before explicit activation', () => {
    render(<SystemCore3dLauncher state="pressure" isFa />)
    expect(screen.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' })).toBeInTheDocument()
    expect(screen.queryByTestId('system-core-3d')).not.toBeInTheDocument()
  })

  it('blocks activation for reduced motion and unsupported WebGL2', () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList)
    const { rerender } = render(<SystemCore3dLauncher state="pressure" isFa />)
    fireEvent.click(screen.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }))
    expect(screen.getByRole('status')).toHaveTextContent('حرکت کمتر')
    expect(screen.queryByTestId('system-core-3d')).not.toBeInTheDocument()

    vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList)
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null)
    rerender(<SystemCore3dLauncher state="pressure" isFa />)
    fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }))
    expect(screen.getByRole('status')).toHaveTextContent('WebGL2')
  })

  it('loads the spatial surface only after a capable user activates it', () => {
    render(<SystemCore3dLauncher state="diagnosis" isFa={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Try the spatial prototype' }))
    expect(screen.getByTestId('system-core-3d')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close 3D prototype' })).toBeInTheDocument()
  })

  it('returns to the semantic fallback when the dynamic island fails', () => {
    prototype.shouldThrow = true
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(<SystemCore3dLauncher state="diagnosis" isFa />)
    fireEvent.click(screen.getByRole('button', { name: 'مشاهده نمونه سه‌بعدی' }))
    expect(screen.getByRole('status')).toHaveTextContent('متوقف شد')
    expect(screen.queryByTestId('system-core-3d')).not.toBeInTheDocument()
  })
})
