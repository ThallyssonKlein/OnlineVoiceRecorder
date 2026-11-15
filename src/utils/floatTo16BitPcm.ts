const PCM_NEGATIVE_SCALE = 0x8000
const PCM_POSITIVE_SCALE = 0x7fff

export function floatTo16BitPcm(samples: Float32Array): Int16Array {
  return Int16Array.from(samples, sample => {
    const clamped = Math.max(-1, Math.min(1, sample))

    return clamped < 0 ? clamped * PCM_NEGATIVE_SCALE : clamped * PCM_POSITIVE_SCALE
  })
}
