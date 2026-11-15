import { floatTo16BitPcm } from '@utils/floatTo16BitPcm'

const MP3_BITRATE_KBPS = 128
const MP3_SAMPLES_PER_FRAME = 1152
const MAX_CHANNEL_COUNT = 2
const MP3_MIME_TYPE = 'audio/mpeg'

interface Mp3EncoderLike {
  encodeBuffer: (left: Int16Array, right?: Int16Array) => Uint8Array
  flush: () => Uint8Array
}

export async function convertAudioUrlToMp3(audioUrl: string): Promise<Blob> {
  const audioBuffer = await decodeAudio(audioUrl)
  const channelCount = Math.min(audioBuffer.numberOfChannels, MAX_CHANNEL_COUNT)
  const channels = Array.from({ length: channelCount }, (_, channelIndex) =>
    floatTo16BitPcm(audioBuffer.getChannelData(channelIndex)),
  )

  const { Mp3Encoder } = await import('@breezystack/lamejs')
  const encoder = new Mp3Encoder(channelCount, audioBuffer.sampleRate, MP3_BITRATE_KBPS)
  const frames = encodeFrames(encoder, channels)

  return new Blob([...frames, encoder.flush()] as BlobPart[], { type: MP3_MIME_TYPE })
}

async function decodeAudio(audioUrl: string): Promise<AudioBuffer> {
  const response = await fetch(audioUrl)
  if (!response.ok) {
    throw new Error(`[decodeAudio] Failed to fetch audio from ${audioUrl}: HTTP ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const audioContext = new AudioContext()
  try {
    return await audioContext.decodeAudioData(arrayBuffer)
  } finally {
    await audioContext.close()
  }
}

function encodeFrames(encoder: Mp3EncoderLike, channels: Int16Array[]): Uint8Array[] {
  const [left, right] = channels
  const frameCount = Math.ceil(left.length / MP3_SAMPLES_PER_FRAME)
  const frames = Array.from({ length: frameCount }, (_, frameIndex) => {
    const start = frameIndex * MP3_SAMPLES_PER_FRAME
    const end = start + MP3_SAMPLES_PER_FRAME
    const leftFrame = left.subarray(start, end)

    return right
      ? encoder.encodeBuffer(leftFrame, right.subarray(start, end))
      : encoder.encodeBuffer(leftFrame)
  })

  return frames.filter(frame => frame.length > 0)
}
