import { DownloadIcon } from '@components/icons/DownloadIcon'

interface RecordingPlayerProps {
  audioUrl: string
  isDownloading: boolean
  errorMessage: string | undefined
  onDownload: () => void
}

export function RecordingPlayer({ audioUrl, isDownloading, errorMessage, onDownload }: RecordingPlayerProps) {
  return (
    <div className="w-full flex flex-col gap-2 mt-1">
      <audio controls src={audioUrl} className="w-full" preload="auto" data-testid="recording-audio" />
      <button
        type="button"
        onClick={onDownload}
        disabled={isDownloading}
        className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isDownloading ? 'Converting…' : <DownloadLabel />}
      </button>
      {errorMessage && (
        <p role="alert" className="text-xs text-red-600 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

function DownloadLabel() {
  return (
    <>
      <DownloadIcon />
      Download MP3
    </>
  )
}
