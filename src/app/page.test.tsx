import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useVoiceRecorder } from 'react-voice-recorder-kit'
import type { RecorderState, UseVoiceRecorderReturn } from 'react-voice-recorder-kit'
import Home from './page'

jest.mock('react-voice-recorder-kit', () => ({ useVoiceRecorder: jest.fn() }))
jest.mock('@hooks/useMp3Download', () => ({
  useMp3Download: () => ({ isDownloading: false, errorMessage: undefined, handleDownload: jest.fn() }),
}))

function makeRecorder(overrides: Partial<UseVoiceRecorderReturn>): UseVoiceRecorderReturn {
  return {
    state: 'idle' as RecorderState,
    seconds: 0,
    levels: [],
    audioUrl: null,
    start: jest.fn(),
    handlePause: jest.fn(),
    handleResume: jest.fn(),
    handleStop: jest.fn(),
    handleRestart: jest.fn(),
    handleDelete: jest.fn(),
    ...overrides,
  } as UseVoiceRecorderReturn
}

describe('Home', () => {
  it('should show the idle state with a record button', () => {
    jest.mocked(useVoiceRecorder).mockReturnValue(makeRecorder({}))

    render(<Home />)

    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('should start recording when the record button is clicked', async () => {
    const recorder = makeRecorder({})
    jest.mocked(useVoiceRecorder).mockReturnValue(recorder)
    const user = userEvent.setup()
    render(<Home />)

    await user.click(screen.getByRole('button', { name: 'Record' }))

    expect(recorder.start).toHaveBeenCalledTimes(1)
  })

  it('should show the elapsed time while recording', () => {
    jest.mocked(useVoiceRecorder).mockReturnValue(makeRecorder({ state: 'recording', seconds: 65 }))

    render(<Home />)

    expect(screen.getByText('01:05')).toBeInTheDocument()
    expect(screen.getByText('Recording…')).toBeInTheDocument()
  })

  it('should show the player once a recording is ready', () => {
    jest.mocked(useVoiceRecorder).mockReturnValue(makeRecorder({ state: 'reviewing', audioUrl: 'blob:recording' }))

    render(<Home />)

    expect(screen.getByTestId('recording-audio')).toHaveAttribute('src', 'blob:recording')
    expect(screen.getByRole('button', { name: /download mp3/i })).toBeInTheDocument()
  })

  it('should hide the player when there is no recorded audio', () => {
    jest.mocked(useVoiceRecorder).mockReturnValue(makeRecorder({ state: 'reviewing', audioUrl: null }))

    render(<Home />)

    expect(screen.queryByTestId('recording-audio')).not.toBeInTheDocument()
  })
})
