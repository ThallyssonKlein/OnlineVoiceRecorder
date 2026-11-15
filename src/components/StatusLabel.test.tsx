import { render, screen } from '@testing-library/react'
import type { RecorderState } from 'react-voice-recorder-kit'
import { StatusLabel } from '@components/StatusLabel'

const EXPECTED_LABELS: Record<RecorderState, string> = {
  idle: 'Ready',
  recording: 'Recording…',
  paused: 'Paused',
  reviewing: 'Recording complete',
  playing: 'Playing…',
}

describe('StatusLabel', () => {
  it.each(Object.entries(EXPECTED_LABELS))('should show the label for the %s state', (state, label) => {
    render(<StatusLabel state={state as RecorderState} />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
