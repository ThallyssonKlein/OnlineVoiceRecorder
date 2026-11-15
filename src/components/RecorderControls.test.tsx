import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { RecorderState } from 'react-voice-recorder-kit'
import { RecorderControls } from '@components/RecorderControls'

function makeHandlers() {
  return {
    onStart: jest.fn(),
    onPause: jest.fn(),
    onResume: jest.fn(),
    onStop: jest.fn(),
    onRestart: jest.fn(),
    onDelete: jest.fn(),
  }
}

function renderControls(state: RecorderState, handlers = makeHandlers()) {
  render(<RecorderControls state={state} {...handlers} />)

  return handlers
}

describe('RecorderControls', () => {
  it('should start recording from the idle state', async () => {
    const user = userEvent.setup()
    const handlers = renderControls('idle')

    await user.click(screen.getByRole('button', { name: 'Record' }))

    expect(handlers.onStart).toHaveBeenCalledTimes(1)
  })

  it('should offer pause and stop while recording', async () => {
    const user = userEvent.setup()
    const handlers = renderControls('recording')

    await user.click(screen.getByRole('button', { name: 'Pause' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))

    expect(handlers.onPause).toHaveBeenCalledTimes(1)
    expect(handlers.onStop).toHaveBeenCalledTimes(1)
  })

  it('should offer resume and stop while paused', async () => {
    const user = userEvent.setup()
    const handlers = renderControls('paused')

    await user.click(screen.getByRole('button', { name: 'Resume' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))

    expect(handlers.onResume).toHaveBeenCalledTimes(1)
    expect(handlers.onStop).toHaveBeenCalledTimes(1)
  })

  it.each<RecorderState>(['reviewing', 'playing'])('should offer record again and delete while %s', async state => {
    const user = userEvent.setup()
    const handlers = renderControls(state)

    await user.click(screen.getByRole('button', { name: 'Record again' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(handlers.onRestart).toHaveBeenCalledTimes(1)
    expect(handlers.onDelete).toHaveBeenCalledTimes(1)
  })
})
