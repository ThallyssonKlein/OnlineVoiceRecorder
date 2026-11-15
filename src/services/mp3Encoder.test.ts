import { Mp3Encoder } from '@breezystack/lamejs'
import { convertAudioUrlToMp3 } from '@services/mp3Encoder'

jest.mock('@breezystack/lamejs', () => ({ Mp3Encoder: jest.fn() }))

const FRAME_SIZE = 1152

interface FakeAudioOptions {
  channelCount: number
  sampleCount: number
  isFetchOk?: boolean
  decodeError?: Error
}

function installFakeAudio(options: FakeAudioOptions) {
  const { channelCount, sampleCount, isFetchOk = true, decodeError } = options
  const close = jest.fn().mockResolvedValue(undefined)
  const audioBuffer = {
    numberOfChannels: channelCount,
    sampleRate: 44100,
    getChannelData: jest.fn().mockReturnValue(new Float32Array(sampleCount)),
  }
  const decodeAudioData = decodeError
    ? jest.fn().mockRejectedValue(decodeError)
    : jest.fn().mockResolvedValue(audioBuffer)
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: isFetchOk,
    status: isFetchOk ? 200 : 404,
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
  }) as unknown as typeof fetch
  globalThis.AudioContext = jest.fn().mockImplementation(() => ({ decodeAudioData, close })) as unknown as typeof AudioContext

  return { close }
}

function installFakeEncoder(encodedFrame: Uint8Array) {
  const encodeBuffer = jest.fn().mockReturnValue(encodedFrame)
  const flush = jest.fn().mockReturnValue(new Uint8Array([9]))
  ;(Mp3Encoder as unknown as jest.Mock).mockImplementation(() => ({ encodeBuffer, flush }))

  return { encodeBuffer }
}

describe('convertAudioUrlToMp3', () => {
  it('should encode stereo audio frame by frame into an mpeg blob', async () => {
    installFakeAudio({ channelCount: 2, sampleCount: FRAME_SIZE * 2 })
    const { encodeBuffer } = installFakeEncoder(new Uint8Array([1, 2, 3]))

    const blob = await convertAudioUrlToMp3('blob:recording')

    expect(blob.type).toBe('audio/mpeg')
    expect(blob.size).toBe(3 + 3 + 1)
    expect(encodeBuffer).toHaveBeenCalledTimes(2)
    expect(encodeBuffer.mock.calls[0]).toHaveLength(2)
  })

  it('should encode mono audio with a single channel argument', async () => {
    installFakeAudio({ channelCount: 1, sampleCount: FRAME_SIZE })
    const { encodeBuffer } = installFakeEncoder(new Uint8Array([1]))

    await convertAudioUrlToMp3('blob:recording')

    expect(encodeBuffer.mock.calls[0]).toHaveLength(1)
  })

  it('should limit encoding to two channels', async () => {
    installFakeAudio({ channelCount: 6, sampleCount: FRAME_SIZE })
    installFakeEncoder(new Uint8Array([1]))

    await convertAudioUrlToMp3('blob:recording')

    expect(Mp3Encoder).toHaveBeenCalledWith(2, 44100, 128)
  })

  it('should drop empty encoder frames', async () => {
    installFakeAudio({ channelCount: 1, sampleCount: FRAME_SIZE })
    installFakeEncoder(new Uint8Array([]))

    const blob = await convertAudioUrlToMp3('blob:recording')

    expect(blob.size).toBe(1)
  })

  it('should reject with context when the audio cannot be fetched', async () => {
    installFakeAudio({ channelCount: 1, sampleCount: 0, isFetchOk: false })

    await expect(convertAudioUrlToMp3('blob:missing')).rejects.toThrow(
      '[decodeAudio] Failed to fetch audio from blob:missing: HTTP 404',
    )
  })

  it('should close the audio context when decoding fails', async () => {
    const { close } = installFakeAudio({ channelCount: 1, sampleCount: 0, decodeError: new Error('bad audio') })

    await expect(convertAudioUrlToMp3('blob:recording')).rejects.toThrow('bad audio')
    expect(close).toHaveBeenCalledTimes(1)
  })
})
