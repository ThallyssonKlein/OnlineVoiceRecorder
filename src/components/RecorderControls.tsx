import type { ReactNode } from 'react'
import type { RecorderState } from 'react-voice-recorder-kit'
import { IconButton } from '@components/IconButton'
import { MicrophoneIcon } from '@components/icons/MicrophoneIcon'
import { PauseIcon } from '@components/icons/PauseIcon'
import { PlayIcon } from '@components/icons/PlayIcon'
import { RepeatIcon } from '@components/icons/RepeatIcon'
import { StopIcon } from '@components/icons/StopIcon'
import { TrashIcon } from '@components/icons/TrashIcon'

interface RecorderControlsProps {
  state: RecorderState
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onRestart: () => void
  onDelete: () => void
}

export function RecorderControls(props: RecorderControlsProps) {
  const { state, onStart, onPause, onResume, onStop, onRestart, onDelete } = props

  if (state === 'idle') {
    return (
      <ControlsRow>
        <IconButton onClick={onStart} title="Record" variant="primary">
          <MicrophoneIcon />
        </IconButton>
      </ControlsRow>
    )
  }

  if (state === 'recording' || state === 'paused') {
    return (
      <ControlsRow>
        <PauseResumeButton isRecording={state === 'recording'} onPause={onPause} onResume={onResume} />
        <IconButton onClick={onStop} title="Stop" variant="primary">
          <StopIcon />
        </IconButton>
      </ControlsRow>
    )
  }

  return (
    <ControlsRow>
      <IconButton onClick={onRestart} title="Record again">
        <RepeatIcon />
      </IconButton>
      <IconButton onClick={onDelete} title="Delete" variant="danger">
        <TrashIcon />
      </IconButton>
    </ControlsRow>
  )
}

function ControlsRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-4 mt-2">{children}</div>
}

interface PauseResumeButtonProps {
  isRecording: boolean
  onPause: () => void
  onResume: () => void
}

function PauseResumeButton({ isRecording, onPause, onResume }: PauseResumeButtonProps) {
  if (isRecording) {
    return (
      <IconButton onClick={onPause} title="Pause">
        <PauseIcon />
      </IconButton>
    )
  }

  return (
    <IconButton onClick={onResume} title="Resume">
      <PlayIcon />
    </IconButton>
  )
}
