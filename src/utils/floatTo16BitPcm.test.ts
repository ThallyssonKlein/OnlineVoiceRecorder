import { floatTo16BitPcm } from '@utils/floatTo16BitPcm'

describe('floatTo16BitPcm', () => {
  it('should map full scale samples to the 16-bit range', () => {
    const pcm = floatTo16BitPcm(new Float32Array([1, -1, 0]))

    expect(Array.from(pcm)).toEqual([32767, -32768, 0])
  })

  it('should clamp samples outside the -1 to 1 range', () => {
    const pcm = floatTo16BitPcm(new Float32Array([2, -2]))

    expect(Array.from(pcm)).toEqual([32767, -32768])
  })

  it('should return an empty array for empty input', () => {
    expect(floatTo16BitPcm(new Float32Array([])).length).toBe(0)
  })
})
