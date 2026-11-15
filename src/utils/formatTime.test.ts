import { formatTime } from '@utils/formatTime'

describe('formatTime', () => {
  it('should format zero seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('should pad single digit seconds', () => {
    expect(formatTime(7)).toBe('00:07')
  })

  it('should roll seconds over into minutes', () => {
    expect(formatTime(125)).toBe('02:05')
  })

  it('should keep minutes beyond one hour', () => {
    expect(formatTime(3725)).toBe('62:05')
  })
})
