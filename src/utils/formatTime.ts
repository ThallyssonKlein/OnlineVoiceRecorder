const SECONDS_PER_MINUTE = 60
const TIME_SEGMENT_WIDTH = 2

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE)
  const seconds = totalSeconds % SECONDS_PER_MINUTE

  return `${padSegment(minutes)}:${padSegment(seconds)}`
}

function padSegment(value: number): string {
  return value.toString().padStart(TIME_SEGMENT_WIDTH, '0')
}
