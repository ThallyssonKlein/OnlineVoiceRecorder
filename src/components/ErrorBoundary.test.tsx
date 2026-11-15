import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '@components/ErrorBoundary'

jest.mock('@services/logger', () => ({ logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } }))

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('render failure')

  return <p>safe content</p>
}

describe('ErrorBoundary', () => {
  it('should render its children when nothing fails', () => {
    render(<ErrorBoundary><Bomb shouldThrow={false} /></ErrorBoundary>)

    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('should show a fallback when a child fails to render', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

    render(<ErrorBoundary><Bomb shouldThrow /></ErrorBoundary>)

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    consoleSpy.mockRestore()
  })

  it('should render the children again after retrying', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const user = userEvent.setup()
    let shouldThrow = true
    function FlakyChild() {
      return <Bomb shouldThrow={shouldThrow} />
    }
    render(<ErrorBoundary><FlakyChild /></ErrorBoundary>)
    shouldThrow = false

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.getByText('safe content')).toBeInTheDocument()
    consoleSpy.mockRestore()
  })
})
