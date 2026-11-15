import { act, renderHook } from '@testing-library/react'
import { useMp3Download } from '@hooks/useMp3Download'
import { downloadBlob } from '@services/fileDownload'
import { convertAudioUrlToMp3 } from '@services/mp3Encoder'

jest.mock('@services/mp3Encoder', () => ({ convertAudioUrlToMp3: jest.fn() }))
jest.mock('@services/fileDownload', () => ({ downloadBlob: jest.fn() }))
jest.mock('@services/logger', () => ({ logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } }))

const mockedConvert = jest.mocked(convertAudioUrlToMp3)
const mockedDownloadBlob = jest.mocked(downloadBlob)

afterEach(() => jest.clearAllMocks())

describe('useMp3Download', () => {
  it('should convert the recording and trigger a file download', async () => {
    const blob = new Blob(['mp3'])
    mockedConvert.mockResolvedValue(blob)
    const { result } = renderHook(() => useMp3Download('blob:recording'))

    await act(async () => {
      await result.current.handleDownload()
    })

    expect(mockedConvert).toHaveBeenCalledWith('blob:recording')
    expect(mockedDownloadBlob).toHaveBeenCalledWith({ blob, fileName: expect.stringMatching(/^recording-\d+\.mp3$/) })
    expect(result.current.isDownloading).toBe(false)
    expect(result.current.errorMessage).toBeUndefined()
  })

  it('should expose a friendly error message when conversion fails', async () => {
    mockedConvert.mockRejectedValue(new Error('decode failed'))
    const { result } = renderHook(() => useMp3Download('blob:recording'))

    await act(async () => {
      await result.current.handleDownload()
    })

    expect(result.current.errorMessage).toBe('We could not convert your recording to MP3. Please try again.')
    expect(mockedDownloadBlob).not.toHaveBeenCalled()
    expect(result.current.isDownloading).toBe(false)
  })

  it('should clear a previous error when a new download starts', async () => {
    mockedConvert.mockRejectedValueOnce(new Error('first failure')).mockResolvedValueOnce(new Blob(['mp3']))
    const { result } = renderHook(() => useMp3Download('blob:recording'))

    await act(async () => {
      await result.current.handleDownload()
    })
    await act(async () => {
      await result.current.handleDownload()
    })

    expect(result.current.errorMessage).toBeUndefined()
  })

  it('should do nothing when there is no recording', async () => {
    const { result } = renderHook(() => useMp3Download(undefined))

    await act(async () => {
      await result.current.handleDownload()
    })

    expect(mockedConvert).not.toHaveBeenCalled()
  })

  it('should ignore download requests while a conversion is running', async () => {
    let resolveConversion: (blob: Blob) => void = () => undefined
    mockedConvert.mockReturnValue(new Promise<Blob>(resolve => { resolveConversion = resolve }))
    const { result } = renderHook(() => useMp3Download('blob:recording'))
    let firstDownload: Promise<void> = Promise.resolve()

    act(() => {
      firstDownload = result.current.handleDownload()
    })
    await act(async () => {
      await result.current.handleDownload()
    })

    expect(result.current.isDownloading).toBe(true)
    expect(mockedConvert).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveConversion(new Blob(['mp3']))
      await firstDownload
    })
    expect(result.current.isDownloading).toBe(false)
  })
})
