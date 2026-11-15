import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecordingPlayer } from '@components/RecordingPlayer'

interface PlayerOverrides {
  isDownloading?: boolean
  errorMessage?: string
  onDownload?: () => void
}

function renderPlayer(overrides: PlayerOverrides = {}) {
  const props = { audioUrl: 'blob:recording', isDownloading: false, errorMessage: undefined, onDownload: jest.fn(), ...overrides }
  render(<RecordingPlayer {...props} />)

  return props
}

describe('RecordingPlayer', () => {
  it('should play the recorded audio', () => {
    renderPlayer()

    expect(screen.getByTestId('recording-audio')).toHaveAttribute('src', 'blob:recording')
  })

  it('should request a download when the button is clicked', async () => {
    const user = userEvent.setup()
    const { onDownload } = renderPlayer()

    await user.click(screen.getByRole('button', { name: /download mp3/i }))

    expect(onDownload).toHaveBeenCalledTimes(1)
  })

  it('should disable the button and show progress while converting', () => {
    renderPlayer({ isDownloading: true })

    expect(screen.getByRole('button', { name: 'Converting…' })).toBeDisabled()
  })

  it('should show the error message when the download failed', () => {
    renderPlayer({ errorMessage: 'Conversion failed' })

    expect(screen.getByRole('alert')).toHaveTextContent('Conversion failed')
  })

  it('should not show an alert when there is no error', () => {
    renderPlayer()

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
