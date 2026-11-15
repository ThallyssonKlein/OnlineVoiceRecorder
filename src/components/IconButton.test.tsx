import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from '@components/IconButton'

describe('IconButton', () => {
  it('should call onClick when clicked', async () => {
    const onClick = jest.fn()
    const user = userEvent.setup()
    render(<IconButton onClick={onClick} title="Record">icon</IconButton>)

    await user.click(screen.getByRole('button', { name: 'Record' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should render its children', () => {
    render(<IconButton onClick={jest.fn()} title="Stop" variant="danger">child content</IconButton>)

    expect(screen.getByText('child content')).toBeInTheDocument()
  })
})
