'use client'
import { useVoiceRecorder } from 'react-voice-recorder-kit'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function Waveform({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-10">
      {levels.map((lvl, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-75 ${active ? 'bg-red-500' : 'bg-gray-300'}`}
          style={{ height: `${Math.max(4, lvl * 40)}px` }}
        />
      ))}
    </div>
  )
}

function IconButton({
  onClick,
  title,
  children,
  variant = 'default',
  disabled = false,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  disabled?: boolean
}) {
  const styles = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    primary: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
    danger: 'bg-red-100 hover:bg-red-200 text-red-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-500',
  }
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

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
    handlePlay,
    handleRestart,
    handleDelete,
  } = useVoiceRecorder({ autoStart: false })

  const isIdle = state === 'idle'
  const isRecording = state === 'recording'
  const isPaused = state === 'paused'
  const isReviewing = state === 'reviewing'
  const isPlaying = state === 'playing'

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">

        {/* Timer */}
        <span className="text-4xl font-mono font-light text-gray-800 tabular-nums">
          {formatTime(seconds)}
        </span>

        {/* Waveform */}
        <Waveform levels={levels} active={isRecording} />

        {/* Status label */}
        <span className="text-sm text-gray-400 uppercase tracking-widest h-4">
          {isIdle && 'Pronto'}
          {isRecording && 'Gravando…'}
          {isPaused && 'Pausado'}
          {isReviewing && 'Gravação concluída'}
          {isPlaying && 'Reproduzindo…'}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-2">
          {/* Record / stop */}
          {(isIdle) && (
            <IconButton onClick={start} title="Gravar" variant="primary">
              {/* mic */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 17.93V21H9v2h6v-2h-2v-2.07A8.001 8.001 0 0 0 20 11h-2a6 6 0 0 1-12 0H4a8.001 8.001 0 0 0 7 6.93z"/>
              </svg>
            </IconButton>
          )}

          {(isRecording || isPaused) && (
            <>
              {/* Pause / Resume */}
              {isRecording ? (
                <IconButton onClick={handlePause} title="Pausar" variant="default">
                  {/* pause */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                </IconButton>
              ) : (
                <IconButton onClick={handleResume} title="Retomar" variant="default">
                  {/* play */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                </IconButton>
              )}

              {/* Stop */}
              <IconButton onClick={handleStop} title="Parar" variant="primary">
                {/* stop */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                </svg>
              </IconButton>
            </>
          )}

          {(isReviewing || isPlaying) && (
            <>
              {/* Play */}
              <IconButton onClick={handlePlay} title="Ouvir" variant="primary" disabled={isPlaying}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </IconButton>

              {/* Record again */}
              <IconButton onClick={handleRestart} title="Gravar novamente" variant="default">
                {/* repeat */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"/>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  <polyline points="7 23 3 19 7 15"/>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
              </IconButton>

              {/* Delete */}
              <IconButton onClick={handleDelete} title="Excluir" variant="danger">
                {/* trash */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </IconButton>
            </>
          )}
        </div>

        {/* Audio player */}
        {audioUrl && (isReviewing || isPlaying) && (
          <audio controls src={audioUrl} className="w-full mt-2" />
        )}
      </div>
    </div>
  )
}
