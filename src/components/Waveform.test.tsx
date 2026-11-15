import { render, screen } from '@testing-library/react'
import { Waveform } from '@components/Waveform'

describe('Waveform', () => {
  it('should render one bar per level', () => {
    render(<Waveform levels={[0.1, 0.5, 1]} isActive={false} />)

    expect(screen.getByTestId('waveform').children).toHaveLength(3)
  })

  it('should enforce a minimum bar height', () => {
    render(<Waveform levels={[0]} isActive={false} />)

    expect(screen.getByTestId('waveform').children[0]).toHaveStyle({ height: '4px' })
  })

  it('should scale bar height with the level', () => {
    render(<Waveform levels={[1]} isActive />)

    expect(screen.getByTestId('waveform').children[0]).toHaveStyle({ height: '40px' })
  })

  it('should highlight bars while active', () => {
    render(<Waveform levels={[0.5]} isActive />)

    expect(screen.getByTestId('waveform').children[0]).toHaveClass('bg-red-500')
  })
})
