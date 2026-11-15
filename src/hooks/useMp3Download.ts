import { useState } from 'react'
import { downloadBlob } from '@services/fileDownload'
import { logger } from '@services/logger'
import { convertAudioUrlToMp3 } from '@services/mp3Encoder'

const DOWNLOAD_ERROR_MESSAGE = 'We could not convert your recording to MP3. Please try again.'
const DOWNLOAD_FILE_PREFIX = 'recording'

interface UseMp3DownloadResult {
  isDownloading: boolean
  errorMessage: string | undefined
  handleDownload: () => Promise<void>
}

export function useMp3Download(audioUrl: string | undefined): UseMp3DownloadResult {
  const [isDownloading, setIsDownloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const handleDownload = async () => {
    if (!audioUrl || isDownloading) return

    setIsDownloading(true)
    setErrorMessage(undefined)
    try {
      const blob = await convertAudioUrlToMp3(audioUrl)
      downloadBlob({ blob, fileName: `${DOWNLOAD_FILE_PREFIX}-${Date.now()}.mp3` })
    } catch (err: unknown) {
      logger.error('[useMp3Download] failed to convert recording to MP3', err)
      setErrorMessage(DOWNLOAD_ERROR_MESSAGE)
    } finally {
      setIsDownloading(false)
    }
  }

  return { isDownloading, errorMessage, handleDownload }
}
