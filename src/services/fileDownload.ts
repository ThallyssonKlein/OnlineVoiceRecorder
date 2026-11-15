interface DownloadBlobParams {
  blob: Blob
  fileName: string
}

export function downloadBlob({ blob, fileName }: DownloadBlobParams): void {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  link.click()
  URL.revokeObjectURL(objectUrl)
}
