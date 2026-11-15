import { logger } from '@services/logger'

describe('logger', () => {
  it('should delegate info messages to console.info', () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined)

    logger.info('[test] hello')

    expect(infoSpy).toHaveBeenCalledWith('[test] hello')
    infoSpy.mockRestore()
  })

  it('should delegate warnings to console.warn', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    logger.warn('[test] careful')

    expect(warnSpy).toHaveBeenCalledWith('[test] careful')
    warnSpy.mockRestore()
  })

  it('should delegate errors with their cause to console.error', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const cause = new Error('boom')

    logger.error('[test] failed', cause)

    expect(errorSpy).toHaveBeenCalledWith('[test] failed', cause)
    errorSpy.mockRestore()
  })
})
