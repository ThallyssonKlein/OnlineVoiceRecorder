'use client'

import { useVoiceRecorder } from 'react-voice-recorder-kit'
import { RecorderControls } from '@components/RecorderControls'
import { RecordingPlayer } from '@components/RecordingPlayer'
import { StatusLabel } from '@components/StatusLabel'
import { Waveform } from '@components/Waveform'
import { useMp3Download } from '@hooks/useMp3Download'
import { formatTime } from '@utils/formatTime'

export default function Home() {
  const {
    state,
    seconds,
    levels,
    audioUrl,
    start,
    handlePause,
    handleResume,
    handleStop,
    handleRestart,
    handleDelete,
  } = useVoiceRecorder({ autoStart: false })
  const { isDownloading, errorMessage, handleDownload } = useMp3Download(audioUrl ?? undefined)

  const hasRecording = Boolean(audioUrl) && (state === 'reviewing' || state === 'playing')

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">
        <span className="text-4xl font-mono font-light text-gray-800 tabular-nums">{formatTime(seconds)}</span>
        <Waveform levels={levels} isActive={state === 'recording'} />
        <StatusLabel state={state} />
        <RecorderControls
          state={state}
          onStart={start}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onRestart={handleRestart}
          onDelete={handleDelete}
        />
        {hasRecording && audioUrl && (
          <RecordingPlayer
            audioUrl={audioUrl}
            isDownloading={isDownloading}
            errorMessage={errorMessage}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  )
}
