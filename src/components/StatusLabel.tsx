import type { RecorderState } from 'react-voice-recorder-kit'

interface StatusLabelProps {
  state: RecorderState
}

const STATUS_TEXT: Record<RecorderState, string> = {
  idle: 'Ready',
  recording: 'Recording…',
  paused: 'Paused',
  reviewing: 'Recording complete',
  playing: 'Playing…',
}

export function StatusLabel({ state }: StatusLabelProps) {
  return <span className="text-sm text-gray-400 uppercase tracking-widest h-4">{STATUS_TEXT[state]}</span>
}
